// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/StoveraEscrow.sol";

contract StoveraEscrowTest is Test {
    StoveraEscrow public escrow;

    address public owner = address(this);
    address public user = makeAddr("user");
    address public operator = makeAddr("operator");
    address payable public agentOp = payable(makeAddr("agentOperator"));

    bytes32 constant TASK_ID = keccak256("test-task-001");
    uint256 constant DEPOSIT = 0.003 ether;

    function setUp() public {
        escrow = new StoveraEscrow();
        escrow.addOperator(operator);

        // Fund user
        vm.deal(user, 1 ether);
    }

    // ─── depositForTask ────────────────────────────────────────────────────

    function test_DepositCreatesTask() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        StoveraEscrow.Task memory task = escrow.getTask(TASK_ID);
        assertEq(task.user, user);
        assertEq(task.agentOperator, agentOp);
        assertEq(task.deposit, DEPOSIT);
        assertEq(uint8(task.status), uint8(StoveraEscrow.TaskStatus.Pending));
    }

    function test_DepositEmitsEvent() public {
        vm.expectEmit(true, true, true, true);
        emit StoveraEscrow.TaskCreated(TASK_ID, user, agentOp, DEPOSIT);

        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);
    }

    function test_RevertIf_NoEth() public {
        vm.prank(user);
        vm.expectRevert("No ETH sent");
        escrow.depositForTask{value: 0}(TASK_ID, agentOp);
    }

    function test_RevertIf_DuplicateTaskId() public {
        vm.startPrank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);
        vm.expectRevert("Task ID already exists");
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);
        vm.stopPrank();
    }

    // ─── completeTask ──────────────────────────────────────────────────────

    function test_CompleteTask_PaymentAndRefund() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        uint256 actualCost = 0.001 ether;
        uint256 expectedRefund = DEPOSIT - actualCost;

        uint256 agentBalBefore = agentOp.balance;
        uint256 userBalBefore = user.balance;

        vm.prank(operator);
        escrow.completeTask(TASK_ID, actualCost);

        assertEq(agentOp.balance - agentBalBefore, actualCost);
        assertEq(user.balance - userBalBefore, expectedRefund);

        StoveraEscrow.Task memory task = escrow.getTask(TASK_ID);
        assertEq(uint8(task.status), uint8(StoveraEscrow.TaskStatus.Completed));
        assertEq(task.actualCost, actualCost);
    }

    function test_CompleteTask_FullCost_NoRefund() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        uint256 userBalBefore = user.balance;

        vm.prank(operator);
        escrow.completeTask(TASK_ID, DEPOSIT); // full deposit used

        assertEq(user.balance, userBalBefore); // no refund
        assertEq(agentOp.balance, DEPOSIT);
    }

    function test_RevertIf_CostExceedsDeposit() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        vm.prank(operator);
        vm.expectRevert("Actual cost exceeds deposit");
        escrow.completeTask(TASK_ID, DEPOSIT + 1);
    }

    function test_RevertIf_NonOperatorCompletes() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        vm.prank(user); // user is not operator
        vm.expectRevert("Not operator");
        escrow.completeTask(TASK_ID, 0.001 ether);
    }

    // ─── cancelTask ────────────────────────────────────────────────────────

    function test_UserCanCancelPendingTask() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        uint256 userBalBefore = user.balance;

        vm.prank(user);
        escrow.cancelTask(TASK_ID);

        assertEq(user.balance - userBalBefore, DEPOSIT); // full refund
        assertEq(uint8(escrow.getTask(TASK_ID).status), uint8(StoveraEscrow.TaskStatus.Cancelled));
    }

    function test_OperatorCanCancelPendingTask() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        vm.prank(operator);
        escrow.cancelTask(TASK_ID);

        assertEq(uint8(escrow.getTask(TASK_ID).status), uint8(StoveraEscrow.TaskStatus.Cancelled));
    }

    function test_RevertIf_CancelExecutingTask() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        vm.prank(operator);
        escrow.markExecuting(TASK_ID);

        vm.prank(user);
        vm.expectRevert("Can only cancel pending tasks");
        escrow.cancelTask(TASK_ID);
    }

    // ─── markExecuting ─────────────────────────────────────────────────────

    function test_MarkExecuting() public {
        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        vm.prank(operator);
        escrow.markExecuting(TASK_ID);

        assertEq(uint8(escrow.getTask(TASK_ID).status), uint8(StoveraEscrow.TaskStatus.Executing));
    }

    // ─── operator management ───────────────────────────────────────────────

    function test_AddAndRemoveOperator() public {
        address newOp = makeAddr("newOp");
        escrow.addOperator(newOp);
        assertTrue(escrow.isOperator(newOp));

        escrow.removeOperator(newOp);
        assertFalse(escrow.isOperator(newOp));
    }

    function test_RevertIf_NonOwnerAddsOperator() public {
        vm.prank(user);
        vm.expectRevert("Not owner");
        escrow.addOperator(makeAddr("x"));
    }

    // ─── fuzz ──────────────────────────────────────────────────────────────

    function testFuzz_CompleteTask(uint256 actualCost) public {
        actualCost = bound(actualCost, 0, DEPOSIT);

        vm.prank(user);
        escrow.depositForTask{value: DEPOSIT}(TASK_ID, agentOp);

        vm.prank(operator);
        escrow.completeTask(TASK_ID, actualCost);

        assertEq(agentOp.balance, actualCost);
        assertEq(user.balance, 1 ether - DEPOSIT + (DEPOSIT - actualCost));
    }
}

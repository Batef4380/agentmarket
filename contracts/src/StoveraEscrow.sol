// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title StoveraEscrow
/// @notice Handles task deposits, completions, and refunds for the Stovera agent marketplace.
/// @dev User deposits ETH (depositMultiplier × estimated cost). Operator settles with actual cost.
///      Excess is automatically refunded to the user.
contract StoveraEscrow {
    // ─── Types ───────────────────────────────────────────────────────────────

    enum TaskStatus {
        Pending,    // deposit received, task queued
        Executing,  // operator started the task
        Completed,  // actual cost deducted, refund sent
        Cancelled   // full refund to user
    }

    struct Task {
        address user;
        address payable agentOperator; // who receives payment on completion
        uint256 deposit;               // total ETH held
        uint256 actualCost;            // set on completion
        TaskStatus status;
        uint256 createdAt;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    address public owner;
    mapping(bytes32 => Task) public tasks;
    mapping(address => bool) public operators;

    // ─── Events ───────────────────────────────────────────────────────────────

    event TaskCreated(
        bytes32 indexed taskId,
        address indexed user,
        address indexed agentOperator,
        uint256 deposit
    );
    event TaskExecuting(bytes32 indexed taskId);
    event TaskCompleted(
        bytes32 indexed taskId,
        uint256 actualCost,
        uint256 refunded
    );
    event TaskCancelled(bytes32 indexed taskId, uint256 refunded);
    event OperatorAdded(address indexed operator);
    event OperatorRemoved(address indexed operator);

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyOperator() {
        require(operators[msg.sender], "Not operator");
        _;
    }

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
        operators[msg.sender] = true;
    }

    // ─── Owner functions ──────────────────────────────────────────────────────

    function addOperator(address op) external onlyOwner {
        require(op != address(0), "Zero address");
        operators[op] = true;
        emit OperatorAdded(op);
    }

    function removeOperator(address op) external onlyOwner {
        operators[op] = false;
        emit OperatorRemoved(op);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        owner = newOwner;
    }

    // ─── Core functions ───────────────────────────────────────────────────────

    /// @notice User deposits ETH to start a task. taskId is generated off-chain (keccak of uuid).
    /// @param taskId    Unique identifier (e.g. keccak256 of a UUID)
    /// @param agentOperator Address that will receive payment on completion
    function depositForTask(bytes32 taskId, address payable agentOperator) external payable {
        require(msg.value > 0, "No ETH sent");
        require(tasks[taskId].user == address(0), "Task ID already exists");
        require(agentOperator != address(0), "Invalid operator address");

        tasks[taskId] = Task({
            user: msg.sender,
            agentOperator: agentOperator,
            deposit: msg.value,
            actualCost: 0,
            status: TaskStatus.Pending,
            createdAt: block.timestamp
        });

        emit TaskCreated(taskId, msg.sender, agentOperator, msg.value);
    }

    /// @notice Operator marks task as executing (optional, for UX tracking).
    function markExecuting(bytes32 taskId) external onlyOperator {
        Task storage task = tasks[taskId];
        require(task.user != address(0), "Task not found");
        require(task.status == TaskStatus.Pending, "Not pending");

        task.status = TaskStatus.Executing;
        emit TaskExecuting(taskId);
    }

    /// @notice Operator settles task: deducts actualCost, refunds remainder to user.
    /// @param taskId     The task to complete
    /// @param actualCost ETH (in wei) actually consumed — must be <= deposit
    function completeTask(bytes32 taskId, uint256 actualCost) external onlyOperator {
        Task storage task = tasks[taskId];
        require(task.user != address(0), "Task not found");
        require(
            task.status == TaskStatus.Pending || task.status == TaskStatus.Executing,
            "Task not active"
        );
        require(actualCost <= task.deposit, "Actual cost exceeds deposit");

        task.actualCost = actualCost;
        task.status = TaskStatus.Completed;

        // Pay agent operator
        if (actualCost > 0) {
            task.agentOperator.transfer(actualCost);
        }

        // Refund excess to user
        uint256 refund = task.deposit - actualCost;
        if (refund > 0) {
            payable(task.user).transfer(refund);
        }

        emit TaskCompleted(taskId, actualCost, refund);
    }

    /// @notice Cancel a pending task and return full deposit to user.
    ///         Can be called by the user or an operator.
    function cancelTask(bytes32 taskId) external {
        Task storage task = tasks[taskId];
        require(task.user != address(0), "Task not found");
        require(task.status == TaskStatus.Pending, "Can only cancel pending tasks");
        require(
            msg.sender == task.user || operators[msg.sender],
            "Not authorized"
        );

        task.status = TaskStatus.Cancelled;
        payable(task.user).transfer(task.deposit);

        emit TaskCancelled(taskId, task.deposit);
    }

    // ─── Views ────────────────────────────────────────────────────────────────

    function getTask(bytes32 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }

    function isOperator(address addr) external view returns (bool) {
        return operators[addr];
    }
}

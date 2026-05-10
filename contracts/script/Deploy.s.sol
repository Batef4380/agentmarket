// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/StoveraEscrow.sol";

contract DeployStoveraEscrow is Script {
    function run() external {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployerAddr = vm.addr(deployerKey);

        vm.startBroadcast(deployerKey);

        StoveraEscrow escrow = new StoveraEscrow();

        console.log("StoveraEscrow deployed at:", address(escrow));
        console.log("Owner:", deployerAddr);

        vm.stopBroadcast();
    }
}

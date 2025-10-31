// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IVPOProofRegistry } from "../interfaces/IVPOProofRegistry.sol";

contract VPOCore {
    address public owner;
    IVPOProofRegistry public proofRegistry;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address proofRegistry_) {
        owner = msg.sender;
        proofRegistry = IVPOProofRegistry(proofRegistry_);
    }

    function setProofRegistry(address proofRegistry_) external onlyOwner {
        proofRegistry = IVPOProofRegistry(proofRegistry_);
    }

    function registerProofMinimal(bytes32 cid) external returns (bool) {
        return proofRegistry.registerProof(cid, msg.sender);
    }
}



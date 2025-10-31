// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVPOProofRegistry {
    event ProofRegistered(bytes32 indexed cid, address indexed operator);

    function totalProofs() external view returns (uint256);
    function validProofs() external view returns (uint256);
    function proofExists(bytes32 cid) external view returns (bool);
    function registerProof(bytes32 cid, address operator) external returns (bool);
}



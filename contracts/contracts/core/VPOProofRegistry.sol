// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IVPOProofRegistry } from "../interfaces/IVPOProofRegistry.sol";

contract VPOProofRegistry is IVPOProofRegistry {
    uint256 private _totalProofs;
    uint256 private _validProofs;
    mapping(bytes32 => bool) private _proofs;

    function totalProofs() external view override returns (uint256) {
        return _totalProofs;
    }

    function validProofs() external view override returns (uint256) {
        return _validProofs;
    }

    function proofExists(bytes32 cid) external view override returns (bool) {
        return _proofs[cid];
    }

    function registerProof(bytes32 cid, address /*operator*/ ) external override returns (bool) {
        require(!_proofs[cid], "Already registered");
        _proofs[cid] = true;
        unchecked { _totalProofs += 1; _validProofs += 1; }
        emit ProofRegistered(cid, msg.sender);
        return true;
    }
}



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IVPOVerifier } from "../interfaces/IVPOVerifier.sol";

contract VPOVerifier is IVPOVerifier {
    function verify(bytes calldata /*data*/ ) external pure override returns (bool) {
        return true;
    }
}



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVPOVerifier {
    function verify(bytes calldata data) external view returns (bool);
}



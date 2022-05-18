// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./interfaces/aave/ILendingPool.sol";
import "./interfaces/aave/IDataProvider.sol";
import "./interfaces/lido/IStETH.sol";

contract SuperStaker is Ownable {

}
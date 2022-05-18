// SPDX-License-Identifier: MIT

pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./interfaces/aave/ILendingPool.sol";
import "./interfaces/aave/IDataProvider.sol";
import "./interfaces/lido/IStETH.sol";
import "./interfaces/IWETH9.sol";

contract SuperStaker is Ownable, Pausable, ReentrancyGuard {
    using SafeMath for uint256;

    IStETH public steth;
    IWETH9 public weth;
    address public referral;

    // Aave:
    address public aToken;
    address public varDebtToken;
    ILendingPool public pool;

    constructor(address payable _weth, address _steth, address _dataProvider, address _pool, address _referral) {
        steth = IStETH(_steth);
        weth = IWETH9(_weth);
        referral = _referral;

        pool = ILendingPool(_pool);
        (aToken,,) = IDataProvider(_dataProvider).getReserveTokensAddresses(_steth);
        (,,varDebtToken) = IDataProvider(_dataProvider).getReserveTokensAddresses(_weth);

        steth.approve(_pool, 2**256 - 1);
    }

    // @dev SuperStakes native ETH sent to the function
    function stake() payable external nonReentrant {
        address sender = msg.sender;
        require(msg.value != 0, "ZERO_DEPOSIT");

        // @dev stake ETH in Lido
        uint256 shares = steth.submit{value: msg.value}(referral);

        // @dev get sender Aave stats TODO: remove vars not needed
        (uint256 totalCollateralETH,
        uint256 totalDebtETH,
        uint256 availableBorrowsETH,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor) = pool.getUserAccountData(sender);

        console.log("totalCollateralETH", totalCollateralETH);
        console.log("totalDebtETH", totalDebtETH);
        console.log("availableBorrowsETH", availableBorrowsETH);
        console.log("currentLiquidationThreshold", currentLiquidationThreshold);
        console.log("ltv", ltv);
        console.log("healthFactor", healthFactor);

        

    }

}
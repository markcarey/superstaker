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
//import "./interfaces/aave/IDataProvider.sol";
import "./interfaces/aave/IFlashLoanReceiver.sol";
import "./interfaces/lido/IStETH.sol";
import "./interfaces/IWETH9.sol";

contract SuperStaker is Ownable, Pausable, ReentrancyGuard, IFlashLoanReceiver {
    using SafeMath for uint256;
    using SafeERC20 for IStETH;

    IStETH public steth;
    IWETH9 public weth;
    address public referral;

    // Aave:
    //address public aToken;
    //address public varDebtToken;
    ILendingPool public pool;

    constructor(address payable _weth, address _steth, address _dataProvider, address _pool, address _referral) {
        steth = IStETH(_steth);
        weth = IWETH9(_weth);
        referral = _referral;

        pool = ILendingPool(_pool);
        //(aToken,,) = IDataProvider(_dataProvider).getReserveTokensAddresses(_steth);
        //(,,varDebtToken) = IDataProvider(_dataProvider).getReserveTokensAddresses(_weth);

        steth.approve(_pool, 2**256 - 1);
    }

    // @dev SuperStakes native ETH sent to the function
    function stake(uint256 factor) payable external nonReentrant {
        require(msg.value != 0, "ZERO_DEPOSIT");
        uint256 loanAmt = msg.value.mul(factor).div(100);
        _stake(loanAmt);      
    }

    // @dev sender already has stETH and want to superStake
    function superStake(uint256 shares, uint256 factor) external nonReentrant {
        // @dev tranfer stETH to this contract (temporaily) - must get approval first
        steth.safeTransferFrom(msg.sender, address(this), shares);
        uint256 loanAmt = shares.mul(factor).div(100);
        _stake(loanAmt);   
    }

    function _stake(uint256 loanAmt) internal {
        // @dev stake ETH in Lido
        //uint256 shares = steth.submit{value: msg.value}(referral);

        // @dev get sender Aave stats TODO: remove vars not needed
        (uint256 totalCollateralETH,
        uint256 totalDebtETH,
        uint256 availableBorrowsETH,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor) = pool.getUserAccountData(msg.sender);

        console.log("totalCollateralETH", totalCollateralETH);
        console.log("totalDebtETH", totalDebtETH);
        console.log("availableBorrowsETH", availableBorrowsETH);
        console.log("currentLiquidationThreshold", currentLiquidationThreshold);
        console.log("ltv", ltv);
        console.log("healthFactor", healthFactor);

        address[] memory assets = new address[](1);
        assets[0] = address(weth);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = loanAmt;

        // 0 = no debt, 1 = stable, 2 = variable
        uint256[] memory modes = new uint256[](1);
        modes[0] = 2;

        address onBehalfOf = msg.sender;

        console.log("address(this)", address(this));
        console.log("length", assets.length);
        console.log("assets", assets[0]);
        console.log("amounts", amounts[0]);
        console.log("modes", modes[0]);
        console.log("onBehalfOf", onBehalfOf);
        console.logBytes(abi.encode(msg.sender));
        console.log("referrer", uint16(0));

        pool.flashLoan(
            address(this),
            assets,
            amounts,
            modes,
            onBehalfOf,
            abi.encode(msg.sender),
            uint16(0)
        );
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    )
        external
        override
        returns (bool)
    {
        console.log("start exec");
        require(msg.sender == address(pool), 'CALLER_MUST_BE_LENDING_POOL');
        console.log("initiator", initiator);
        console.log("amount", amounts[0]);
        console.log("premium", premiums[0]);
        //uint amountOwing = amounts[0].add(premiums[0]);

        (address sender) = abi.decode(params, (address));
        console.log("sender", sender);

        weth.withdraw(amounts[0]);

        console.log("ETH balance before staking", address(this).balance);

        // @dev stake inital msg.value + flash loan proceeds via Lido
        steth.submit{value: address(this).balance}(referral);

        // @dev deposit resulting stETH as collateral in Aave
        pool.deposit(address(steth), steth.balanceOf(address(this)), sender, 0);
        
        return true;
    }

    receive() external payable {}

    fallback() external payable {}

}
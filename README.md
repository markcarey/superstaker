# SuperStaker

SuperStaker is a tool that supercharges your staking yields by supply your Lido Staked ETH as collateral on Aave and borrowing ETH against it to stake even more ETH. Even after the interest paid on the debt, you could more than double your staking APR.

## What it does

Whether you have ETH or already have some stETH, you can use SuperStaker to boost your staking rewards. SuperStaker borrows ETH on your behalf and stakes the proceeds with LIDO, and deposits the resulting stETH as collateral against the loan. While you will have to pay interest on the debt, this is more than covered by staking rewards from Lido. In this manner, you can more than double your APR. The risk of liquidation is low because stETH is pegged (or near-pegged) to ETH, so when the value of stETH goes down, so does the value of your debt. After the merge, staking APR will increase further, and SuperStaker can boost it even further.

## How it works

SuperStaker uses the Lido liquid staking protocol to stake ETH that you supply, plus ETH proceeds borrowed from Aave.

Target LTV:
In addition to the amount of ETH you want to stake, you also specify at target LTV (loan-to-value) ratio. The LTV determines how much will be borrowed on your behalf. The current maximum LTV for stETH on Aave is 69%.  The higher the LTV you choose, the lower your Aave Health Factor will be, and the higher your risk. The higher the LTV chosen, the higher your net APR will be.

After SuperStaking, you will have debt approximately equal to the LTV chosen. For example, if you choose 69%, then the Aave debt will be ~69% the value of the supplied (deposited) stETH in Aave.
The debt will be initiated via an Aave flash loan.


Recursive Leverage Simulation:
Rather than recursively leveraging by incrementally borrowing, staking, and depositing, the magic of SuperStaker simulates 15 levels of recursive leverage, and calculates the final amount of deposited stETH and WETH debt. This simulation happens in your browser, before any transactions are sent. Once the final loan amount is calculated, an Aave Flash Loan is trigger for the full amount.

Flash Loan:
What is a flash loan? A flash loan is a loan that is usually repaid within the same transaction, and thus no collateral is required. Some types of flash loans -- as used by SuperStaker -- are not repaid at the end of the transaction, but rather incur debt as long as sufficient collateral is supplied before the end of the same transaction.

Stake ETH with Lido:
Once the requested WETH loan has been provided to SuperStaker, the WETH is unwrapped to native ETH. This ETH is then added to the ETH you sent initially and the combined amount is staked via LIDO, returning 1 stETH for each ETH staked.

Deposit stETH with Aave:
The final step is to deposit the stETH as collateral on Aave against the debt triggered by the flash loan.
SuperStaker works on your Behalf.

The above steps are taken on your behalf, and you can then go the Aave Dashboard and see both the supplied stETH and borrowed WETH.  The SuperStaker contract is designed to have Zero TVL.

Zero TVL:
SuperStaker holds no ETH, stETH, WETH, nor any debt. Zero TVL. This is by design.

At the end of your SuperStaker transaction, you have stETH supplied to Aave and you have debt provided by Aave. SuperStaker does not act a vault, as some protocols do. SuperStaker does not issue shares, you hold only Aave issued tokens. As such, the SuperStaker contract does not hold funds that could be compromised by a malicious hacker.

How Zero TVL?
The first step is for you to "approve delegation", which means that you are giving SuperStaking the ability top incur debt on your behalf. That said, note that Aave will not let you incur debt if you are not also holding sufficient collateral. So you are basically saying: If SuperStaker provides me with enough collateral, then SuperStaker can incur this specific amount of debt on my behalf.

The final step that the SuperStaker transaction takes is to deposit the stETH collateral with Aave, to cover the debt. This deposit is sent to Aave on your behalf, meaning that Aave credits your address with the deposit and issues aSTETH tokens to you directly.

## Next Steps

- Support hybrid scenarios where the user already some stETH supplied to Aave, or want to use both ETH and stETH as a starting point, etc.
- Support for eMode on Aave V3 .... just waiting for this to be launched on Ethereum Mainnet (hint, hint)
- Support for SuperStaking stMATIC on the Polygon network .... just waiting for stMATIC to be supported as collateral on Aave Polygon market
- Feature to unwind or rebalance based a new target LTV. (But maybe this feature isn't needed as Aave's "repay with collateral" feature may suffice here)
- Other? Ideas welcome!

Live on Etheruem Mainnet: https://etherscan.io/address/0xda3231d0ad3dd50c1b33c167db27e6200f2c92d0
Wallets supported: Metamask, WalletConnect

Subgraph: https://thegraph.com/explorer/subgraph?id=FnzRRPgTa4rdSpDHmAkeYbTDoMf1YuA7FkoDTPTz1RC1&view=Overview

App: https://superstaker.xyz
Twitter: https://twitter.com/super_staker
Discord: https://discord.gg/UBBzx8zbWT


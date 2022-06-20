# This program interacts with Ethereum network to grab ERC20 token balances and finds the quotes when converted to another token in 1Inch exchange.
inputs are passed in \src\data\input.contract.token-list
InputContractTokenAddresses contains the contract and token addresses to retrieve the balances. 1Exchange is then used to get the quotes for swapping to another token. You can change the ToTokenAddress to swap to different token.
p.s errors are not handled properly. If wrong contract or token addresses are given, it might break the program.

## Before running the program,
 Update the "provider" value in src\data\configs.ts to any provider.
 Then
 run yarn install
 run yarn build
 run yarn start

### if you update the input.contract.token-list or config file, you have to rebuild the program

#### Improvements
- update the GetERC20Balance() to use batch request for faster look up
- async functions are made to wait by 'await new Promise<void>((resolve, reject)' hack. Need to refactor.
- handle errors from passing wrong contract or token address

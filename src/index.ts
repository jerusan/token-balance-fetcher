import { InputContractTokenAddresses, ToTokenAddress } from "./data/input.contract.token-list";
import { Configs } from "./data/configs";
import { ExchangeContext } from "./exchanges/ExchangeContext";
import { OneInchExchange } from "./exchanges/OneInch/oneInchExchange";
import { EthereumClient } from "./web3-clients/ethereum-client";
import BN = require('bn.js');

// init web3 client with a provider
var web3ClientHelper = new EthereumClient(Configs.provider);

//init 1Inch Exchange 
const exchangeContext = new ExchangeContext(new OneInchExchange);

/*
TODO: below function need to be regfactored further
*/

// Get the balances for the tokens
web3ClientHelper.getTokenListDetails(InputContractTokenAddresses)
.then(tokenInfos => {   

    // Find the quotes from the Exchange
    exchangeContext.GetSwapQuotesTotal(tokenInfos, ToTokenAddress, )
    .then(swapQuotesTotalResult => {

        swapQuotesTotalResult.swapTokenPairs.forEach(tokenPair => {
            console.log(tokenPair.from.address, '(' + tokenPair.from.symbol + ') =', tokenPair.to.amount, '(' + tokenPair.to.symbol + ')');
        });

        console.log(swapQuotesTotalResult.total, swapQuotesTotalResult.swapTokenPairs[0].to.symbol);
    });     
});

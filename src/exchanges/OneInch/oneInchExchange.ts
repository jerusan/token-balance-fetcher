import axios from "axios";
import { URLSearchParams } from "url";
import Web3 from "web3";
import { Configs } from "../../data/configs";
import { SwapQuotesTotal, SwapTokenPair } from "../../shared/model/swap-quote-total.model";
import { SwapQuoteResponse } from "../../shared/model/swap-quote.model";
import { TokenInfo } from "../../shared/model/token-info.model";
import { IExchange } from "../IExchange";
import { SwapQuoteRequest } from "./models/swap-quote-request.model";
import { TokenInfoDto } from "./models/oneExchangeDtos/quote-response-dto.model";
import BN = require('bn.js');

export class OneInchExchange implements IExchange {
    private exchangeHostname: string = Configs.exchanges["one-inch"].hostname;
    private polygonChainId: string = Configs.exchanges["one-inch"].polygonChainId;

    public async GetSwapQuote(fromTokens: TokenInfo[], toTokenAddress: string): Promise<SwapQuoteResponse[]> { 
        var results: SwapQuoteResponse[] = [];

        const endpoints = fromTokens.map( fromToken => {
            let parameters:  SwapQuoteRequest = {
                fromTokenAddress: fromToken.address,
                toTokenAddress: toTokenAddress,
                amount: fromToken.amount
            };

            return  this.exchangeHostname + this.polygonChainId +  'quote?' + new URLSearchParams(parameters);   
        });
        
        await Promise.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
            axios.spread((...allData) => {
               allData.forEach(element => {
                let quote = element.data as SwapQuoteResponse;
                results.push(quote);
              })
            })
          );

          return results;
    }

    public async GetSwapQuotesTotal(fromTokens: TokenInfo[], toToken:string): Promise<SwapQuotesTotal> {
        var result =  <SwapQuotesTotal>{};
        result.swapTokenPairs = [];
        var total: BN = new BN(0);
        var tokenCount = 0;
        await new Promise<void>((resolve, reject) =>{
        this.GetSwapQuote(fromTokens, toToken)
         .then(quotes => {
            quotes.forEach(quote => {
                var swapPair = <SwapTokenPair>{};
                swapPair.from = this.fillTokenInfo(quote.fromToken, quote.fromTokenAmount);
                swapPair.to = this.fillTokenInfo(quote.toToken, quote.toTokenAmount);

                result.swapTokenPairs.push(swapPair);
                const amountInBNFormat = Web3.utils.toBN(quote.toTokenAmount);            
                total = total.add(amountInBNFormat);    
                tokenCount++;
                if(fromTokens.length == tokenCount) resolve();      
            });
         })
        });

        // TODO: make to 'ether' units generic by passing as input parameter
         const totalInEtherUnits = Web3.utils.fromWei(total, 'ether').toString(); 
         result.total = totalInEtherUnits;
         return result;
    }

    private fillTokenInfo(infoDto: TokenInfoDto, amount: string): TokenInfo {
        const amountInBNFormat = Web3.utils.toBN(amount);   
        // TODO: convert the amount from wei to whatever units is passed the input parameter  
        const amountInEther = Web3.utils.fromWei(amountInBNFormat, 'ether').toString(); 
        var tokenInfo: TokenInfo = {
            address: infoDto.address,
            symbol: infoDto.symbol,
            amount: amountInEther
        }
        return tokenInfo;
    }

}



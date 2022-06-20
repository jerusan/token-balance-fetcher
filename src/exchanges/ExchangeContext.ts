import { SwapQuotesTotal } from "../shared/model/swap-quote-total.model";
import { SwapQuoteResponse } from "../shared/model/swap-quote.model";
import { TokenInfo } from "../shared/model/token-info.model";
import { IExchange } from "./IExchange";

/*
using strategy pattern so that it will be easy to check quotes from multiple exchanges in the future
*/
export class ExchangeContext {
    private exchange: IExchange;

    constructor(exchange: IExchange) {
        this.exchange = exchange;
    }

    public setStrategy(exchange: IExchange) {
        this.exchange = exchange;
    }

    public getSwapQuote(fromTokens: TokenInfo[], toToken: string): Promise<SwapQuoteResponse[]> {
        return this.exchange.GetSwapQuote(fromTokens, toToken);
    }

    public GetSwapQuotesTotal(fromTokens: TokenInfo[], toToken:string): Promise<SwapQuotesTotal> {
        return this.exchange.GetSwapQuotesTotal(fromTokens, toToken);
   }
}
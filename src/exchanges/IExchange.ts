import { SwapQuotesTotal } from "../shared/model/swap-quote-total.model";
import { SwapQuoteResponse } from "../shared/model/swap-quote.model";
import { TokenInfo } from "../shared/model/token-info.model";

export interface IExchange {
    // returns the swap quote provided by the exchange
    GetSwapQuote(fromTokens: TokenInfo[], toToken:string): Promise<SwapQuoteResponse[]>;
     // returns the swap quote provided by the exchange along with the total in ether units
    GetSwapQuotesTotal(fromTokens: TokenInfo[], toToken:string): Promise<SwapQuotesTotal>;
}
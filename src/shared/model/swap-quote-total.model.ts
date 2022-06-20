import { TokenInfo } from "./token-info.model";

export interface SwapQuotesTotal{
    swapTokenPairs: SwapTokenPair[],
    total: string
}

export interface SwapTokenPair {
    from: TokenInfo,
    to: TokenInfo
}
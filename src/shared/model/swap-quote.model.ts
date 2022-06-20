export interface SwapQuoteResponse {
    fromToken: TokenDetails,
    toToken: TokenDetails,
    toTokenAmount: string
    fromTokenAmount: string,
}

export interface TokenDetails {
    address:	string,
    symbol:	string,
    name:	string,
    decimals:	number,
    logoURI:	string
}

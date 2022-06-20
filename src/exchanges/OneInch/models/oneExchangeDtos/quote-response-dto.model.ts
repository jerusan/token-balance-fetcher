export interface QuoteResponseDto {
    fromToken: TokenInfoDto,
    toToken: TokenInfoDto,
    toTokenAmount: string
    fromTokenAmount: string,
    estimatedGas:	number,
    protocols:	PathViewDto[]
}

export interface PathViewDto {
    name: string,
    part: number,
    fromTokenAddress: string,
    toTokenAddress:	string
}

export interface TokenInfoDto {
    address:	string,
    symbol:	string,
    name:	string,
    decimals:	number,
    logoURI:	string
}
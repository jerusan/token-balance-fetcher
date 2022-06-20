import Web3 from "web3";
import { provider } from 'web3-core';
import {Contract } from 'web3-eth-contract';
import { ContractTokenAddresses } from "../shared/model/contract-token-addresses.model";
import { TokenInfo } from "../shared/model/token-info.model";
const abi = require('erc-20-abi')

export class EthereumClient {
    web3: Web3;
    tokenBalance: Map<string, string>;
    tokenSymbol: Map<string, string>;

    constructor(provider: provider) {
      this.web3 = new Web3(provider);
      this.tokenBalance = new Map<string, string>();
      this.tokenSymbol = new Map<string, string>();
    }
      
    public async getTokenListDetails(contractTokenAddresses: ContractTokenAddresses): Promise<TokenInfo[]>{
      var tokenInfos =  new Array<TokenInfo>();
      var count = 0;
      const total = contractTokenAddresses.TokenAddresses.length;
      await new Promise<TokenInfo | void>((resolve, reject) =>{
         const contractAddress = contractTokenAddresses.ContractAddress;

        //Loop thru the tokens and check the balance for the given contract address
        contractTokenAddresses.TokenAddresses.forEach(async token => {
            try {

              //TODO: look into execute in batches
              const contract = new this.web3.eth.Contract(abi, token);
              this.getERC20Balance(contract, contractAddress, token)
              .then(token => {
                tokenInfos.push(token);               
               count++; // shortcut to wait for all async calls to execute before returning.
                if(count == total) resolve(); // TODO: look into better way to wait for async operations to complete
              });
              
            } catch(error) {
              console.log('Failed to create ERC20 token contract for token '+ token);             
            } 
          })   
      }); 
         return tokenInfos;       
    }

    // Returns token info (addres, symbol, balance) of a given ERC20 address
    public async getERC20Balance(contract: Contract, accountAddress: string, tokenAddress: string): Promise<TokenInfo> {
      var tokenInfo = <TokenInfo>{};
      try {
      const balance = await contract.methods.balanceOf(accountAddress).call(); 
      const symbol = await contract.methods.symbol().call()
     
      tokenInfo = {
        address: tokenAddress,
        symbol: symbol,
        amount: balance
      }     
     
      } catch(error) {
        console.log('Failed to getERC20 balance for contract address'+ accountAddress);
      }
      
      return tokenInfo;  
    };    

    /*
    Returns token's symbol, balance for the given contract and token address
    */
    public async getTokenInfo(contractAddress: string, tokenAddress: string) : Promise<TokenInfo> {
      const contract = new this.web3.eth.Contract(abi, tokenAddress);

      const balance = await contract.methods.balanceOf(contractAddress).call(); 
      const symbol = await contract.methods.symbol().call()

      const tokenInfo: TokenInfo = {
        address: tokenAddress,
        symbol: symbol,
        amount: balance
      }  

      return tokenInfo;
    }

  }
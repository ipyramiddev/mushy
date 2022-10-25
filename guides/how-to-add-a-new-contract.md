# How to add a new contract

We sometimes need to add a custom contract for a given collection. This is usually caused by the fact that their royalties values are not right or the metadata is wrong on the main chain.

## Pre-requisites

There are 2 pre-requisites before this change is required in the UI.
1. Special contract written and deployed on the blockchain
2. `offers-indexer` adapted to use the special contract


- Collection name (ensure this one matches the data sent by the /collections endpoint)
- Escrow program ID
- Creator wallet (where the creator would receive royalties)
- Royalties percentage (i.e. 0.1 = 10%)

Example of a custom contract for *SolBear*:
```json
{
  SolBear: {
    mainnet: {
      escrowProgram: "3HiXNtAFFoSTtkP52EoFbf8r3aobaeLhMbeGdEWEh8V3",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
      creator: "CJVFTuvkdwjvkKtDSrBhhwxZHfYQLra4A7CKqbehMWrg",
      royalties: "0.1"
    },
    devnet: {
      escrowProgram: "3HiXNtAFFoSTtkP52EoFbf8r3aobaeLhMbeGdEWEh8V3",
      escrowTaxRecipient: "3iYf9hHQPciwgJ1TCjpRUp1A3QW4AfaK7J6vCmETRMuu",
      taxAmount: "0.025",
      creator: "CJVFTuvkdwjvkKtDSrBhhwxZHfYQLra4A7CKqbehMWrg",
      royalties: "0.1"
    }
  }
}
```

## Mentions
The file that needs to be edited is `src/constants/escrow.ts`.

You simply need to add a similar object for your custom contract. This is the only change needed on the UI side.



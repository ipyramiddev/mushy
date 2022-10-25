# 🏗 Solcafe

Scaffolding for a dapp built on Solana

# Directory structure

## src/actions

Setup here actions that will interact with Solana programs using sendTransaction function

## src/contexts

React context objects that are used propagate state of accounts across the application

## src/hooks

Generic react hooks to interact with token program:

- useUserBalance - query for balance of any user token by mint, returns:
  - balance
  - balanceLamports
  - balanceInUSD
- useUserTotalBalance - aggregates user balance across all token accounts and returns value in USD
  - balanceInUSD
- useAccountByMint
- useTokenName
- useUserAccounts

## src/views

- home - main page for your app
- faucet - airdrops SOL on Testnet and Devnet

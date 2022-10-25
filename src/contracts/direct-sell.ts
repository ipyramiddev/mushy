import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, Token } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import {
  PublicKey,
  Connection,
  TransactionInstruction,
  Keypair,
  LAMPORTS_PER_SOL,
  GetProgramAccountsConfig,
} from "@solana/web3.js";
import { WalletAdapter } from "../contexts/wallet";
import { sendTransaction } from "../contexts/connection";
import { decodeMetadata, getMetadataAccount } from "../actions/metadata";
import Wallet from "@project-serum/sol-wallet-adapter";
import { DIRECT_SELL_CONTRACT_ID } from "../constants/contract_id";

// import { idl } from "./anchor-idl/direct-sell";

const commitment = "singleGossip";

const DIRECT_SELL_CONTRACT = new PublicKey(DIRECT_SELL_CONTRACT_ID);

const TOKEN_INTEGER_AMOUNT = 1; // NFT contract will only accept 1
const MINIMUM_MAKER_BALANCE = 10000000; // 0.01 SOL

async function getOrCreateAssociatedAccountInfo(t: Token, clientPubkey: PublicKey) {
  // FIXME need to augment the ambient typedef instead of hard-coding this.
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html
  const FAILED_TO_FIND_ACCOUNT = "Failed to find account";
  const INVALID_ACCOUNT_OWNER = "Invalid account owner";

  const mint = t.publicKey;

  // This is the optimum logic, considering TX fee, client-side computation,
  // RPC roundtrips and guaranteed idempotent.
  // Sadly we can't do this atomically;
  const associatedAddress = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    clientPubkey
  );
  try {
    await t.getAccountInfo(associatedAddress);
    return { address: associatedAddress, createIx: null };
  } catch (err) {
    // INVALID_ACCOUNT_OWNER can be possible if the associatedAddress has
    // already been received some lamports (= became system accounts).
    // Assuming program derived addressing is safe, this is the only case
    // for the INVALID_ACCOUNT_OWNER in this code-path
    // @ts-ignore
    if (err.message === FAILED_TO_FIND_ACCOUNT || err.message === INVALID_ACCOUNT_OWNER) {
      // as this isn't atomic, it's possible others can create associated
      // accounts meanwhile
      try {
        const owner = clientPubkey;
        const payer = clientPubkey;
        const createIx = Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          associatedAddress,
          owner,
          payer
        );
        return { address: associatedAddress, createIx: createIx };
      } catch (err) {
        // ignore all errors; for now there is no API compatible way to
        // selectively ignore the expected instruction error if the
        // associated account is existing already.
        console.log("getOrCreateAssociatedAccountInfo: Warning: ", err);
      }
    }
    throw err;
  }
}
async function loadProgram(connection: Connection, wallet: WalletAdapter) {
  const provider = new anchor.Provider(connection, wallet as typeof Wallet, {
    preflightCommitment: "recent",
  });
  const idl = await anchor.Program.fetchIdl(DIRECT_SELL_CONTRACT_ID, provider);

  const program = new anchor.Program(idl as anchor.Idl, DIRECT_SELL_CONTRACT_ID, provider);
  return program;
}

// TODO: zeo: add new function for fetching wallet/mint from new contract

export const fetchActiveDirectSellOffers = async (
  connection: Connection,
  wallet?: string,
  mint?: string
) => {
  let filterBytes = "";
  let offset = 8;
  if (wallet) {
    offset = 8;
    filterBytes = wallet;
  } else if (mint) {
    offset = 40;
    filterBytes = mint;
  }
  let config: GetProgramAccountsConfig = {
    encoding: "base64",
    filters: [
      {
        memcmp: {
          offset: offset,
          bytes: filterBytes,
        },
      },
    ],
  };

  const programAccounts = await connection.getProgramAccounts(DIRECT_SELL_CONTRACT, config);
  return connection ? programAccounts : [];
};

export async function sellTx(
  connection: Connection,
  clientWallet: WalletAdapter,
  mintStr: string,
  listingPrice: number
) {
  const program = await loadProgram(connection, clientWallet);
  const client = clientWallet.publicKey as PublicKey;
  const mint = new PublicKey(mintStr);
  const clientTokenAccountInfo = await connection.getParsedTokenAccountsByOwner(
    client,
    { mint },
    commitment
  );
  if (clientTokenAccountInfo.value.length < 1) {
    throw new Error("Wallet doesn't have an account for the mint.");
  }

  // Sometimes a token ends up with multiple spl-token accounts,
  // so we'll have to see which one has the token, if any.
  let clientTokenAccount = null;
  for (var i = 0; i < clientTokenAccountInfo.value.length; i++) {
    const clientTokenAccountTokenAmount =
      clientTokenAccountInfo.value[i].account.data.parsed.info.tokenAmount.uiAmount;
    console.log("account/tokenAmount:", i, clientTokenAccountTokenAmount);
    if (clientTokenAccountTokenAmount < 1) {
      continue;
    }
    clientTokenAccount = clientTokenAccountInfo.value[i];
  }
  if (clientTokenAccount === null) {
    throw new Error("Wallet doesn't contain the token");
  }

  const token = clientTokenAccount.pubkey;

  const [transferAuthority, bumpAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from("directsell"), client.toBuffer()],
    program.programId
  );

  const [saleInfo, bumpInfo] = await PublicKey.findProgramAddress(
    [Buffer.from("directsell"), client.toBuffer(), mint.toBuffer()],
    program.programId
  );

  await program.rpc.sell(new anchor.BN(listingPrice * LAMPORTS_PER_SOL), bumpInfo, bumpAuthority, {
    accounts: {
      seller: client,
      token,
      mint,
      saleInfo,
      transferAuthority,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [],
  });

  // await finalizeTxn(connection, clientWallet, [instruction]);
}

export async function cancelSellTx(
  connection: Connection,
  clientWallet: WalletAdapter,
  mintStr: string
) {
  const program = await loadProgram(connection, clientWallet);
  const client = clientWallet.publicKey as PublicKey;
  const mint = new PublicKey(mintStr);
  const clientTokenAccountInfo = await connection.getParsedTokenAccountsByOwner(
    client,
    { mint },
    commitment
  );
  if (clientTokenAccountInfo.value.length < 1) {
    throw new Error("Wallet doesn't have an account for the mint.");
  }

  // Sometimes a token ends up with multiple spl-token accounts,
  // so we'll have to see which one has the token, if any.
  let clientTokenAccount = null;
  for (var i = 0; i < clientTokenAccountInfo.value.length; i++) {
    const clientTokenAccountTokenAmount =
      clientTokenAccountInfo.value[i].account.data.parsed.info.tokenAmount.uiAmount;
    console.log("account/tokenAmount:", i, clientTokenAccountTokenAmount);
    if (clientTokenAccountTokenAmount < 1) {
      continue;
    }
    clientTokenAccount = clientTokenAccountInfo.value[i];
  }
  if (clientTokenAccount === null) {
    throw new Error("Wallet doesn't contain the token");
  }

  const token = clientTokenAccount.pubkey;

  const [transferAuthority, bumpAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from("directsell"), client.toBuffer()],
    program.programId
  );

  const [saleInfo, _bumpInfo] = await PublicKey.findProgramAddress(
    [Buffer.from("directsell"), client.toBuffer(), mint.toBuffer()],
    program.programId
  );

  await program.rpc.cancel(bumpAuthority, {
    accounts: {
      seller: client,
      token,
      mint,
      saleInfo,
      transferAuthority,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    signers: [],
  });
}

export async function lowerPrice(
  connection: Connection,
  clientWallet: WalletAdapter,
  mintStr: string,
  saleInfoStr: string,
  newLowerPrice: number
) {
  const program = await loadProgram(connection, clientWallet);
  const client = clientWallet.publicKey as PublicKey;
  await program.rpc.lowerPrice(new anchor.BN(newLowerPrice * LAMPORTS_PER_SOL), {
    accounts: {
      seller: client,
      mint: new PublicKey(mintStr),
      saleInfo: new PublicKey(saleInfoStr),
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [],
  });
}

export async function buyOfferTx(
  connection: Connection,
  clientWallet: WalletAdapter,
  saleInfoStr: string,
  taxRecipient: string,
  taxAmount: string,
  uiExpectedAmount: number
) {
  const program = await loadProgram(connection, clientWallet);
  let saleInfoAccount;
  try {
    saleInfoAccount = await program.account.saleInfo.fetch(new PublicKey(saleInfoStr));
  } catch (err) {
    throw new Error("Offer expired");
  }
  const uiExpectedAmountLamports = Math.round(uiExpectedAmount * LAMPORTS_PER_SOL);
  if (saleInfoAccount.expectedAmount.toNumber() !== uiExpectedAmountLamports) {
    throw new Error(
      "Expected amount mismatch. Account: " +
        saleInfoAccount.expectedAmount +
        " / UI: " +
        uiExpectedAmountLamports
    );
  }
  const walletAccount = await connection.getAccountInfo(clientWallet.publicKey!, commitment);
  if (walletAccount === null) {
    throw new Error("Unfunded wallet account! Add some funds first.");
  }
  const walletBalance = walletAccount.lamports;
  console.log("WB", walletBalance);
  let minimumTakerBalance = MINIMUM_MAKER_BALANCE;
  if (saleInfoAccount.initializerPubkey.toString() !== clientWallet.publicKey!.toString()) {
    minimumTakerBalance += saleInfoAccount.expectedAmount.toNumber() * (1 + parseFloat(taxAmount));
  }
  console.log("MTB", minimumTakerBalance);
  if (walletBalance < minimumTakerBalance) {
    throw new Error("Wallet SOL balance is likely too low to pay for transaction.");
  }

  console.log(saleInfoAccount);
  const mint = saleInfoAccount.mintPubkey;
  console.log("mint", mint);
  const mintacc: any = await connection.getParsedAccountInfo(mint, commitment);
  console.log("mintacc", mintacc);
  const metadataAccount = await getMetadataAccount(mint);
  console.log("metadataacc", metadataAccount);
  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);
  let creators: any = [];
  const metadata = decodeMetadata(metadataAccountInfo!.data);
  console.log("metadata", metadata);
  metadata.data.creators?.forEach((creator) => {
    creators.push({ pubkey: creator.address, isSigner: false, isWritable: true });
  });

  // check if seller has the token
  const sellerTokenAccountInfo = await connection.getParsedTokenAccountsByOwner(
    saleInfoAccount.initializerPubkey,
    { mint },
    commitment
  );
  if (sellerTokenAccountInfo.value.length < 1) {
    throw new Error("Seller doesn't have an account for the mint.");
  }

  // Sometimes a token ends up with multiple spl-token accounts,
  // so we'll have to see which one has the token, if any.
  let sellerTokenAccount = null;
  for (var i = 0; i < sellerTokenAccountInfo.value.length; i++) {
    const sellerTokenAccountTokenAmount =
      sellerTokenAccountInfo.value[i].account.data.parsed.info.tokenAmount.uiAmount;
    console.log("account/tokenAmount:", i, sellerTokenAccountTokenAmount);
    if (sellerTokenAccountTokenAmount < 1) {
      continue;
    }
    sellerTokenAccount = sellerTokenAccountInfo.value[i];
  }
  if (sellerTokenAccount === null) {
    throw new Error("Seller doesn't have the token");
  }

  const token = sellerTokenAccount.pubkey;

  // create receive token
  const decimals = mintacc.value.data.parsed.info.decimals;
  const tokenDepositAmount = Math.floor(TOKEN_INTEGER_AMOUNT * Math.pow(10, decimals));

  const splToken = new Token(connection, mint, TOKEN_PROGRAM_ID, clientWallet.publicKey! as any);

  const client = clientWallet.publicKey as PublicKey;
  const tokenReceiveAccountKey = await getTokenWallet(client, mint);

  const [transferAuthority, bumpAuthority] = await PublicKey.findProgramAddress(
    [Buffer.from("directsell"), saleInfoAccount.initializerPubkey.toBuffer()],
    program.programId
  );
  console.log("taxRecipient", taxRecipient);

  console.log(mint.toString());
  console.log(token.toString());
  console.log(tokenReceiveAccountKey.toString());
  await program.rpc.buy(new anchor.BN(uiExpectedAmountLamports), bumpAuthority, {
    accounts: {
      buyer: client,
      buyerToken: tokenReceiveAccountKey,
      seller: saleInfoAccount.initializerPubkey,
      token: token,
      mint,
      saleInfo: new PublicKey(saleInfoStr),
      transferAuthority,
      salesTaxRecipient: new PublicKey(taxRecipient),
      metadata: metadataAccount,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    },
    remainingAccounts: creators,
    signers: [],
    instructions: [
      createAssociatedTokenAccountInstruction(tokenReceiveAccountKey, client, client, mint),
    ],
  });
}

const getTokenWallet = async (wallet: anchor.web3.PublicKey, mint: anchor.web3.PublicKey) => {
  return (
    await anchor.web3.PublicKey.findProgramAddress(
      [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
      ASSOCIATED_TOKEN_PROGRAM_ID
    )
  )[0];
};

const createAssociatedTokenAccountInstruction = (
  associatedTokenAddress: anchor.web3.PublicKey,
  payer: anchor.web3.PublicKey,
  walletAddress: anchor.web3.PublicKey,
  splTokenMintAddress: anchor.web3.PublicKey
) => {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
    { pubkey: walletAddress, isSigner: false, isWritable: false },
    { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    {
      pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  return new anchor.web3.TransactionInstruction({
    keys,
    programId: ASSOCIATED_TOKEN_PROGRAM_ID,
    data: Buffer.from([]),
  });
};

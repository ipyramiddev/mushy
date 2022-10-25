import {
  AccountLayout,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Account,
  Connection,
  GetProgramAccountsConfig,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
import BN from "bn.js";
import { decodeMetadata, getMetadataAccount } from "../actions/metadata";
import { sendTransaction } from "../contexts/connection";
import { WalletAdapter } from "../contexts/wallet";
import { EscrowInfo } from "../types";
import { getCreatorFromCustomContract, SYSTEM } from "../utils";
import { EscrowLayout, ESCROW_ACCOUNT_DATA_LAYOUT } from "../utils/layout";
import { BASE_URL_OFFERS_RETRIEVER } from '../constants/urls';

const commitment = "singleGossip";
const TOKEN_INTEGER_AMOUNT = 1; // NFT contract will only accept 1
const MINIMUM_MAKER_BALANCE = 10000000; // 0.01 SOL

// Ripped from spl-token.js, as we need to send this through the wallet adapter
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
    if ((err as Error).message === FAILED_TO_FIND_ACCOUNT || (err as Error).message === INVALID_ACCOUNT_OWNER) {
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

async function getExemptionRent(connection: Connection, size: number) {
  const r = await connection.getMinimumBalanceForRentExemption(size, commitment);
  return r;
}

export const fetchActiveAccountOffers = async (
  connection: Connection,
  escrows: EscrowInfo[],
  wallet?: string,
  mint?: string
) => {
  const contractIDs = escrows.map((escrow) => new PublicKey(escrow.escrowProgram));
  let filterBytes = "offers";
  let offset = 1;
  if (wallet) {
    filterBytes = wallet;
  }
  if (mint) {
    offset = 33;
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
  if (filterBytes && filterBytes !== "offers" && isNaN(+filterBytes)) {
    const programAccounts = (await Promise.all(
      contractIDs.map((contractID) => {
        if( !connection ) return;
        return connection.getProgramAccounts(contractID, config);
      })
    )).flat()
    return connection
      ? programAccounts
      : [];
  } else {
    const programAccounts = (await Promise.all(
      contractIDs.map((contractID) => {
        return connection.getProgramAccounts(contractID);
      })
    )).flat()
    return connection
      ? programAccounts
      : [];
  }
};

export async function buyOfferTx(
  endpoint: string,
  connection: Connection,
  clientWallet: WalletAdapter,
  escrowProgram: string,
  escrowPubkeyStr: string,
  taxRecipient: string,
  taxAmount: string,
  uiExpectedAmount: number
) {
  const escrowPubkey = new PublicKey(escrowPubkeyStr);

  console.log("uiExpectedAmount", uiExpectedAmount);
  console.log("escrowPubkeyStr:", escrowPubkeyStr);

  try {
    var encodedEscrowState = (await connection.getAccountInfo(escrowPubkey, commitment))!.data;
  } catch (err) {
    throw new Error("Offer expired");
  }
  const decodedEscrowLayout = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
  const escrowState = {
    escrowAccountPubkey: escrowPubkey,
    isInitialized: !!decodedEscrowLayout.isInitialized,
    mintPubKey: new PublicKey(decodedEscrowLayout.mintPubkey),
    initializerAccountPubkey: new PublicKey(decodedEscrowLayout.initializerPubkey),
    XTokenTempAccountPubkey: new PublicKey(decodedEscrowLayout.initializerTempTokenAccountPubkey),
    expectedAmount: new BN(decodedEscrowLayout.expectedAmount, 10, "le"),
  };

  const escrowProgramId = (await (await fetch(`${BASE_URL_OFFERS_RETRIEVER}?mint=${escrowState.mintPubKey}`)).json())?.contract || escrowProgram;
  const contractID = new PublicKey(escrowProgramId);

  const uiExpectedAmountLamports = Math.round(uiExpectedAmount * LAMPORTS_PER_SOL);
  console.log("Price", escrowState.expectedAmount.toNumber(), uiExpectedAmountLamports);
  if (escrowState.expectedAmount.toNumber() !== uiExpectedAmountLamports) {
    throw new Error(
      "Expected amount mismatch. Account: " +
        escrowState.expectedAmount +
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
  if (escrowState.initializerAccountPubkey.toString() !== clientWallet.publicKey!.toString()) {
    minimumTakerBalance += escrowState.expectedAmount.toNumber() * (1 + parseFloat(taxAmount));
  }
  console.log("MTB", minimumTakerBalance);
  if (walletBalance < minimumTakerBalance) {
    throw new Error("Wallet SOL balance is likely too low to pay for transaction.");
  }

  console.log("P1");
  console.log("escrowState", escrowState);
  const mint = escrowState.mintPubKey;
  console.log("mint", mint);
  const mintacc: any = await connection.getParsedAccountInfo(mint, commitment);
  console.log("mintacc", mintacc);
  const metadataAccount = await getMetadataAccount(mint);
  console.log("metadataacc", metadataAccount);
  const metadataAccountInfo = await connection.getAccountInfo(metadataAccount);
  let creators: any = [];
  const customCreator = getCreatorFromCustomContract(endpoint, escrowProgramId);
  if(customCreator){
    creators.push({ pubkey: new PublicKey(customCreator), isSigner: false, isWritable: true });
  }
  else if (metadataAccountInfo) {
    const metadata = decodeMetadata(metadataAccountInfo.data);
    console.log("metadata", metadata);
    metadata.data.creators?.forEach((creator) => {
      creators.push({ pubkey: creator.address, isSigner: false, isWritable: true });
    });
  }

  const decimals = mintacc.value.data.parsed.info.decimals;
  const tokenDepositAmount = Math.floor(TOKEN_INTEGER_AMOUNT * Math.pow(10, decimals));

  console.log("Token decimals/final amount:", decimals, tokenDepositAmount);
  console.log("DEL:", decodedEscrowLayout);
  console.log("SALES TAX:", taxRecipient);

  console.log("A");
  const PDA = await PublicKey.findProgramAddress([Buffer.from("escrow")], contractID);
  console.log("B");

  // later, it's better to query RPC for existence and then optionally include creation
  // of the assoc token account in the transaction. Otherwise the user might end up
  // with a lot of empty token accounts clutter if the txn fails.
  console.log("C");
  const splToken = new Token(connection, mint, TOKEN_PROGRAM_ID, clientWallet.publicKey! as any);
  console.log("D");
  const tokenReceiveAccount = await getOrCreateAssociatedAccountInfo(
    splToken,
    clientWallet.publicKey!
  );
  console.log("E");
  console.log("tokenReceiveAccount:", tokenReceiveAccount);

  const takeIx = new TransactionInstruction({
    programId: contractID,
    data: Buffer.from(Uint8Array.of(1, ...new BN(tokenDepositAmount).toArray("le", 8))),
    keys: [
      { pubkey: clientWallet.publicKey!, isSigner: true, isWritable: false },

      {
        pubkey: tokenReceiveAccount.address,
        isSigner: false,
        isWritable: true,
      },

      {
        pubkey: escrowState.XTokenTempAccountPubkey,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: escrowState.initializerAccountPubkey,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: escrowPubkey, isSigner: false, isWritable: true },

      {
        pubkey: new PublicKey(taxRecipient),
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: mint,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: metadataAccount,
        isSigner: false,
        isWritable: true,
      },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SYSTEM, isSigner: false, isWritable: false },

      { pubkey: PDA[0], isSigner: false, isWritable: false },
      ...creators,
    ],
  });
  console.log("takeIx", takeIx);
  console.log("F");

  if (tokenReceiveAccount.createIx != null) {
    await finalizeTxn(connection, clientWallet, [tokenReceiveAccount.createIx, takeIx]);
  } else {
    await finalizeTxn(connection, clientWallet, [takeIx]);
  }
  console.log("G");
}

export async function sellTx(
  connection: Connection,
  clientWallet: WalletAdapter,
  escrowProgram: string,
  taxRecipient: string,
  mint: string,
  listingPrice: number
) {
  const sourceMint = new PublicKey(mint);
  const clientPubkey = clientWallet.publicKey as PublicKey;
  const escrowProgramId = (await (await fetch(`${BASE_URL_OFFERS_RETRIEVER}?mint=${mint}`)).json())?.contract || escrowProgram;
  const contractID = new PublicKey(escrowProgramId);

  const price = Math.floor(listingPrice * LAMPORTS_PER_SOL);

  const walletAccount = await connection.getAccountInfo(clientPubkey, commitment);
  if (walletAccount === null) {
    throw new Error("Unfunded wallet account! Add some funds first.");
  }
  const walletBalance = walletAccount.lamports;
  console.log("WB", walletBalance);
  if (walletBalance < MINIMUM_MAKER_BALANCE) {
    throw new Error("Wallet SOL balance is likely too low to pay for transaction.");
  }

  const makerTokenAccountInfo = await connection.getParsedTokenAccountsByOwner(
    clientPubkey,
    { mint: sourceMint },
    commitment
  );
  console.log("makerTokenAccountInfo: ", makerTokenAccountInfo);
  if (makerTokenAccountInfo.value.length < 1) {
    throw new Error("Wallet doesn't have an account for the mint.");
  }

  // Sometimes a token ends up with multiple spl-token accounts,
  // so we'll have to see which one has the token, if any.
  var makerTokenAccount = null;
  for (var i = 0; i < makerTokenAccountInfo.value.length; i++) {
    const makerTokenAccountTokenAmount =
      makerTokenAccountInfo.value[i].account.data.parsed.info.tokenAmount.uiAmount;
    console.log("account/tokenAmount:", i, makerTokenAccountTokenAmount);
    if (makerTokenAccountTokenAmount < 1) {
      continue;
    }
    makerTokenAccount = makerTokenAccountInfo.value[i];
  }
  if (makerTokenAccount === null) {
    throw new Error("Wallet doesn't contain the token");
  }

  const makerTokenAccountPubkey = makerTokenAccount.pubkey;
  console.log("Token account:", makerTokenAccountPubkey.toString());

  const decimals = makerTokenAccount.account.data.parsed.info.tokenAmount.decimals;
  const tokenDepositAmount = Math.floor(TOKEN_INTEGER_AMOUNT * Math.pow(10, decimals));
  console.log("Token decimals/final amount:", decimals, tokenDepositAmount);

  const depositAccount = new Account();
  const createDepositAccountIx = SystemProgram.createAccount({
    programId: TOKEN_PROGRAM_ID,
    space: AccountLayout.span,
    lamports: await getExemptionRent(connection, AccountLayout.span),
    fromPubkey: clientPubkey,
    newAccountPubkey: depositAccount.publicKey,
  });
  const initDepositAccountIx = Token.createInitAccountInstruction(
    TOKEN_PROGRAM_ID,
    sourceMint, // mint
    depositAccount.publicKey, // token account pubkey
    clientPubkey // designated token account owner
  );
  const transferSourceTokensToDepositAccIx = Token.createTransferInstruction(
    TOKEN_PROGRAM_ID,
    makerTokenAccountPubkey, // src pubkey
    depositAccount.publicKey, //dest pubkey
    clientPubkey, // owner pubkey
    [],
    tokenDepositAmount
  );

  const escrowAccount = new Account();
  console.log("ESCROW ACCOUNT: ", escrowAccount.publicKey.toBase58());
  console.log("ESCROW ACCOUNT SPAN: ", ESCROW_ACCOUNT_DATA_LAYOUT.span);
  console.log("PROGRAM ID: ", contractID.toBase58());

  const createEscrowAccountIx = SystemProgram.createAccount({
    space: ESCROW_ACCOUNT_DATA_LAYOUT.span,
    lamports: await getExemptionRent(connection, ESCROW_ACCOUNT_DATA_LAYOUT.span),
    fromPubkey: clientPubkey,
    newAccountPubkey: escrowAccount.publicKey,
    programId: contractID,
  });

  const initEscrowIx = new TransactionInstruction({
    programId: contractID,
    keys: [
      { pubkey: clientPubkey, isSigner: true, isWritable: false },

      { pubkey: depositAccount.publicKey, isSigner: false, isWritable: true },
      { pubkey: sourceMint, isSigner: false, isWritable: false },

      { pubkey: escrowAccount.publicKey, isSigner: false, isWritable: true },
      {
        pubkey: new PublicKey(taxRecipient),
        isSigner: false,
        isWritable: true,
      },
      { pubkey: SYSTEM, isSigner: false, isWritable: false },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(Uint8Array.of(0, ...new BN(price).toArray("le", 8))),
  });

  const ixs = [
    createDepositAccountIx,
    initDepositAccountIx,
    transferSourceTokensToDepositAccIx,
    createEscrowAccountIx,
    initEscrowIx,
  ];
  const addSigners = [depositAccount, escrowAccount];

  await finalizeTxn(connection, clientWallet, ixs, addSigners);

  const encodedEscrowState = (await connection.getAccountInfo(escrowAccount.publicKey, commitment))!
    .data;
  const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
  console.log(decodedEscrowState);
  console.log(new BN(decodedEscrowState.expectedAmount, 10, "le").toNumber());
}

async function finalizeTxn(
  connection: Connection,
  wallet: WalletAdapter,
  instructions: Array<TransactionInstruction>,
  additionalSigners?: Array<Account>
) {
  console.log("finalizing txn");
  const signers = additionalSigners ? additionalSigners : [];
  const txId = await sendTransaction(connection, wallet, instructions, signers);
  console.log("tx sent", txId);
  await connection.confirmTransaction(txId);
  console.log("tx confirmed", txId);
}

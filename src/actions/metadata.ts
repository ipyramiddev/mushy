import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";

import BN from "bn.js";
import bs58 from "bs58";
import { findProgramAddress, isValidHttpUrl, programIds, toPublicKey } from "../utils";
import { EscrowInfo } from "../types";
import { deserializeUnchecked } from "borsh";
export const METADATA_PREFIX = "metadata";
export const EDITION = "edition";
export const RESERVATION = "reservation";

const INITIAL_LENGTH = 1024;

export const MAX_NAME_LENGTH = 32;

export const MAX_SYMBOL_LENGTH = 10;

export const MAX_URI_LENGTH = 200;

export const MAX_CREATOR_LIMIT = 5;

export const MAX_CREATOR_LEN = 32 + 1 + 1;
export const MAX_METADATA_LEN =
  1 +
  32 +
  32 +
  MAX_NAME_LENGTH +
  MAX_SYMBOL_LENGTH +
  MAX_URI_LENGTH +
  MAX_CREATOR_LIMIT * MAX_CREATOR_LEN +
  2 +
  1 +
  1 +
  198;

export const MAX_EDITION_LEN = 1 + 32 + 8 + 200;

export const EDITION_MARKER_BIT_SIZE = 248;

export type Schema = Map<Function, any>;

export enum MetadataKey {
  Uninitialized = 0,
  MetadataV1 = 4,
  EditionV1 = 1,
  MasterEditionV1 = 2,
  MasterEditionV2 = 6,
  EditionMarker = 7,
}

export enum MetadataCategory {
  Audio = "audio",
  Video = "video",
  Image = "image",
  VR = "vr",
  HTML = "html",
}

export type MetadataFile = {
  uri: string;
  type: string;
};

export type FileOrString = MetadataFile | string;

export type Attribute = {
  trait_type?: string;
  display_type?: string;
  value: string | number;
};

export interface IMetadataExtension {
  name: string;
  symbol: string;

  creators: Creator[] | null;
  description: string;
  // preview image absolute URI
  image: string;
  animation_url?: string;

  attributes?: Attribute[];

  // stores link to item on meta
  external_url: string;

  seller_fee_basis_points: number;

  properties: {
    files?: FileOrString[];
    category: MetadataCategory;
    maxSupply?: number;
    creators?: {
      address: string;
      shares: number;
    }[];
  };
}

export class MasterEditionV1 {
  key: MetadataKey;
  supply: BN;
  maxSupply?: BN;
  /// Can be used to mint tokens that give one-time permission to mint a single limited edition.
  printingMint: PublicKey;
  /// If you don't know how many printing tokens you are going to need, but you do know
  /// you are going to need some amount in the future, you can use a token from this mint.
  /// Coming back to token metadata with one of these tokens allows you to mint (one time)
  /// any number of printing tokens you want. This is used for instance by Auction Manager
  /// with participation NFTs, where we dont know how many people will bid and need participation
  /// printing tokens to redeem, so we give it ONE of these tokens to use after the auction is over,
  /// because when the auction begins we just dont know how many printing tokens we will need,
  /// but at the end we will. At the end it then burns this token with token-metadata to
  /// get the printing tokens it needs to give to bidders. Each bidder then redeems a printing token
  /// to get their limited editions.
  oneTimePrintingAuthorizationMint: PublicKey;

  constructor(args: {
    key: MetadataKey;
    supply: BN;
    maxSupply?: BN;
    printingMint: PublicKey;
    oneTimePrintingAuthorizationMint: PublicKey;
  }) {
    this.key = MetadataKey.MasterEditionV1;
    this.supply = args.supply;
    this.maxSupply = args.maxSupply;
    this.printingMint = args.printingMint;
    this.oneTimePrintingAuthorizationMint = args.oneTimePrintingAuthorizationMint;
  }
}

export class MasterEditionV2 {
  key: MetadataKey;
  supply: BN;
  maxSupply?: BN;

  constructor(args: { key: MetadataKey; supply: BN; maxSupply?: BN }) {
    this.key = MetadataKey.MasterEditionV2;
    this.supply = args.supply;
    this.maxSupply = args.maxSupply;
  }
}

export class EditionMarker {
  key: MetadataKey;
  ledger: number[];

  constructor(args: { key: MetadataKey; ledger: number[] }) {
    this.key = MetadataKey.EditionMarker;
    this.ledger = args.ledger;
  }

  editionTaken(edition: number) {
    const editionOffset = edition % EDITION_MARKER_BIT_SIZE;
    const indexOffset = Math.floor(editionOffset / 8);

    if (indexOffset > 30) {
      throw Error("bad index for edition");
    }

    const positionInBitsetFromRight = 7 - (editionOffset % 8);

    const mask = Math.pow(2, positionInBitsetFromRight);

    const appliedMask = this.ledger[indexOffset] & mask;

    return appliedMask !== 0;
  }
}

export class Edition {
  key: MetadataKey;
  /// Points at MasterEdition struct
  parent: PublicKey;
  /// Starting at 0 for master record, this is incremented for each edition minted.
  edition: BN;

  constructor(args: { key: MetadataKey; parent: PublicKey; edition: BN }) {
    this.key = MetadataKey.EditionV1;
    this.parent = args.parent;
    this.edition = args.edition;
  }
}
export class Creator {
  address: PublicKey;
  verified: boolean;
  share: number;

  constructor(args: { address: PublicKey; verified: boolean; share: number }) {
    this.address = args.address;
    this.verified = args.verified;
    this.share = args.share;
  }
}

export class Data {
  name: string;
  symbol: string;
  uri: string;
  sellerFeeBasisPoints: number;
  creators: Creator[] | null;
  constructor(args: {
    name: string;
    symbol: string;
    uri: string;
    sellerFeeBasisPoints: number;
    creators: Creator[] | null;
  }) {
    this.name = args.name;
    this.symbol = args.symbol;
    this.uri = args.uri;
    this.sellerFeeBasisPoints = args.sellerFeeBasisPoints;
    this.creators = args.creators;
  }
}

export class Metadata {
  key: MetadataKey;
  updateAuthority: PublicKey;
  mint: PublicKey;
  data: Data;
  primarySaleHappened: boolean;
  isMutable: boolean;

  // set lazy
  masterEdition?: PublicKey;
  edition?: PublicKey;

  constructor(args: {
    updateAuthority: PublicKey;
    mint: PublicKey;
    data: Data;
    primarySaleHappened: boolean;
    isMutable: boolean;
  }) {
    this.key = MetadataKey.MetadataV1;
    this.updateAuthority = args.updateAuthority;
    this.mint = args.mint;
    this.data = args.data;
    this.primarySaleHappened = args.primarySaleHappened;
    this.isMutable = args.isMutable;
  }

  public async init() {
    const edition = await getEdition(this.mint);
    this.edition = edition;
    this.masterEdition = edition;
  }
}

class CreateMetadataArgs {
  instruction: number = 0;
  data: Data;
  isMutable: boolean;

  constructor(args: { data: Data; isMutable: boolean }) {
    this.data = args.data;
    this.isMutable = args.isMutable;
  }
}
class UpdateMetadataArgs {
  instruction: number = 1;
  data: Data | null;
  // Not used by this app, just required for instruction
  updateAuthority: PublicKey | null;
  primarySaleHappened: boolean | null;
  constructor(args: {
    data?: Data;
    updateAuthority?: string;
    primarySaleHappened: boolean | null;
  }) {
    this.data = args.data ? args.data : null;
    this.updateAuthority = args.updateAuthority ? new PublicKey(args.updateAuthority) : null;
    this.primarySaleHappened = args.primarySaleHappened;
  }
}

class CreateMasterEditionArgs {
  instruction: number = 10;
  maxSupply: BN | null;
  constructor(args: { maxSupply: BN | null }) {
    this.maxSupply = args.maxSupply;
  }
}

class MintPrintingTokensArgs {
  instruction: number = 9;
  supply: BN;

  constructor(args: { supply: BN }) {
    this.supply = args.supply;
  }
}

export const METADATA_SCHEMA = new Map<any, any>([
  [
    CreateMetadataArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["data", Data],
        ["isMutable", "u8"], // bool
      ],
    },
  ],
  [
    UpdateMetadataArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["data", { kind: "option", type: Data }],
        ["updateAuthority", { kind: "option", type: "pubkey" }],
        ["primarySaleHappened", { kind: "option", type: "u8" }],
      ],
    },
  ],

  [
    CreateMasterEditionArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["maxSupply", { kind: "option", type: "u64" }],
      ],
    },
  ],
  [
    MintPrintingTokensArgs,
    {
      kind: "struct",
      fields: [
        ["instruction", "u8"],
        ["supply", "u64"],
      ],
    },
  ],
  [
    MasterEditionV1,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["supply", "u64"],
        ["maxSupply", { kind: "option", type: "u64" }],
        ["printingMint", "pubkey"],
        ["oneTimePrintingAuthorizationMint", "pubkey"],
      ],
    },
  ],
  [
    MasterEditionV2,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["supply", "u64"],
        ["maxSupply", { kind: "option", type: "u64" }],
      ],
    },
  ],
  [
    Edition,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["parent", "pubkey"],
        ["edition", "u64"],
      ],
    },
  ],
  [
    Data,
    {
      kind: "struct",
      fields: [
        ["name", "string"],
        ["symbol", "string"],
        ["uri", "string"],
        ["sellerFeeBasisPoints", "u16"],
        ["creators", { kind: "option", type: [Creator] }],
      ],
    },
  ],
  [
    Creator,
    {
      kind: "struct",
      fields: [
        ["address", "pubkey"],
        ["verified", "u8"],
        ["share", "u8"],
      ],
    },
  ],
  [
    Metadata,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["updateAuthority", "pubkey"],
        ["mint", "pubkey"],
        ["data", Data],
        ["primarySaleHappened", "u8"], // bool
        ["isMutable", "u8"], // bool
      ],
    },
  ],
  [
    EditionMarker,
    {
      kind: "struct",
      fields: [
        ["key", "u8"],
        ["ledger", [31]],
      ],
    },
  ],
]);

export const decodeMetadata = (buffer: Buffer): Metadata => {
  const metadata = deserializeUnchecked(METADATA_SCHEMA, Metadata, buffer) as Metadata;
  return metadata;
};

export const decodeEditionMarker = (buffer: Buffer): EditionMarker => {
  const editionMarker = deserializeUnchecked(
    METADATA_SCHEMA,
    EditionMarker,
    buffer
  ) as EditionMarker;
  return editionMarker;
};

export const decodeEdition = (buffer: Buffer) => {
  return deserializeUnchecked(METADATA_SCHEMA, Edition, buffer) as Edition;
};

export const decodeMasterEdition = (buffer: Buffer): MasterEditionV1 | MasterEditionV2 => {
  if (buffer[0] === MetadataKey.MasterEditionV1) {
    return deserializeUnchecked(METADATA_SCHEMA, MasterEditionV1, buffer) as MasterEditionV1;
  } else {
    return deserializeUnchecked(METADATA_SCHEMA, MasterEditionV2, buffer) as MasterEditionV2;
  }
};

export async function updateMetadata(
  data: Data | undefined,
  newUpdateAuthority: string | undefined,
  primarySaleHappened: boolean | null | undefined,
  mintKey: any,
  updateAuthority: any,
  instructions: TransactionInstruction[],
  metadataAccount?: any
) {
  const metadataProgramId = programIds().metadata;

  metadataAccount =
    metadataAccount ||
    (
      await findProgramAddress(
        [Buffer.from("metadata"), metadataProgramId.toBuffer(), toPublicKey(mintKey).toBuffer()],
        metadataProgramId
      )
    )[0];

  const value = new UpdateMetadataArgs({
    data,
    updateAuthority: !newUpdateAuthority ? undefined : newUpdateAuthority,
    primarySaleHappened:
      primarySaleHappened === null || primarySaleHappened === undefined
        ? null
        : primarySaleHappened,
  });

  const txnData = Buffer.from(serialize(METADATA_SCHEMA, value));

  const keys = [
    {
      pubkey: metadataAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: toPublicKey(updateAuthority),
      isSigner: true,
      isWritable: false,
    },
  ];

  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data: txnData,
    })
  );

  return metadataAccount;
}

export async function createMetadata(
  data: Data,
  updateAuthority: any,
  mintKey: any,
  mintAuthorityKey: any,
  instructions: TransactionInstruction[],
  payer: any
) {
  const metadataProgramId = programIds().metadata;

  const metadataAccount = (
    await findProgramAddress(
      [Buffer.from("metadata"), metadataProgramId.toBuffer(), toPublicKey(mintKey).toBuffer()],
      metadataProgramId
    )
  )[0];

  const value = new CreateMetadataArgs({ data, isMutable: true });

  console.log("here coming");
  try {
    const dataSerialized = serialize(METADATA_SCHEMA, value);
    console.log("here", dataSerialized);
  } catch (err) {
    console.log(err);
  }
  console.log("here coming");

  const txnData = Buffer.from(serialize(METADATA_SCHEMA, value));

  const keys = [
    {
      pubkey: metadataAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: mintKey,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: mintAuthorityKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: updateAuthority,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data: txnData,
    })
  );

  return metadataAccount;
}

export async function createMasterEdition(
  maxSupply: BN | undefined,
  mintKey: any,
  updateAuthorityKey: any,
  mintAuthorityKey: any,
  payer: any,
  instructions: TransactionInstruction[]
) {
  const metadataProgramId = programIds().metadata;

  const metadataAccount = (
    await findProgramAddress(
      [Buffer.from(METADATA_PREFIX), metadataProgramId.toBuffer(), toPublicKey(mintKey).toBuffer()],
      metadataProgramId
    )
  )[0];

  const editionAccount = (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        metadataProgramId.toBuffer(),
        toPublicKey(mintKey).toBuffer(),
        Buffer.from(EDITION),
      ],
      metadataProgramId
    )
  )[0];

  const value = new CreateMasterEditionArgs({ maxSupply: maxSupply || null });
  const data = Buffer.from(serialize(METADATA_SCHEMA, value));

  const keys = [
    {
      pubkey: editionAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: mintKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: updateAuthorityKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: mintAuthorityKey,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: metadataAccount,
      isSigner: false,
      isWritable: false,
    },

    {
      pubkey: programIds().token,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data,
    })
  );
}

export async function deprecatedMintNewEditionFromMasterEditionViaPrintingToken(
  newMint: PublicKey,
  tokenMint: PublicKey,
  newMintAuthority: PublicKey,
  printingMint: PublicKey,
  authorizationTokenHoldingAccount: PublicKey,
  burnAuthority: PublicKey,
  updateAuthorityOfMaster: PublicKey,
  reservationList: PublicKey | undefined,
  instructions: TransactionInstruction[],
  payer: PublicKey
) {
  const metadataProgramId = programIds().metadata;

  const newMetadataKey = await getMetadataAccount(newMint);
  const masterMetadataKey = await getMetadataAccount(tokenMint);
  const newEdition = await getEdition(newMint);
  const masterEdition = await getEdition(tokenMint);

  const data = Buffer.from([3]);

  const keys = [
    {
      pubkey: newMetadataKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: newEdition,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: masterEdition,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: newMint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: newMintAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: printingMint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: authorizationTokenHoldingAccount,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: burnAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: updateAuthorityOfMaster,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: masterMetadataKey,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: programIds().token,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  if (reservationList) {
    keys.push({
      pubkey: reservationList,
      isSigner: false,
      isWritable: true,
    });
  }
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data,
    })
  );
}

export async function mintNewEditionFromMasterEditionViaToken(
  newMint: PublicKey,
  tokenMint: PublicKey,
  newMintAuthority: PublicKey,
  newUpdateAuthority: PublicKey,
  tokenOwner: PublicKey,
  tokenAccount: PublicKey,
  instructions: TransactionInstruction[],
  payer: PublicKey,
  edition: BN
) {
  const metadataProgramId = programIds().metadata;

  const newMetadataKey = await getMetadataAccount(newMint);
  const masterMetadataKey = await getMetadataAccount(tokenMint);
  const newEdition = await getEdition(newMint);
  const masterEdition = await getEdition(tokenMint);
  const editionMarkPda = await getEditionMarkPda(tokenMint, edition);

  const data = Buffer.from([11, ...edition.toArray("le", 8)]);

  const keys = [
    {
      pubkey: newMetadataKey,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: newEdition,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: masterEdition,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: newMint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: editionMarkPda,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: newMintAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: tokenOwner,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: tokenAccount,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: newUpdateAuthority,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: masterMetadataKey,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: programIds().token,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];

  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data,
    })
  );
}

export async function updatePrimarySaleHappenedViaToken(
  metadata: PublicKey,
  owner: PublicKey,
  tokenAccount: PublicKey,
  instructions: TransactionInstruction[]
) {
  const metadataProgramId = programIds().metadata;

  const data = Buffer.from([4]);

  const keys = [
    {
      pubkey: metadata,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: owner,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: tokenAccount,
      isSigner: false,
      isWritable: false,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data,
    })
  );
}

export async function deprecatedCreateReservationList(
  metadata: PublicKey,
  masterEdition: PublicKey,
  resource: PublicKey,
  updateAuthority: PublicKey,
  payer: PublicKey,
  instructions: TransactionInstruction[]
) {
  const metadataProgramId = programIds().metadata;

  const reservationList = await deprecatedGetReservationList(masterEdition, resource);
  const data = Buffer.from([6]);

  const keys = [
    {
      pubkey: reservationList,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: payer,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: updateAuthority,
      isSigner: true,
      isWritable: false,
    },

    {
      pubkey: masterEdition,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: resource,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: metadata,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SystemProgram.programId,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data,
    })
  );
}

export async function signMetadata(
  metadata: PublicKey,
  creator: PublicKey,
  instructions: TransactionInstruction[]
) {
  const metadataProgramId = programIds().metadata;

  const data = Buffer.from([7]);

  const keys = [
    {
      pubkey: metadata,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: creator,
      isSigner: true,
      isWritable: false,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data,
    })
  );
}

export async function deprecatedMintPrintingTokens(
  destination: PublicKey,
  printingMint: PublicKey,
  updateAuthority: PublicKey,
  metadata: PublicKey,
  masterEdition: PublicKey,
  supply: BN,
  instructions: TransactionInstruction[]
) {
  const PROGRAM_IDS = programIds();
  const metadataProgramId = PROGRAM_IDS.metadata;

  const value = new MintPrintingTokensArgs({ supply });
  const data = Buffer.from(serialize(METADATA_SCHEMA, value));

  const keys = [
    {
      pubkey: destination,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: printingMint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: updateAuthority,
      isSigner: true,
      isWritable: false,
    },
    {
      pubkey: metadata,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: masterEdition,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: PROGRAM_IDS.token,
      isSigner: false,
      isWritable: false,
    },
    {
      pubkey: SYSVAR_RENT_PUBKEY,
      isSigner: false,
      isWritable: false,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data,
    })
  );
}

export async function convertMasterEditionV1ToV2(
  masterEdition: PublicKey,
  oneTimeAuthMint: PublicKey,
  printingMint: PublicKey,
  instructions: TransactionInstruction[]
) {
  const metadataProgramId = programIds().metadata;

  const data = Buffer.from([12]);

  const keys = [
    {
      pubkey: masterEdition,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: oneTimeAuthMint,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: printingMint,
      isSigner: false,
      isWritable: true,
    },
  ];
  instructions.push(
    new TransactionInstruction({
      keys,
      programId: metadataProgramId,
      data,
    })
  );
}

export async function getEdition(tokenMint: PublicKey): Promise<PublicKey> {
  const PROGRAM_IDS = programIds();

  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        PROGRAM_IDS.metadata.toBuffer(),
        tokenMint.toBuffer(),
        Buffer.from(EDITION),
      ],
      PROGRAM_IDS.metadata
    )
  )[0];
}

export async function getMetadataAccount(tokenMint: PublicKey): Promise<PublicKey> {
  const PROGRAM_IDS = programIds();

  return (
    await findProgramAddress(
      [Buffer.from(METADATA_PREFIX), PROGRAM_IDS.metadata.toBuffer(), tokenMint.toBuffer()],
      PROGRAM_IDS.metadata
    )
  )[0];
}

export async function fetchMetadata(
  connection: Connection,
  tokenMint: PublicKey,
  contract: EscrowInfo
) {
  try {
    const accountMetadataPubKey = await getMetadataAccount(tokenMint);
    const meta = await connection.getAccountInfo(accountMetadataPubKey);
    if (meta) {
      const metadataFromChain = decodeMetadata(meta.data);
      if (isValidHttpUrl(metadataFromChain.data.uri)) {
        const response = await fetch(metadataFromChain.data.uri);
        const data = await response.json();
        // We need to override the royalty fee with the value from the chain.
        const sellerFeeBasisPointsObject = contract?.royalties
          ? {
              seller_fee_basis_points: Number(contract?.royalties) * 10000,
            }
          : metadataFromChain.data &&
            metadataFromChain.data.sellerFeeBasisPoints &&
            metadataFromChain.data.sellerFeeBasisPoints > 0
          ? { seller_fee_basis_points: metadataFromChain.data.sellerFeeBasisPoints }
          : {};
        return {
          ...data,
          ...sellerFeeBasisPointsObject,
        };
      }
    }
  } catch (e) {
    return undefined;
  }
}

export async function fetchMetadataSolo(connection: Connection, tokenMint: PublicKey) {
  try {
    const accountMetadataPubKey = await getMetadataAccount(tokenMint);
    const meta = await connection.getAccountInfo(accountMetadataPubKey);
    if (meta) {
      const metadataFromChain = decodeMetadata(meta.data);
      if (isValidHttpUrl(metadataFromChain.data.uri)) {
        const response = await fetch(metadataFromChain.data.uri);
        const data = await response.json();
        return {
          ...data,
        };
      }
    }
  } catch (e) {
    return undefined;
  }
}


export async function fetchMetadataWithoutContract(connection: Connection, tokenMint: PublicKey) {
  try {
    const accountMetadataPubKey = await getMetadataAccount(tokenMint);
    const meta = await connection.getAccountInfo(accountMetadataPubKey);
    if (meta) {
      const metadataFromChain = decodeMetadata(meta.data);
      if (isValidHttpUrl(metadataFromChain.data.uri)) {
        const response = await fetch(metadataFromChain.data.uri);
        const data = await response.json();
        // We need to override the royalty fee with the value from the chain.
        const sellerFeeBasisPointsObject =
          metadataFromChain.data &&
          metadataFromChain.data.sellerFeeBasisPoints &&
          metadataFromChain.data.sellerFeeBasisPoints > 0
            ? { ["seller_fee_basis_points"]: metadataFromChain.data.sellerFeeBasisPoints }
            : {};
        return {
          ...data,
          ...sellerFeeBasisPointsObject,
        };
      }
    }
  } catch (e) {
    return undefined;
  }
}

export async function deprecatedGetReservationList(
  masterEdition: PublicKey,
  resource: PublicKey
): Promise<PublicKey> {
  const PROGRAM_IDS = programIds();

  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        PROGRAM_IDS.metadata.toBuffer(),
        masterEdition.toBuffer(),
        Buffer.from(RESERVATION),
        resource.toBuffer(),
      ],
      PROGRAM_IDS.metadata
    )
  )[0];
}

export async function getEditionMarkPda(mint: PublicKey, edition: BN): Promise<PublicKey> {
  const PROGRAM_IDS = programIds();
  const editionNumber = Math.floor(edition.toNumber() / 248);

  return (
    await findProgramAddress(
      [
        Buffer.from(METADATA_PREFIX),
        PROGRAM_IDS.metadata.toBuffer(),
        mint.toBuffer(),
        Buffer.from(EDITION),
        Buffer.from(editionNumber.toString()),
      ],
      PROGRAM_IDS.metadata
    )
  )[0];
}

export function serialize(schema: Schema, obj: any): Uint8Array {

    const writer = new BinaryWriter();
    serializeStruct(schema, obj, writer);

    return writer.toArray();
}

function serializeStruct(schema: Schema, obj: any, writer: any) {
  const structSchema = schema.get(obj.constructor);
  if (!structSchema) {
    throw new Error(`Class ${obj.constructor.name} is missing in schema`);
  }
  if (structSchema.kind === "struct") {
    structSchema.fields.map(([fieldName, fieldType]: [any, any]) => {
      serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
    });
  } else if (structSchema.kind === "enum") {
    const name = obj[structSchema.field];
    for (let idx = 0; idx < structSchema.values.length; ++idx) {
      const [fieldName, fieldType]: [any, any] = structSchema.values[idx];
      if (fieldName === name) {
        writer.writeU8(idx);
        serializeField(schema, fieldName, obj[fieldName], fieldType, writer);
        break;
      }
    }
  } else {
    throw new Error(`Unexpected schema kind: ${structSchema.kind} for ${obj.constructor.name}`);
  }
}
/// Binary encoder.
export class BinaryWriter {
  buf: Buffer;
  length: number;

  public constructor() {
    this.buf = Buffer.alloc(INITIAL_LENGTH);
    this.length = 0;
  }

  maybeResize() {
    if (this.buf.length < 16 + this.length) {
      this.buf = Buffer.concat([this.buf, Buffer.alloc(INITIAL_LENGTH)]);
    }
  }

  public writeU8(value: number) {
    this.maybeResize();
    this.buf.writeUInt8(value, this.length);
    this.length += 1;
  }

  public writeU16(value: number) {
    this.maybeResize();
    this.buf.writeUInt16LE(value, this.length);
    this.length += 2;
  }

  public writeU32(value: number) {
    this.maybeResize();
    this.buf.writeUInt32LE(value, this.length);
    this.length += 4;
  }

  public writeU64(value: number | BN) {
    this.maybeResize();
    this.writeBuffer(Buffer.from(new BN(value).toArray("le", 8)));
  }

  public writeU128(value: number | BN) {
    this.maybeResize();
    this.writeBuffer(Buffer.from(new BN(value).toArray("le", 16)));
  }

  public writeU256(value: number | BN) {
    this.maybeResize();
    this.writeBuffer(Buffer.from(new BN(value).toArray("le", 32)));
  }

  public writeU512(value: number | BN) {
    this.maybeResize();
    this.writeBuffer(Buffer.from(new BN(value).toArray("le", 64)));
  }

  private writeBuffer(buffer: Buffer) {
    // Buffer.from is needed as this.buf.subarray can return plain Uint8Array in browser
    this.buf = Buffer.concat([
      Buffer.from(this.buf.subarray(0, this.length)),
      buffer,
      Buffer.alloc(INITIAL_LENGTH),
    ]);
    this.length += buffer.length;
  }

  public writeString(str: string) {
    this.maybeResize();
    const b = Buffer.from(str, "utf8");
    this.writeU32(b.length);
    this.writeBuffer(b);
  }

  public writePubkey(value: PublicKey) {
    if (typeof value === "string") {
      const k = toPublicKey(value);
      this.writeFixedArray(k.toBuffer());
    } else {
      console.log(value, "not a string?", typeof value);

      this.writeFixedArray(value.toBuffer());
    }
  }

  public writeFixedArray(array: Uint8Array) {
    this.writeBuffer(Buffer.from(array));
  }

  public writeArray(array: any[], fn: any) {
    this.maybeResize();
    this.writeU32(array.length);
    for (const elem of array) {
      this.maybeResize();
      fn(elem);
    }
  }

  public toArray(): Uint8Array {
    return this.buf.subarray(0, this.length);
  }
}

function serializeField(
  schema: Schema,
  fieldName: string,
  value: any,
  fieldType: any,
  writer: any
) {
  try {
    // TODO: Handle missing values properly (make sure they never result in just skipped write)
    if (typeof fieldType === "string") {
      writer[`write${capitalizeFirstLetter(fieldType)}`](value);
    } else if (fieldType instanceof Array) {
      if (typeof fieldType[0] === "number") {
        if (value.length !== fieldType[0]) {
          throw new Error(
            `Expecting byte array of length ${fieldType[0]}, but got ${value.length} bytes`
          );
        }
        writer.writeFixedArray(value);
      } else {
        writer.writeArray(value, (item: any) => {
          serializeField(schema, fieldName, item, fieldType[0], writer);
        });
      }
    } else if (fieldType.kind !== undefined) {
      switch (fieldType.kind) {
        case "option": {
          if (value === null || value === undefined) {
            writer.writeU8(0);
          } else {
            writer.writeU8(1);
            serializeField(schema, fieldName, value, fieldType.type, writer);
          }
          break;
        }
        default:
          throw new Error(`FieldType ${fieldType} unrecognized`);
      }
    } else {
      serializeStruct(schema, value, writer);
    }
  } catch (error) {
    console.log(
      error,
      "error occured in serializeField",
      schema,
      fieldName,
      value,
      fieldType,
      writer
    );
    if (error) {
      error.addToFieldPath(fieldName);
    }
    throw error;
  }
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

{
  /**
function deserializeStruct(schema: Schema, classType: any, reader: BinaryReader) {
    const structSchema = schema.get(classType);
    if (!structSchema) {
        throw new Error(`Class ${classType.name} is missing in schema`);
    }

    if (structSchema.kind === 'struct') {
        const result = {};
        for (const [fieldName, fieldType] of schema.get(classType).fields) {
            result[fieldName] = deserializeField(schema, fieldName, fieldType, reader);
        }
        return new classType(result);
    }

    if (structSchema.kind === 'enum') {
        const idx = reader.readU8();
        if (idx >= structSchema.values.length) {
            throw new Error(`Enum index: ${idx} is out of range`);
        }
        const [fieldName, fieldType] = structSchema.values[idx];
        const fieldValue = deserializeField(schema, fieldName, fieldType, reader);
        return new classType({ [fieldName]: fieldValue });
    }

    throw new Error(`Unexpected schema kind: ${structSchema.kind} for ${classType.constructor.name}`);
}

/// Deserializes object from bytes using schema, without checking the length read
export function deserializeUnchecked(schema: Schema, classType: any, buffer: Buffer): any {
    const reader = new BinaryReader(buffer);
    return deserializeStruct(schema, classType, reader);
}
function deserializeField(schema: Schema, fieldName: string, fieldType: any, reader: BinaryReader): any {
    try {
        if (typeof fieldType === 'string') {
            return reader[`read${capitalizeFirstLetter(fieldType)}`]();
        }

        if (fieldType instanceof Array) {
            if (typeof fieldType[0] === 'number') {
                return reader.readFixedArray(fieldType[0]);
            }

            return reader.readArray(() => deserializeField(schema, fieldName, fieldType[0], reader));
        }

        if (fieldType.kind === 'option') {
            const option = reader.readU8();
            if (option) {
                return deserializeField(
                    schema,
                    fieldName,
                    fieldType.type,
                    reader
                );
            }

            return undefined;
        }

        return deserializeStruct(schema, fieldType, reader);
    } catch (error) {
        if (error) {
            error.addToFieldPath(fieldName);
        }
        throw error;
    }
}

export class BinaryReader {
    buf: Buffer;
    offset: number;

    public constructor(buf: Buffer) {
        this.buf = buf;
        this.offset = 0;
    }

    @handlingRangeError
    readU8(): number {
        const value = this.buf.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }

    @handlingRangeError
    readU16(): number {
        const value = this.buf.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }

    @handlingRangeError
    readU32(): number {
        const value = this.buf.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }

    @handlingRangeError
    readU64(): BN {
        const buf = this.readBuffer(8);
        return new BN(buf, 'le');
    }

    @handlingRangeError
    readU128(): BN {
        const buf = this.readBuffer(16);
        return new BN(buf, 'le');
    }

    @handlingRangeError
    readU256(): BN {
        const buf = this.readBuffer(32);
        return new BN(buf, 'le');
    }

    @handlingRangeError
    readU512(): BN {
        const buf = this.readBuffer(64);
        return new BN(buf, 'le');
    }

    private readBuffer(len: number): Buffer {
        if ((this.offset + len) > this.buf.length) {
            throw new BorshError(`Expected buffer length ${len} isn't within bounds`);
        }
        const result = this.buf.slice(this.offset, this.offset + len);
        this.offset += len;
        return result;
    }

    @handlingRangeError
    readString(): string {
        const len = this.readU32();
        const buf = this.readBuffer(len);
        try {
            // NOTE: Using TextDecoder to fail on invalid UTF-8
            return textDecoder.decode(buf);
        } catch (e) {
            throw new BorshError(`Error decoding UTF-8 string: ${e}`);
        }
    }

    @handlingRangeError
    readFixedArray(len: number): Uint8Array {
        return new Uint8Array(this.readBuffer(len));
    }

    @handlingRangeError
    readArray(fn: any): any[] {
        const len = this.readU32();
        const result = Array<any>();
        for (let i = 0; i < len; ++i) {
            result.push(fn());
        }
        return result;
    }
}
*/
}

import { AccountInfo, PublicKey } from "@solana/web3.js";

export interface ActiveAccountOffer {
  pubkey: PublicKey;
  account: AccountInfo<Buffer>;
}

export interface ActiveOffer {
  mint: string;
  price: number;
  escrowPubkeyStr: string;
  uri?: string;
  metadata?: Metadata;
  collection?: string;
  contract?: string;
  owner?: string;
  saleInfo?: string;
  initializerPubkey?: string;
  isListed: boolean;
  isVerifeyed: boolean;
  // TODO: these 2 properties shouldn't be optional. It should be added everywhere we do a mapping for offer.
  collectionName?: string;
  disputedMessage?: string;
  lastPrice?: number;
  solo?: boolean;
  tags?: any;
  artistUser?: string;
  artistImage?: any;
  artistVerified?: boolean;
}

export interface ActiveArtist {
  banner: string;
  created_at: any;
  description: string;
  discord: string;
  image: string;
  instagram: string;
  mints_list: [];
  theme: string;
  twitter: string;
  updated_at: any;
  user_id: number;
  username: string;
  verified: boolean;
  wallet_key: string;
  website: string;
  statusOnchain?: string;
}

export interface Collection {
  name: string;
  description: string;
  website: string;
  thumbnail: string;
  isCurated: boolean;
  disputedMessage: string;
  isNsfw: boolean;
  numberOfItems?: number;
  mintPrice?: number;
  volumeLastUpdatedAt?: string;
  volumeTotal?: number;
  volumePast24h?: number;
  volumePast7days?: number;
  publishedEpoch?: number;
}

export interface Escrow {
  [key: string]: EscrowNetwork;
}

export interface EscrowNetwork {
  [key: string]: EscrowInfo;
}

export interface EscrowInfo {
  escrowProgram: string;
  escrowTaxRecipient: string;
  taxAmount: string;
  creator?: string;
  royalties?: string;
}

export interface MetadataAttribute {
  trait_type: string;
  value: string;
}

export interface Metadata {
  name: string;
  title?: string;
  symbol?: string;
  description?: string;
  seller_fee_basis_points?: number;
  image: string;
  external_url?: string;
  animation_url?: string;
  properties?: {
    files: MetadataVideoProperties[] | string | MetadataVideoProperties;
    category: string;
    creators: any[];
  };
  collection?: {
    name: string;
    family: string;
  };
  attributes?: MetadataAttribute[];
}

export interface MetadataVideoProperties {
  uri?: string;
  type?: string;
}

export interface Artist {
  address?: string;
  name: string;
  link: string;
  image: string;
  itemsAvailable?: number;
  itemsSold?: number;
  about?: string;
  verified?: boolean;
  background?: string;
  share?: number;
}

export enum ArtType {
  Master,
  Print,
  NFT,
}
export interface Art {
  uri: string | undefined;
  mint: string | undefined;
  link: string;
  title: string;
  artist: string;
  seller_fee_basis_points?: number;
  creators?: Artist[];
  type: ArtType;
  edition?: number;
  supply?: number;
  maxSupply?: number;
}

export interface SaleData {
  type: string;
  buyer: string;
  seller: string;
  mint: string;
  price: number;
  epoch: number;
  tags: Metadata;
  buyerDomain?: string[];
  sellerDomain?: string[];
}

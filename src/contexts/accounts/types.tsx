import { AccountInfo } from '@solana/web3.js';
import { StringPublicKey } from '../../utils';

export interface ParsedAccountBase {
  pubkey: any;
  account: AccountInfo<Buffer>;
  info: any; // TODO: change to unknown
}

export type AccountParser = (
  pubkey: any,
  data: AccountInfo<Buffer>,
) => ParsedAccountBase | undefined;

export interface ParsedAccount<T> extends ParsedAccountBase {
  info: T;
}

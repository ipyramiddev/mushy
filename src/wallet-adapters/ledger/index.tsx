import type Transport from "@ledgerhq/hw-transport";
import type { Transaction } from "@solana/web3.js";

import EventEmitter from "eventemitter3";
import { PublicKey } from "@solana/web3.js";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { WalletAdapter } from "../../contexts/wallet";
import { getPublicKey, signTransaction } from "./core";
import { Notification } from "../../components/Notification";
import { toast } from "react-toastify";

export class LedgerWalletAdapter extends EventEmitter implements WalletAdapter {
  _connecting: boolean;
  _publicKey: PublicKey | null;
  _transport: Transport | null;
  _domainName: string | undefined;

  constructor() {
    super();
    this._connecting = false;
    this._publicKey = null;
    this._transport = null;
  }

  get publicKey() {
    return this._publicKey;
  }

  async signTransaction(transaction: Transaction) {
    if (!this._transport || !this._publicKey) {
      throw new Error("Not connected to Ledger");
    }

    // @TODO: account selection (derivation path changes with account)
    const signature = await signTransaction(this._transport, transaction);

    transaction.addSignature(this._publicKey, signature);

    return transaction;
  }

  async signMessage(message: Uint8Array) {
    if (!this._transport || !this._publicKey) {
      throw new Error("Not connected to Ledger");
    }

    const signature: any = await this.signMessage(message);

    return signature?.signature;
  }

  async connect() {
    if (this._connecting) {
      return;
    }

    this._connecting = true;

    try {
      // @TODO: transport selection (WebUSB, WebHID, bluetooth, ...)
      this._transport = await TransportWebUSB.create();
      // @TODO: account selection
      this._publicKey = await getPublicKey(this._transport);
      this.emit("connect", this._publicKey);
    } catch (error) {
      toast.error(
        <Notification title="Ledger Error" description={(error as Error).message}></Notification>
      );
      await this.disconnect();
    } finally {
      this._connecting = false;
    }
  }

  async disconnect() {
    let emit = false;
    if (this._transport) {
      await this._transport.close();
      this._transport = null;
      emit = true;
    }

    this._connecting = false;
    this._publicKey = null;

    if (emit) {
      this.emit("disconnect");
    }
  }
}

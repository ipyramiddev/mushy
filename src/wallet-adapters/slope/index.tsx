import EventEmitter from "eventemitter3";
import { PublicKey, Transaction } from "@solana/web3.js";
import { WalletAdapter } from "../../contexts/wallet";
import { Notification } from "../../components/Notification";
import { toast } from "react-toastify";
import bs58 from "bs58";

interface SlopeWallet {
  connect(): Promise<{
    msg: string;
    data: {
      publicKey?: string;
    };
  }>;
  disconnect(): Promise<{ msg: string }>;
  signTransaction(message: string): Promise<{
    msg: string;
    data: {
      publicKey?: string;
      signature?: string;
    };
  }>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  signAllTransactions(messages: string[]): Promise<{
    msg: string;
    data: {
      publicKey?: string;
      signatures?: string[];
    };
  }>;
}

interface SlopeWindow extends Window {
  Slope?: {
    new (): SlopeWallet;
  };
}

declare const window: SlopeWindow;

export class SlopeWalletAdapter extends EventEmitter implements WalletAdapter {
  private _connecting: boolean;
  private _wallet: SlopeWallet | null;
  private _publicKey: PublicKey | null;

  constructor() {
    super();
    this._connecting = false;
    this._wallet = null;
    this._publicKey = null;
  }
  signMessage(message: Uint8Array): Promise<Uint8Array> {
    throw new Error("Method not implemented.");
  }

  get publicKey(): PublicKey | null {
    return this._publicKey;
  }

  get ready(): boolean {
    return typeof window !== "undefined" && !!window.Slope;
  }

  get connecting(): boolean {
    return this._connecting;
  }

  get connected(): boolean {
    return !!this._publicKey;
  }

  get autoApprove(): boolean {
    return false;
  }

  async connect(): Promise<void> {
    try {
      if (this.connected || this.connecting) return;
      this._connecting = true;

      if (!window.Slope) {
        toast.error(
          <Notification title="Slope Wallet" description="Please install Slope wallet extension." />
        );
        return;
      }

      const wallet = new window.Slope();

      let account: string;
      try {
        const { msg, data } = await wallet.connect();

        if (!data.publicKey) {
          toast.error(
            <Notification
              title="Slope Wallet"
              description="WalletAccountError - 93: Please try disconnecting from your wallet again."
            />
          );
          return;
        }

        account = data.publicKey;
      } catch (error: any) {
        if (error) throw error;
      }

      let publicKey: PublicKey;
      try {
        // @ts-ignore
        publicKey = new PublicKey(account);
      } catch (error: any) {
        toast.error(
          <Notification
            title="Slope Wallet"
            description="WalletPublicKeyError - 111: An unexpected error has occurred. Please contact support!"
          />
        );
        return;
      }

      this._wallet = wallet;
      this._publicKey = publicKey;

      this.emit("connect");
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    } finally {
      this._connecting = false;
    }
  }

  async disconnect(): Promise<void> {
    const wallet = this._wallet;
    if (wallet) {
      this._wallet = null;
      this._publicKey = null;

      try {
        const { msg } = await wallet.disconnect();
        if (msg !== "ok") throw new Error(msg);
      } catch (error: any) {
        toast.error(
          <Notification
            title="Slope Wallet"
            description="Please try disconnecting from your wallet again."
          />
        );
        this.emit("error", error);
        // @ts-ignore
        return;
      }

      this.emit("disconnect");
    }
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      const wallet = this._wallet;
      if (!wallet) {
        toast.error(
          <Notification title="Slope Wallet" description="Please connect to your wallet first." />
        );
        return transaction;
      }
      if (!wallet) throw new Error();

      try {
        const message = bs58.encode(transaction.serializeMessage());
        const { msg, data } = await wallet.signTransaction(message);
        if (!data.publicKey || !data.signature) {
          return transaction;
        }

        const publicKey = new PublicKey(data.publicKey);
        const signature = bs58.decode(data.signature);

        transaction.addSignature(publicKey, signature);
        return transaction;
      } catch (error: any) {
        toast.error(
          <Notification
            title="Slope Wallet"
            description="WalletSignTransactionError - 178: An unexpected error has occurred. Please contact support!"
          />
        );
        return transaction;
      }
    } catch (error: any) {
      this.emit("error", error);
      return transaction;
    }
  }

  async signAllTransactions(transactions: Transaction[]): Promise<Transaction[]> {
    try {
      const wallet = this._wallet;
      if (!wallet) {
        toast.error(
          <Notification title="Slope Wallet" description="Please connect to your wallet first." />
        );
        return transactions;
      }

      try {
        const messages = transactions.map((transaction) =>
          bs58.encode(transaction.serializeMessage())
        );
        const { msg, data } = await wallet.signAllTransactions(messages);

        const length = transactions.length;
        if (!data.publicKey || data.signatures?.length !== length) {
          toast.error(
            <Notification
              title="Slope Wallet"
              description="WalletSignTransactionError - 228: An unexpected error has occurred. Please contact support!"
            />
          );
          return transactions;
        }

        const publicKey = new PublicKey(data.publicKey);

        for (let i = 0; i < length; i++) {
          transactions[i].addSignature(publicKey, bs58.decode(data.signatures[i]));
        }

        return transactions;
      } catch (error: any) {
        toast.error(
          <Notification
            title="Slope Wallet"
            description="WalletSignTransactionError - 231: An unexpected error has occurred. Please contact support!"
          />
        );
        return transactions;
      }
    } catch (error: any) {
      this.emit("error", error);
      throw error;
    }
  }
}

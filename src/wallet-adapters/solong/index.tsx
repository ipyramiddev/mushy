import EventEmitter from "eventemitter3";
import { PublicKey, Transaction } from "@solana/web3.js";
import { WalletAdapter } from "../../contexts/wallet";
import { Notification } from "../../components/Notification";
import { toast } from "react-toastify";

export class SolongWalletAdapter extends EventEmitter implements WalletAdapter {
  _publicKey: PublicKey | null;
  _onProcess: boolean;
  constructor() {
    super();
    this._publicKey = null;
    this._onProcess = false;
    this.connect = this.connect.bind(this);
  }

  get publicKey() {
    return this._publicKey;
  }

  async signTransaction(transaction: Transaction) {
    return (window as any).solong.signTransaction(transaction);
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    const signature: Uint8Array = await this.signMessage(message);

    return signature;
  }

  connect() {
    if (this._onProcess) {
      return;
    }

    if ((window as any).solong === undefined) {
      toast.error(
        <Notification
          title="Solong Error"
          description="Please install solong wallet from Chrome "
        ></Notification>
      );
      return;
    }

    this._onProcess = true;
    (window as any).solong
      .selectAccount()
      .then((account: any) => {
        this._publicKey = new PublicKey(account);
        this.emit("connect", this._publicKey);
      })
      .catch(() => {
        this.disconnect();
      })
      .finally(() => {
        this._onProcess = false;
      });
  }

  disconnect() {
    if (this._publicKey) {
      this._publicKey = null;
      this.emit("disconnect");
    }
  }
}

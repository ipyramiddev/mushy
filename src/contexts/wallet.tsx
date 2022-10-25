import { Dialog, Transition } from "@headlessui/react";
import Wallet from "@project-serum/sol-wallet-adapter";
import type { PublicKey } from "@solana/web3.js";
import { Transaction } from "@solana/web3.js";
import EventEmitter from "eventemitter3";
import React, { Fragment, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Notification } from "../components/Notification";
import { PhantomWalletAdapter } from "../wallet-adapters/phantom";
import { SolongWalletAdapter } from "../wallet-adapters/solong";
import { useLocalStorageState } from "../utils";
import { useConnectionConfig, useOpenConnection, useConnection } from "./connection";
import { SlopeWalletAdapter } from "../wallet-adapters/slope";
import { DomainNames, getUserDomains } from "../utils/name-service";
import { getDomainList } from "../utils/getDomainList";

const ASSETS_URL = "https://raw.githubusercontent.com/solana-labs/oyster/main/assets/wallets/";
export const WALLET_PROVIDERS = [
  {
    name: "Phantom",
    url: "https://phantom.app/",
    icon: `https://raydium.io/_nuxt/img/phantom.d9e3c61.png`,
    adapter: PhantomWalletAdapter,
  },
  {
    name: "Sollet",
    url: "https://www.sollet.io",
    icon: `${ASSETS_URL}sollet.svg`,
  },
  {
    name: "Solflare",
    url: "https://solflare.com/access-wallet",
    icon: `${ASSETS_URL}solflare.svg`,
  },
  {
    name: "Solong",
    url: "https://solongwallet.com",
    icon: `${ASSETS_URL}solong.png`,
    adapter: SolongWalletAdapter,
  },
  {
    name: "Slope",
    url: "https://www.slope.finance/#/wallet",
    icon: `https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/icons/slope.svg`,
    adapter: SlopeWalletAdapter,
  },
  {
    name: "MathWallet",
    url: "https://mathwallet.org",
    icon: `${ASSETS_URL}mathwallet.svg`,
  },
];

export interface WalletAdapter extends EventEmitter {
  publicKey: PublicKey | null;
  domainNames?: (DomainNames | undefined)[];
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signMessage(message: Uint8Array): Promise<Uint8Array>;
  connect: () => any;
  disconnect: () => any;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
  /* publicKey: () => PublicKey | null; */
}

const WalletContext = React.createContext<{
  wallet: WalletAdapter | undefined;
  connected: boolean;
  select: () => void;
  provider: typeof WALLET_PROVIDERS[number] | undefined;
}>({
  wallet: undefined,
  connected: false,
  select() {},
  provider: undefined,
});

export function WalletProvider({ children = null as any }) {
  const { endpoint } = useConnectionConfig();

  const [autoConnect, setAutoConnect] = useState(false);
  const [providerUrl, setProviderUrl] = useLocalStorageState("walletProvider");

  const provider = useMemo(
    () => WALLET_PROVIDERS.find(({ url }) => url === providerUrl),
    [providerUrl]
  );

  const wallet = useMemo(
    function () {
      if (provider) {
        return new (provider.adapter || Wallet)(providerUrl, endpoint) as WalletAdapter;
      }
    },
    [provider, providerUrl, endpoint]
  );

  const [connected, setConnected] = useState(false);
  const openConnection = useOpenConnection();

  useEffect(() => {
    if (wallet) {
      wallet.on("connect", () => {
        if (wallet.publicKey) {
          setConnected(true);
          const walletPublicKey = wallet.publicKey.toBase58();
          const keyToDisplay =
            walletPublicKey.length > 20
              ? `${walletPublicKey.substring(0, 7)}.....${walletPublicKey.substring(
                  walletPublicKey.length - 7,
                  walletPublicKey.length
                )}`
              : walletPublicKey;

          toast.info(
            <Notification
              title="Wallet update"
              description={`Connected to wallet ${
                wallet?.domainNames ? getDomainList(wallet?.domainNames) : keyToDisplay
              }`}
            />
          );
        }
      });

      wallet.on("disconnect", () => {
        setConnected(false);
        toast.info(<Notification title="Wallet update" description="Disconnected from wallet" />);
      });
    }

    return () => {
      setConnected(false);
      if (wallet) {
        wallet.disconnect();
      }
    };
  }, [wallet]);

  useEffect(() => {
    if (wallet && autoConnect) {
      openConnection();
      wallet.connect();
      setAutoConnect(false);
    }

    return () => {};
  }, [wallet, autoConnect, openConnection]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const select = useCallback(() => setIsModalVisible(true), []);
  const close = useCallback(() => setIsModalVisible(false), []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        select,
        provider,
      }}
    >
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Transition.Root show={isModalVisible} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-100 inset-0 overflow-y-auto"
          open={isModalVisible}
          onClose={setIsModalVisible}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-almost-black px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div className="text-center">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-white">
                    Choose your wallet
                  </Dialog.Title>
                  <div className="mt-3">
                    {WALLET_PROVIDERS.map((provider) => {
                      const onClick = function () {
                        setProviderUrl(provider.url);
                        setAutoConnect(true);
                        close();
                      };

                      return (
                        <button
                          key={provider.name}
                          onClick={onClick}
                          className="w-full inline-flex items-center border hover:bg-gray-500 text-lg font-semibold text-white px-2.5 py-1.5 my-1.5 focus:outline-none"
                        >
                          <img
                            alt={`${provider.name}`}
                            width={20}
                            height={20}
                            src={provider.icon}
                            className="mr-2"
                          />
                          <span>{provider.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const { wallet, connected, provider, select } = useContext(WalletContext);
  const openConnection = useOpenConnection();
  const connection = useConnection();

  useEffect(() => {
    (async () => {
      if (wallet && connected) {
        const domains = await getUserDomains(connection, wallet?.publicKey as PublicKey);
        wallet["domainNames"] = domains;
      }
    })();
  }, [wallet, connected, connection]);

  return {
    wallet,
    connected,
    provider,
    select,
    publicKey: wallet?.publicKey,
    connect() {
      if (wallet) {
        openConnection();
        return wallet.connect();
      }
      return select();
    },
    disconnect() {
      if (wallet) {
        wallet.disconnect();
      }
    },
  };
}

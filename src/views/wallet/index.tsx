import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useCallback, useEffect, useState } from "react";
import { fetchMetadata } from "../../actions/metadata";
import { ConnectMessage } from "../../components/ConnectMessage";
import { LoadingWidget } from "../../components/loadingWidget";
import { NftCard } from "../../components/NftCard";
import { NftCardPagination } from "../../components/NftCardPagination";
import { NftModalUnlistView } from "../../components/NftModalUnlistView";
import { Page } from "../../components/Page";
import { RefreshIcon } from "@heroicons/react/outline";
import { kFormatter } from "../../utils";

import {
  BASE_URL_COLLECTIONS_RETRIEVER,
  COLLECTIONS_RETRIEVER_QUERY_PARAM,
  BASE_URL_OFFERS_RETRIEVER,
} from "../../constants/urls";
import { useConnection, useConnectionConfig } from "../../contexts/connection";
import { useWallet } from "../../contexts/wallet";
import { fetchActiveAccountOffers } from "../../contracts/escrow";
import { fetchActiveDirectSellOffers } from "../../contracts/direct-sell";
import { useUserAccounts } from "../../hooks";
import { ActiveOffer, EscrowInfo } from "../../types";
import { getAllEscrowContracts, getEscrowFromCollectionName } from "../../utils";
import {
  EscrowLayout,
  ESCROW_ACCOUNT_DATA_LAYOUT,
  SaleInfoLayout,
  SALE_INFO_ACCOUNT_DATA_LAYOUT,
} from "../../utils/layout";
import { useTabState, Tab, TabList, TabPanel } from "reakit/Tab";
import { forceCheck } from 'react-lazyload';
import { StyledSelect } from "../../components/StyledSelect";
import { resourceUsage } from "process";
import { DIRECT_SELL_CONTRACT_ID } from "../../constants/contract_id";

export const WalletView = () => {
  const connection = useConnection();
  const { connected, wallet } = useWallet();
  const { endpoint } = useConnectionConfig();
  const { listedMintsFromEscrow, mintsInWalletUnlisted, listedMintsFromDirectSell, setListedMintsFromDirectSell,setMintsInWalletUnlisted, setListedMintsFromEscrow } =
    useUserAccounts();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUnlisted, setIsLoadingUnlisted] = useState(false);
  const [isLoadingListed, setIsLoadingListed] = useState(false);
  const [isLoadingEscrow, setIsLoadingEscrow] = useState(false);
  const [unlistedNfts, setUnlistedNfts] = useState<ActiveOffer[]>([]);
  const [listedNftsEscrow, setListedNftsEscrow] = useState<ActiveOffer[]>([]);
  const [listedNfts, setListedNfts] = useState<ActiveOffer[]>([]);
  // const [allListedOffers, setAllListedOffers] = useState<ActiveOffer[]>([]);
  const [collectionsInWallet, setCollectionsInWallet] = useState(() => new Set());
  const [collectionFilter, setCollectionFilter] = useState("");
  const tab = useTabState();

  const getListedNftsEscrow = useCallback(async () => {
    setIsLoadingEscrow(true);
    const collectionsListedWallet:any = [];
    const listedNftsFromWallet: (ActiveOffer | undefined)[] = await Promise.all(
      listedMintsFromEscrow.map(async (mint: string) => {
        let offerInfo;
        try {
          const offerPromise = await fetch(
            `${BASE_URL_OFFERS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint}`
          );
          offerInfo = await offerPromise.json();
        } catch (error) {
          console.log("darn");
        }

        let collection = null;
        try {
          const collectionPromise = await fetch(
            `${BASE_URL_COLLECTIONS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint}`
          );
          collection = JSON.parse(await collectionPromise.json());
        } catch (error) {
          // TODO: treat this error; perhaps show a error toastr
        }

        let contract = undefined;
        if (collection) {
          contract = getEscrowFromCollectionName(endpoint, collection?.name);
          if( !collectionsListedWallet.includes(collection?.name) ) {
            collectionsListedWallet.push(collection?.name);
          }
        }

        if (Object.keys(offerInfo).length > 0) {
          const activeOffer: ActiveOffer = {
            metadata: offerInfo.metadata,
            mint: mint,
            price: kFormatter((offerInfo.price as number) / LAMPORTS_PER_SOL),
            escrowPubkeyStr: "",
            contract: offerInfo.contract,
            collectionName: !!collection && collection !== [] ? collection?.name : "",
            isListed: false,
            isVerifeyed: !!collection && collection !== [] ? collection?.name : "",
          };
          return activeOffer;
        }
      })
    );
    // This filter is needed as fetchMetadata is null if a NFT has been listed; we want to remove this.
    const listedNftsFromWalletFiltered = listedNftsFromWallet.filter(Boolean) as ActiveOffer[];
    // console.log( unlistedNftsFromWalletFiltered );
    setListedNftsEscrow(listedNftsFromWalletFiltered);
    setCollectionsInWallet(new Set([...collectionsInWallet, ...collectionsListedWallet]));
    setIsLoadingEscrow(false);
  }, [listedMintsFromEscrow]);

  const getListedNfts = useCallback(async () => {
    setIsLoadingListed(true);
    const listedNftsFromDirect: (ActiveOffer | undefined)[] = await Promise.all(
      listedMintsFromDirectSell.map(async (mint: string) => {
        let offerInfo;
        try {
          const offerPromise = await fetch(
            `${BASE_URL_OFFERS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint}`
          );
          offerInfo = await offerPromise.json();
        } catch (error) {
          console.log("darn");
        }

        let collection = null;
        try {
          const collectionPromise = await fetch(
            `${BASE_URL_COLLECTIONS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint}`
          );
          collection = JSON.parse(await collectionPromise.json());
        } catch (error) {
          // TODO: treat this error; perhaps show a error toastr
        }

        let contract = undefined;
        if (collection) {
          contract = getEscrowFromCollectionName(endpoint, collection?.name);
        }

        if (Object.keys(offerInfo).length > 0) {
          const activeOffer: ActiveOffer = {
            metadata: offerInfo.metadata,
            mint: mint,
            price: kFormatter((offerInfo.price as number) / LAMPORTS_PER_SOL),
            escrowPubkeyStr: "",
            contract: offerInfo.contract,
            collectionName: !!collection && collection !== [] ? collection?.name : "",
            isListed: false,
            isVerifeyed: !!collection && collection !== [] ? collection?.name : "",
          };
          return activeOffer;
        }
      })
    );
    // This filter is needed as fetchMetadata is null if a NFT has been listed; we want to remove this.
    const listedNftsFromDirectFiltered = listedNftsFromDirect.filter(Boolean) as ActiveOffer[];
    // console.log( unlistedNftsFromWalletFiltered );
    setListedNfts(listedNftsFromDirectFiltered);
    setIsLoadingListed(false);
  }, [listedMintsFromDirectSell]);

  const getUnlistedNfts = useCallback(async () => {
    setIsLoadingUnlisted(true);
    const collectionsUnListedWallet:any = [];
    const listedAccountsDecoded: (ActiveOffer | undefined)[] = await Promise.all(
      mintsInWalletUnlisted.map(async (mint: string) => {
        const offer = {} as ActiveOffer;

        let collection = null;
        try {
          const collectionPromise = await fetch(
            `${BASE_URL_COLLECTIONS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint.toString()}`
          );
          collection = JSON.parse(await collectionPromise.json());
        } catch (error) {
          // TODO: treat this error; perhaps show a error toastr
        }

        const contract = getEscrowFromCollectionName(endpoint, "");
        let metadata = null;
        try {
          metadata = await fetchMetadata(connection, new PublicKey(mint), contract as EscrowInfo);
        } catch (error) {
          // TODO: treat this error; perhaps show a error toastr
        }

        if (!metadata) return;

        offer.mint = mint.toString();
        offer.price = 0;
        // offer.escrowPubkeyStr = account.pubkey.toString();
        offer.metadata = metadata;
        offer.isListed = true;
        offer.collectionName = !!collection && collection !== [] ? collection?.name : "";
        offer.isVerifeyed = !!collection && collection !== [];
        if( offer.collectionName ){
          collectionsUnListedWallet.push(offer.collectionName)
        }
        return offer;
      })
    );

    const listedAccountsDecodedFiltered = listedAccountsDecoded.filter(Boolean) as ActiveOffer[];
    setUnlistedNfts(listedAccountsDecodedFiltered);
    setCollectionsInWallet(new Set([...collectionsInWallet, ...collectionsUnListedWallet]));
    setIsLoadingUnlisted(false);
  }, [mintsInWalletUnlisted]);


  const refreshWalletItems = async () => {
      setIsLoading(true)
      await getListedNfts();
      await getListedNftsEscrow();
      await getUnlistedNfts();
      setIsLoading(false)
  };

  useEffect(() => {
    getUnlistedNfts();
  }, [mintsInWalletUnlisted]);

  useEffect(() => {
    getListedNfts();
  }, [listedMintsFromDirectSell]);

  useEffect(() => {
    getListedNftsEscrow();
  }, [listedMintsFromEscrow]);

  useEffect(() => {
    forceCheck();
  }, [tab]);

  return (
    <Page title="Your Wallet | DigitalEyes">
      <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {collectionsInWallet && (
            <div className="flex justify-between">
              <div className="w-60">
                <button
                  className="w-full py-2 font-medium text-white uppercase hover:text-gray-500 hover:border-gray-500 sm:text-sm flex items-center space-x-2"
                  onClick={() => refreshWalletItems()}
                >
                  <span>Refresh</span> <RefreshIcon className={
                  isLoading
                    ? "w-5 h-5 animate-spin"
                    : "w-5 h-5"
                } aria-hidden="true" />
                </button>
              </div>
              <div className="w-60">
                <StyledSelect
                  options={Array.from(collectionsInWallet)
                    .sort()
                    .map((value: any) => {
                      return {
                        value,
                        label: value,
                      };
                    })}
                  isLoading={isLoadingUnlisted}
                  onChange={(option: any) => {
                    if (option) {
                      setCollectionFilter(option.value);
                    } else {
                      setCollectionFilter("");
                    }
                  }}
                  placeholder="Sort by Collection..."
                  placeholderPrefix="Sorting by"
                  isClearable={true}
                />
              </div>
            </div>
          )}

          <div id="wallet-nav" className="flex justify-center text-sm uppercase">
            <TabList {...tab} aria-label="Wallet Tabs">
              <Tab {...tab} id="wallet">
                Wallet
              </Tab>
              <Tab {...tab} id="listed">
                Listed NFTs
              </Tab>
            </TabList>
          </div>
          <TabPanel {...tab} style={{}}>
            <>
              <div className="pt-16 sm:pt-12 mb-10">
                <div className="relative text-center">
                  <h1 className="h1">Your Wallet</h1>
                  <p className="wallet-key text-gray-400 mt-2 capitalize mx-auto w-5/6 text-sm leading-loose">
                    {wallet?.publicKey ? `${wallet?.publicKey}` : ""}
                  </p>
                </div>
              </div>
              {connected ? (
                <>
                  {isLoadingUnlisted ? (
                    <div className="flex justify-center pt-20">
                      <div className="w-48">
                        <LoadingWidget />
                      </div>
                    </div>
                  ) : (
                    <>
                      {" "}
                      {unlistedNfts.length ? (
                        <ul className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-1 grid gap-4 md:gap-6 lg:gap-8 pb-6">
                          {unlistedNfts.map((nft:ActiveOffer, index:any) => {
                            if (collectionFilter && collectionFilter !== nft.collectionName) {
                              return;
                            }
                            return <NftCard key={index} offer={nft} />;
                          })}
                        </ul>
                      ) : (
                        <h1 className="text-2xl font-bold text-center text-white sm:tracking-tight py-6">
                          You don't have any NFTs{" "}
                        </h1>
                      )}
                    </>
                  )}
                </>
              ) : (
                <ConnectMessage />
              )}
            </>
          </TabPanel>

          <TabPanel {...tab} style={{}}>
            <>
              <div className="pt-16 sm:pt-12 mb-10">
                <div className="relative text-center">
                  <h1 className="h1">Your Listed NFTs</h1>
                  <p className="wallet-key text-gray-400 mt-2 capitalize mx-auto w-5/6 text-sm leading-loose">
                    {wallet?.publicKey ? `${wallet?.publicKey}` : ""}
                  </p>
                </div>
              </div>
              {connected ? (
                <>
                  {(isLoadingListed || isLoadingEscrow) ? (
                    <div className="flex justify-center pt-20">
                      <div className="w-48">
                        <LoadingWidget />
                      </div>
                    </div>
                  ) : (
                    <>

                      {listedNfts.length ? (
                        <ul className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-1 grid gap-4 md:gap-6 lg:gap-8 pb-6">
                          {listedNfts.map((nft:ActiveOffer, index:any) => {
                            if (collectionFilter && collectionFilter !== nft.collectionName) return;
                            return <NftCard key={index} offer={nft} />;
                          })}
                        </ul>
                      ) : (
                        <>
                         <p className="text-base text-center text-white sm:tracking-tight pt-6">
                            You don't have any NFTs listed from your wallet.
                          </p>
                          <p className="text-base text-center text-white sm:tracking-tight pb-6">
                            If this seems like a mistake try refreshing below.
                          </p>
                          <p className="flex justify-center">
                            <button onClick={() => refreshWalletItems()}>
                              <span className="text-white inline-flex items-center">
                              <RefreshIcon className="h-4 w-4 mr-1" /> Refresh
                              </span>
                            </button>
                          </p>
                        </>
                      )}

                      {listedNftsEscrow.length > 0 && (
                        <>
                          <h3 className="text-xl font-bold text-center text-white sm:tracking-tight pt-6">The following items need your attention:</h3>
                          <p className="text-base text-center text-white sm:tracking-tight pb-6 pt-2">Please delist and relist nfts in the DigitalEyes escrow wallet so you can benefit from the upgraded wallet experience</p>
                          <ul className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-1 grid gap-4 md:gap-6 lg:gap-8 pb-6">
                            {listedNftsEscrow.map((nft:ActiveOffer, index:any) => {
                              if (collectionFilter && collectionFilter !== nft.collectionName) return;
                              return <NftCard key={index} offer={nft} />;
                            })}
                          </ul>
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <ConnectMessage />
              )}
            </>
          </TabPanel>
        </div>
      </div>
    </Page>
  );
};

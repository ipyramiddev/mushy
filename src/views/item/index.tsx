import { RefreshIcon } from "@heroicons/react/outline";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { fetchMetadata, fetchMetadataWithoutContract } from "../../actions/metadata";
import { LoadingWidget } from "../../components/loadingWidget";
import { NftDetails } from "../../components/NftDetails";
import { Page } from "../../components/Page";
import { UNVERIFEYED_COLLECTION_OPTION } from "../../constants/collections";
import * as ROUTES from "../../constants/routes";
import {
  BASE_URL_COLLECTIONS_RETRIEVER,
  BASE_URL_OFFERS_RETRIEVER,
  COLLECTIONS_RETRIEVER_QUERY_PARAM,
  GET_SOLO_USER_NO_AUTH,
  GET_SOLO_USER_NO_AUTH_QUERY_PARAM,
} from "../../constants/urls";
import { useCollections } from "../../contexts/collections";
import { useConnection, useConnectionConfig, useOpenConnection } from "../../contexts/connection";
import { fetchActiveAccountOffers } from "../../contracts/escrow";
import { ActiveOffer, EscrowInfo } from "../../types";
import { getAllEscrowContracts, getEscrowFromCollectionName } from "../../utils";
import {
  EscrowLayout,
  ESCROW_ACCOUNT_DATA_LAYOUT,
  SaleInfoLayout,
  SALE_INFO_ACCOUNT_DATA_LAYOUT,
} from "../../utils/layout";
import { ErrorView } from "../error";
import { DIRECT_SELL_CONTRACT_ID } from "../../constants/contract_id";
import { fetchActiveDirectSellOffers } from "../../contracts/direct-sell";

export const ItemView = () => {
  const connection = useConnection();
  const { endpoint } = useConnectionConfig();
  const [offer, setOffer] = useState<ActiveOffer>();
  const [nft, setNft] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { collection, mint } = useParams<any>();
  const escrows = getAllEscrowContracts(endpoint);
  const { collections, isLoading: isCollectionsLoading } = useCollections();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [statusOnchain, setStatusOnchain] = useState("");
  const openConnection = useOpenConnection();

  const refreshItem = async () => {
    setIsLoading(true);
    setIsRefreshing(true);
    const salesInfo = await fetchActiveDirectSellOffers(connection, undefined, mint);

    if (salesInfo.length > 0) {
      setStatusOnchain("listed");
      setIsRefreshing(false);
    } else {
      const accounts = await fetchActiveAccountOffers(connection, escrows, undefined, mint);
      setIsRefreshing(false);
      if (accounts.length > 0) {
        setStatusOnchain("escrow");
      } else {
        setStatusOnchain("unlisted");
      }
    }

    setIsLoading(false);
  };

  const goBackToCollection = () => {
    const collectionName = collection;
    if (!!collectionName) {
      history.push(`${ROUTES.COLLECTIONS}/${collectionName}`);
    } else {
      history.push(`${ROUTES.COLLECTIONS}/${UNVERIFEYED_COLLECTION_OPTION.name}`);
    }
  };

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const pk = params.get("pk");

  useEffect(() => {
    openConnection();
  }, []);

  const setNftDataFromChain = async () => {
    const nft: any = {};
    nft.mint = mint.toString();
    // TODO: think we need to make an individual api call

    let collection;
    try {
      const collectionPromise = await fetch(
        `${BASE_URL_COLLECTIONS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint.toString()}`
      );
      collection = await collectionPromise.json();
    } catch (error) {
      setError(true);
    }

    nft.collectionName = !!collection && collection !== [] ? collection?.name : "";
    nft.collection = !!collection && collection;
    nft.isVerifeyed = !!collection && collection !== [];
    nft.disputedMessage = !!collection && collection !== [] ? collection?.disputedMessage : "";

    const contract = getEscrowFromCollectionName(endpoint, collection?.name);

    try {
      nft.metadata = await fetchMetadata(
        connection,
        new PublicKey(mint.toString()),
        contract as EscrowInfo
      );
    } catch (e) {
      setError(true);
    }
    setNft(nft);
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const collectionName = collection;
        if (mint && !isCollectionsLoading) {
          let offerInfo;
          try {
            const offerPromise = await fetch(
              `${BASE_URL_OFFERS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint}`
            );
            offerInfo = await offerPromise.json();
          } catch (error) {
            setError(true);
          }
          if (offerInfo.contract && offerInfo.contract === DIRECT_SELL_CONTRACT_ID) {
            const saleInfos = await fetchActiveDirectSellOffers(connection, undefined, mint);
            if (!saleInfos.length) {
              await setNftDataFromChain();
              setIsLoading(false);
            } else {
              const decodedSaleInfo = SALE_INFO_ACCOUNT_DATA_LAYOUT.decode(
                saleInfos[0].account.data.slice(8)
              ) as SaleInfoLayout;
              const initializerPubkey = decodedSaleInfo.initializerPubkey.toString();
              const offer = {} as ActiveOffer;
              offer.mint = decodedSaleInfo.mintPubkey.toString();
              offer.owner = offerInfo.owner;
              offer.price =
                new BN(decodedSaleInfo.expectedAmount, 10, "le").toNumber() / LAMPORTS_PER_SOL;
              offer.contract = DIRECT_SELL_CONTRACT_ID;
              offer.saleInfo = saleInfos[0].pubkey.toString();
              offer.initializerPubkey = initializerPubkey;

              let collection;
              try {
                const collectionPromise = await fetch(
                  `${BASE_URL_COLLECTIONS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint.toString()}`
                );
                collection = await collectionPromise.json();
              } catch (error) {
                setError(true);
              }

              offer.collectionName = !!collection && collection !== [] ? collection?.name : "";
              offer.collection = !!collection && collection;
              offer.isVerifeyed = !!collection && collection !== [];
              offer.disputedMessage =
                !!collection && collection !== [] ? collection?.disputedMessage : "";

              if (!!collection && collection.length) {
                const collectionJsonSolo = JSON.parse(collection).collectionId.split("#");
                if (collectionJsonSolo[0] == "solo") {
                  try {
                    const artistInfo = await fetch(
                      `${GET_SOLO_USER_NO_AUTH}?${GET_SOLO_USER_NO_AUTH_QUERY_PARAM}=${collectionJsonSolo[2]}`
                    ).then((res) => res.json());
                    if (artistInfo.username) {
                      offer.artistUser = artistInfo.username;
                      offer.artistVerified = artistInfo.verified;
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }
              }
              try {
                offer.metadata = await fetchMetadataWithoutContract(
                  connection,
                  new PublicKey(mint.toString())
                );
              } catch (e) {
                setError(true);
              }

              setStatusOnchain("listed");
              setOffer(offer);
              setIsLoading(false);
            }
          } else if (offerInfo.contract) {
            const accounts = await fetchActiveAccountOffers(connection, escrows, undefined, mint);
            let collection;
            let account = accounts[0];
            if (pk && accounts.length > 1) {
              const accountMatchesPK = accounts.find((account) => {
                if (!account) return;
                return account.pubkey.toString() === pk;
              });

              account = accountMatchesPK || account;
            }

            if (accounts.length > 0) {
              setStatusOnchain("escrow");
            } else {
              setStatusOnchain("unlisted");
            }

            if (!account) {
              await setNftDataFromChain();
              setIsLoading(false);
              return;
            }
            const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(
              account.account.data
            ) as EscrowLayout;
            const mintKey = new PublicKey(decodedEscrowState.mintPubkey);
            const offer = {} as ActiveOffer;
            offer.owner = offerInfo.owner;
            offer.mint = mintKey.toString();
            offer.price =
              new BN(decodedEscrowState.expectedAmount, 10, "le").toNumber() / LAMPORTS_PER_SOL;
            offer.escrowPubkeyStr = account.pubkey.toString();

            try {
              const collectionPromise = await fetch(
                `${BASE_URL_COLLECTIONS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mintKey.toString()}`
              );
              collection = await collectionPromise.json();
            } catch (error) {
              setError(true);
            }

            offer.collectionName = !!collection && collection !== [] ? collection?.name : "";
            offer.collection = !!collection && collection;
            offer.isVerifeyed = !!collection && collection !== [];
            offer.disputedMessage =
              !!collection && collection !== [] ? collection?.disputedMessage : "";

            const contract = getEscrowFromCollectionName(endpoint, collection?.name);

            if (!!collection && collection.length) {
              const collectionJsonSolo = JSON.parse(collection).collectionId.split("#");
              if (collectionJsonSolo[0] == "solo") {
                try {
                  const artistInfo = await fetch(
                    `${GET_SOLO_USER_NO_AUTH}?${GET_SOLO_USER_NO_AUTH_QUERY_PARAM}=${collectionJsonSolo[2]}`
                  ).then((res) => res.json());
                  if (artistInfo.username) {
                    offer.artistUser = artistInfo.username;
                    offer.artistVerified = artistInfo.verified;
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            }
            try {
              offer.metadata = await fetchMetadata(
                connection,
                new PublicKey(mintKey.toString()),
                contract as EscrowInfo
              );
            } catch (e) {
              setError(true);
            }

            setOffer(offer);
            setIsLoading(false);
          } else {
            const nft: any = {};
            nft.mint = mint.toString();
            // TODO: think we need to make an individual api call

            let collection;

            try {
              const collectionPromise = await fetch(
                `${BASE_URL_COLLECTIONS_RETRIEVER}?${COLLECTIONS_RETRIEVER_QUERY_PARAM}=${mint.toString()}`
              );

              collection = await collectionPromise.json();
            } catch (error) {
              setError(true);
            }

            nft.collectionName = !!collection && collection !== [] ? collection?.name : "";
            nft.collection = !!collection && collection;
            nft.isVerifeyed = !!collection && collection !== [];
            nft.disputedMessage =
              !!collection && collection !== [] ? collection?.disputedMessage : "";

            const contract = getEscrowFromCollectionName(endpoint, JSON.parse(collection)?.name);

            try {
              const collectionJsonSolo = JSON.parse(collection).collectionId.split("#");
              if (collectionJsonSolo[0] == "solo") {
                try {
                  const artistInfo = await fetch(
                    `${GET_SOLO_USER_NO_AUTH}?${GET_SOLO_USER_NO_AUTH_QUERY_PARAM}=${collectionJsonSolo[2]}`
                  ).then((res) => res.json());
                  if (artistInfo.username) {
                    nft.artistUser = artistInfo.username;
                    nft.artistVerified = artistInfo.verified;
                  }
                } catch (error) {
                  console.log(error);
                }
              }
            } catch (e) {
              console.log("solo collection fetch failed", e);
            }

            try {
              nft.metadata = await fetchMetadata(
                connection,
                new PublicKey(mint.toString()),
                contract as EscrowInfo
              );
            } catch (e) {
              setError(true);
            }
            setNft(nft);
            await setNftDataFromChain();
            setIsLoading(false);
          }
        }
      } catch (err) {
        setIsLoading(false);
      }
    })();
  }, [connection, endpoint, mint, collections, openConnection, isRefreshing]);

  useEffect(() => {
    if (statusOnchain === "unlisted") {
      setNftDataFromChain();
    }
  }, [statusOnchain]);

  const nftData = statusOnchain
    ? offer && (statusOnchain == "listed" || statusOnchain == "escrow")
      ? offer
      : nft
    : offer
    ? offer
    : nft;
  const isListed = statusOnchain
    ? offer && (statusOnchain == "listed" || statusOnchain == "escrow")
      ? true
      : false
    : offer
    ? true
    : false;
  const pageTitle = nftData ? `${nftData?.metadata?.name} | DigitalEyes` : "Item | DigitalEyes";
  if (error) {
    return <ErrorView />;
  }

  // TODO: fix loading=false before nftData loaded
  return (
    <Page className="md:max-w-7xl mx-auto sm:px-6 lg:px-8" title={pageTitle}>
      <div className="flex items-center justify-center sm:pt-4 sm:px-4 sm:block sm:p-0">
        {isLoading || isCollectionsLoading ? (
          <div className="flex justify-center">
            <div className="w-48">
              <LoadingWidget />
            </div>
          </div>
        ) : nftData ? (
          <NftDetails
            nftData={nftData}
            cancelAction={goBackToCollection}
            buttonText={`Buy for ${nftData.price} SOL`}
            dialogTitle={"Buy some art"}
            cancelText={`Back to ${collection ? collection : "unverifeyed"}`}
            isListed={isListed}
            disputedMessage={nftData.disputedMessage}
            refreshItem={refreshItem}
            statusOnchain={statusOnchain}
          ></NftDetails>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-2xl font-bold text-white sm:tracking-tight pt-12">
              Something went wrong.
            </div>
            <p className="text-base text-white sm:tracking-tight pb-12 mt-5">
              Please try again or double check the item url.
            </p>
            <button className="hover:text-white mx-2" onClick={refreshItem}>
              <span className="text-white self-start inline-flex items-center text-xs btn">
                <RefreshIcon className="h-4 w-4 mr-1" /> Refresh
              </span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-48">
              <LoadingWidget />
            </div>
          </div>
        )}
      </div>
    </Page>
  );
};

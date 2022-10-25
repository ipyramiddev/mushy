import { LoadingWidget } from "../../components/loadingWidget";
import { Page } from "../../components/Page";
import { useTabState, Tab, TabList, TabPanel } from "reakit/Tab";
import { ActiveOffer, EscrowInfo, ActiveArtist } from "../../types";
import { SoloNftCard } from "../../components/SoloNftCard";
import { ArtistCard } from "../../components/ArtistCard";
import CollectionActions from "../../components/CollectionActions";
import { useHistory } from "react-router-dom";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import {
  BASE_URL_SOLO_OFFERS_RETRIEVER,
  BASE_URL_SOLO_ARTISTS_RETRIEVER,
} from "../../constants/urls";
import { LAMPORTS_PER_SOL } from "../../constants";
import useDidMountEffect from "../../utils/use-did-mount-effect";

import { classNames, mapObjectQueryParams, removeNullValuesFromObject } from "../../utils";

export interface OffersRetrievalResponse {
  next_cursor: string;
  offers: ActiveOffer[];
  count: number;
}

export interface ArtistsRetrievalResponse {
  cursor: string;
  artist_list: ActiveArtist[];
  count: number;
}
export const SoloView = () => {
  const tab = useTabState();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [isLoadingArtists, setIsLoadingArtists] = useState(false);
  const [sorting, setSorting] = useState<string>("addEpoch=desc");
  const [activeTab, setActiveTab] = useState("creations");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [nextCursorArtist, setNextCursorArtist] = useState<string | null>(null);
  const [isCollectionWithOffers, setIsCollectionWithOffers] = useState(true);
  const [activeOffers, setActiveOffers] = useState<ActiveOffer[]>([]);
  const [activeArtists, setActiveArtists] = useState<ActiveArtist[]>([]);
  const [artistRetrievalResponseCount, setArtistRetrievalResponseCount] = useState<number>();
  const [offerRetrievalResponseCount, setOfferRetrievalResponseCount] = useState<number>();
  const [error, setError] = useState(false);
  const history = useHistory();


  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    loadOffersController.current = new AbortController();
    return () => {
      loadOffersController.current?.abort();
    };
  }, []);

  let loadOffersController = useRef<AbortController>();
  let loadArtistsController = useRef<AbortController>();

  const loadOffers = useCallback(
    async ({ isInitialLoad = false }: { isInitialLoad?: boolean }, sorting) => {
      if (isLoadingOffers) {
        return;
      }
      if (!!nextCursor || isInitialLoad) {
        if (isInitialLoad) {
          setActiveOffers([]);
        }
        setIsLoading(true);
        const apiUrl = `${BASE_URL_SOLO_OFFERS_RETRIEVER}?${sorting}&${mapObjectQueryParams(
          removeNullValuesFromObject({ cursor: isInitialLoad ? null : nextCursor })
        )}`;
        try {
          const signal = loadOffersController.current?.signal;
          const response = await fetch(apiUrl, { signal });
          const responseJson: OffersRetrievalResponse = await response.json();
          await parseOffersRetrievalResponse(responseJson, isInitialLoad);
        } catch (e) {
          setActiveOffers([]);
          setOfferRetrievalResponseCount(0);
          setError(true);
          console.error(`Could not fetch solo offers`);
        }
        setIsLoading(false);
        setIsLoadingOffers(false);
      }
    },
    [nextCursor, activeOffers, isLoadingOffers]
  );

  const getOffersCount = (): number =>
    !!offerRetrievalResponseCount ? offerRetrievalResponseCount : 0;

  const loadArtists = useCallback(
    async ({ isInitialLoad = false }: { isInitialLoad?: boolean }) => {
      if (isLoadingArtists) {
        return;
      }
      if (!!nextCursorArtist || isInitialLoad) {
        if (isInitialLoad) {
          setActiveArtists([]);
        }
        setIsLoadingArtists(true);
        const apiUrl = `${BASE_URL_SOLO_ARTISTS_RETRIEVER}?${mapObjectQueryParams(
          removeNullValuesFromObject({ cursor: isInitialLoad ? null : nextCursorArtist })
        )}`;
        try {
          const signal = loadArtistsController.current?.signal;
          const response = await fetch(apiUrl, { signal });
          const responseJson: ArtistsRetrievalResponse = await response.json();
          await parseArtistsRetrievalResponse(responseJson, isInitialLoad);
        } catch (e) {
          setActiveArtists([]);
          setArtistRetrievalResponseCount(0);
          setError(true);
          console.error(`Could not fetch solo artists`);
        }
        setIsLoading(false);
        setIsLoadingArtists(false);
      }
    },
    [nextCursorArtist, activeArtists, isLoadingArtists]
  );

  const parseOffersRetrievalResponse = async (
    response: OffersRetrievalResponse,
    isInitialLoad: boolean
  ) => {
    setNextCursor(response.next_cursor);
    if (isInitialLoad) {
      setOfferRetrievalResponseCount(response.count);
    }
    if (response?.offers?.length > 0) {
      const accountsDecoded = (
        await Promise.all(
          response?.offers.map(async (offer: any) => {
            if (!!offer && offer.price > 0) {
              return {
                mint: offer.mint,
                price: offer.price / LAMPORTS_PER_SOL,
                escrowPubkeyStr: offer.contract,
                uri: offer.uri,
                collectionName: offer.collection,
                contract: offer.contract,
                isVerifeyed: offer.verifeyed,
                metadata: offer.metadata,
                lastPrice: offer.lastPrice,
                owner: offer.owner,
                solo: offer.solo,
                tags: offer.tags,
                artistImage: offer.soloImage,
                artistVerified: offer.soloVerified,
                artistUser: offer.soloUsername,
              } as ActiveOffer;
            }
            return false;
          })
        )
      ).filter(Boolean) as ActiveOffer[];

      const offers = (
        await Promise.all(
          accountsDecoded.map(async (offer) => {
            if (!!offer.metadata && Object.keys(offer?.metadata)?.length > 0) {
              return offer;
            }

            const metaDataResponse = await fetch(offer.uri as RequestInfo).catch((err) => {
              return null;
            });
            if (metaDataResponse) {
              offer.metadata = await metaDataResponse.json();
              return offer;
            }
            return false;
          })
        )
      ).filter(Boolean) as ActiveOffer[];

      if (!isInitialLoad) {
        setActiveOffers([...activeOffers, ...offers]);
      } else {
        setActiveOffers(offers);
      }
    } else {
      setActiveOffers([]);
    }
  };

  const parseArtistsRetrievalResponse = async (
    response: ArtistsRetrievalResponse,
    isInitialLoad: boolean
  ) => {
    setNextCursorArtist(response.cursor);
    if (isInitialLoad) {
      setArtistRetrievalResponseCount(response.count);
    }

    if (response?.artist_list?.length > 0) {
      const artists = (
        await Promise.all(
          response?.artist_list.map(async (artist: any) => {
            if (!!artist) {
              return {
                banner: artist.banner,
                created_at: artist.created_at,
                description: artist.description,
                discord: artist.discord,
                image: artist.image,
                instagram: artist.instagram,
                mints_list: artist.mints_list,
                theme: artist.theme,
                twitter: artist.twitter,
                updated_at: artist.updated_at,
                user_id: artist.user_id,
                username: artist.username,
                verified: artist.verified,
                wallet_key: artist.wallet_key,
                website: artist.website,
              } as ActiveArtist;
            }
            return false;
          })
        )
      ).filter(Boolean) as ActiveArtist[];

      if (!isInitialLoad) {
        setActiveArtists([...activeArtists, ...artists]);
      } else {
        setActiveArtists(artists);
      }
    } else {
      setActiveArtists([]);
    }
  };

  useEffect(() => {
    if (!isLoading && activeTab === "creations") {
      loadOffers({ isInitialLoad: true },sorting);
      loadArtists({ isInitialLoad: true });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      if (activeTab === "creations") {
        loadOffers({},sorting);
      } else {
        loadArtists({});
      }
    }
  }, [loadOffers, loadArtists]);


  useDidMountEffect(() => {
    if (!isLoading) {
      loadOffers({ isInitialLoad: true },sorting);
    }
  }, [sorting]);


  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);


  return (
    <Page title="#solo | DigitalEyes">
      <div className="max-w-2xl mx-auto pt-10 px-4 sm:px-0 lg:px-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-0 sm:mx-0 lg:px-8">
          <div className="flex justify-end">
            <div>
              <button
                className="py-3 px-8 md:px-8 text-white lowercase opacity-80 rounded-lg bg-gradient-to-r from-solana-teal to-solana-magenta hover:text-gray-100 hover:opacity-100 text-xs flex items-center space-x-2"
                onClick={(_) => history.push(`/solo-art/create/0`)}
              >
                <span>create</span>
              </button>
            </div>
          </div>
          <div className="pt-4 sm:pt-4 mb-2">
            <div className="relative flex justify-center">
              <img src="/assets/logo/solo_beta.png" alt="SOLO" className="w-48"/>
            </div>
            <div className="relative max-w-7xl sm:max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
              <div id="wallet-nav" className="flex justify-center text-xs md:text-sm">
                <TabList {...tab} aria-label="Wallet Tabs">
                  <Tab {...tab} onClick={() => setActiveTab("creations")}>
                    <p>Browse creations</p>
                  </Tab>
                  <Tab {...tab} onClick={() => setActiveTab("artists")}>
                    <p>Browse artists</p>
                  </Tab>
                </TabList>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TabPanel {...tab}>
        <>
          <div className="grid grid-cols-1 pt-5 sm:pt-3 mb-2 max-w-7xl mx-auto sm:px-0 lg:px-8">
          {activeOffers.length==0 && !isLoading && (<div className="text-sm text-center opacity-70 my-20">nothing to see here yet...</div>)}
          { activeOffers && (
            <div className="flex justify-end">
            <CollectionActions
            isCollectionWithOffers={isCollectionWithOffers}
            sorting={sorting}
            setSorting={setSorting}
            isLoading={isLoading}
            /></div>)}

            {activeOffers &&
              activeOffers.map((creation: any) => (
                <div
                  className={
                    activeOffers.indexOf(creation) > 0
                      ? "mt-18 mb-10 lg:px-80 lg:mt-5"
                      : "pt-0 mb-10 lg:px-80 lg:mt-5"
                  }
                >
                  <SoloNftCard offer={creation} />
                </div>
              ))}
            {isLoading && (
              <div className="flex-1 justify-center pt-20">
                <div className="w-48 mx-auto">
                  <LoadingWidget />
                </div>
              </div>
            )}
          </div>
        </>
      </TabPanel>

      <TabPanel {...tab}>
        <>
          <div className="grid grid-cols-1 pt-5 sm:pt-3 mb-2 max-w-7xl mx-auto sm:px-0 lg:px-8">
          {activeArtists.length==0 && (<div className="text-sm text-center opacity-70 my-20">nothing to see here yet...</div>)}

            {activeArtists &&
              activeArtists.map(
                (artist: any) =>
                  artist.username && (
                    <div
                      className={
                        activeArtists.indexOf(artist) > 0
                          ? "mt-14 mb-5 lg:px-40 lg:mt-5"
                          : "pt-0 mb-5 lg:px-40 lg:mt-5"
                      }
                    >
                      <ArtistCard artist={artist} />
                    </div>
                  )
              )}
            {isLoading && (
              <div className="flex-1 justify-center pt-20">
                <div className="w-48 mx-auto">
                  <LoadingWidget />
                </div>
              </div>
            )}
          </div>
        </>
      </TabPanel>
    </Page>
  );
};

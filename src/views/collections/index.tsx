// @ts-ignore
import { IKImage } from "imagekitio-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CollectionMeta from "../../components/CollectionMeta";
import CollectionActions from "../../components/CollectionActions";
import CollectionFilters from "../../components/CollectionFilters";
import { LoadingWidget } from "../../components/loadingWidget";
import { NftCard } from "../../components/NftCard";
import { NftModalBuyView } from "../../components/NftModalBuyView";
import { NsfwPopup } from "../../components/NsfwPopup";
import { Page } from "../../components/Page";
import { VerifeyedBadge } from "../../components/VerifeyedBadge";
import { LAMPORTS_PER_SOL } from "../../constants";
import { UNVERIFEYED_COLLECTION_OPTION } from "../../constants/collections";
import { IMAGE_KIT_ENDPOINT_URL } from "../../constants/images";
import {
  LocalStorageValueDisplayNSFW,
  LOCAL_STORAGE_KEY_DISPLAY_NSFW_COLLECTIONS,
} from "../../constants/local-storage";
import * as ROUTES from "../../constants/routes";
import {
  BASE_URL_COLLECTIONS_RETRIEVER,
  BASE_URL_OFFERS_RETRIEVER,
  OFFERS_RETRIEVER_QUERY_PARAM,
  BASE_URL_HIGHEST_SALE_RETRIEVER,
  BASE_URL_COLLECTION_SALES_HISTORY,
  COLLECTION_SALES_HISTORY_PARAM,
  TYPE_SALES_HISTORY_PARAM,
} from "../../constants/urls";
import { useCollections } from "../../contexts/collections";
import { ActiveOffer, SaleData } from "../../types";
import {
  classNames,
  encodeFiltersToUrl,
  findCollection,
  getFiltersFromUrl,
  mapObjectQueryParams,
  removeNullValuesFromObject,
  useLocalStorageState,
} from "../../utils";
import useDidMountEffect from "../../utils/use-did-mount-effect";
import { NotFoundView } from "../404";
import { ErrorView } from "../error";
import { FavouriteButton } from "../../components/FavouriteButton";
import { ThumbnailImage } from "../../components/ThumbnailImage";
import { RefreshIcon } from "@heroicons/react/outline";
import { CurrencyDollarIcon } from "@heroicons/react/outline";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useConnection } from "../../contexts";
import { SalesHistoryList } from "../../components/SalesHistoryList";

export interface CollectionMetadata {
  description: string;
  endpoint: string;
  filters: CollectionMetadataFilter[];
  name: string;
  price_floor: number;
  highest_sale: number;
  thumbnail: string;
  website: string;
  no_offers: number;
  volumeTotal?: number;
}

export interface CollectionMetadataFilter {
  name: string;
  values: string[];
}

export interface OffersRetrievalResponse {
  next_cursor: string;
  offers: ActiveOffer[];
  count: number;
  price_floor: number;
}

export const CollectionsView = () => {
  dayjs.extend(relativeTime);
  const location = useLocation();
  const { collectionName } = useParams<{ collectionName: string }>();
  const [monkey, setMonkey] = useState<ActiveOffer>();
  const [modalCard, setModalCard] = useState(true);
  const { collections, topCollections, isLoading: isLoadingCollections } = useCollections();

  const [sorting, setSorting] = useState<string>("price=asc");

  const [activeOffers, setActiveOffers] = useState<ActiveOffer[]>([]);
  const [isCollectionWithOffers, setIsCollectionWithOffers] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [salesHistory, setSalesHistory] = useState<SaleData[]>([]);
  const [salesHistoryDrawer, setSalesHistoryDrawer] = useState(false);
  const [priceFloor, setPriceFloor] = useState<number>();
  const [highestSale, setHighestSale] = useState<number>();
  const [showActiveFilters, setShowActiveFilters] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string | null;
  }>();
  const [filtersFromMetadata, setFiltersFromMetadata] = useState<CollectionMetadataFilter[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [offerRetrievalResponseCount, setOfferRetrievalResponseCount] = useState<number>();
  const [totalVolume, setTotalVolume] = useState<number>(0);
  const [error, setError] = useState(false);
  const { width } = useWindowDimensions();
  const { push } = useHistory();

  const currentCollection = findCollection([...collections, ...topCollections], collectionName);
  const collectionDescription = currentCollection?.description;
  const nameFromCollection = currentCollection?.name;
  const disputedMessageFromCollection = currentCollection?.disputedMessage;
  const isNsfwCollection = currentCollection?.isNsfw;

  const isUnverifeyedPage = collectionName === UNVERIFEYED_COLLECTION_OPTION.name;

  const addSelectedFilter = (
    filterName: string,
    selectedFilter: {
      value: any;
      label: string;
    }
  ) => {
    if (!!selectedFilter) {
      setSelectedFilters({
        ...selectedFilters,
        [filterName]: selectedFilter.value,
      });
    } else {
      setSelectedFilters({
        ...selectedFilters,
        [filterName]: null,
      });
    }
  };

  const modalCardToggleHandler = () => {
    if (modalCard) {
      setModalCard(false);
    } else {
      setModalCard(true);
    }
  };

  useEffect(() => {
    setIsLoading(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (!isLoadingCollections && nameFromCollection) {
      loadCollection(controller.signal);
    }

    return () => {
      controller.abort();
    };
  }, [nameFromCollection, isLoadingCollections]);

  useEffect(() => {
    loadOffersController.current = new AbortController();
    return () => {
      loadOffersController.current?.abort();
    };
  }, [collectionName]);

  const loadCollection = async (signal: AbortSignal) => {
    setSorting("price=asc");
    setActiveOffers([]);
    setPriceFloor(undefined);
    if (width <= 768) {
      setShowActiveFilters(false);
    } else {
      setShowActiveFilters(true);
    }
    setFiltersFromMetadata([]);
    setIsCollectionWithOffers(true);
    if (!isUnverifeyedPage) {
      const collectionMetadataApiUrl = `${BASE_URL_COLLECTIONS_RETRIEVER}?collection=${encodeURIComponent(
        nameFromCollection
      )}`;
      try {
        const collectionMetadata: CollectionMetadata = await (
          await fetch(collectionMetadataApiUrl, { signal })
        ).json();
        setFiltersFromMetadata(collectionMetadata?.filters || []);
        setTotalVolume(collectionMetadata.volumeTotal ? collectionMetadata.volumeTotal : 0);
        const filtersFromUrl = location.search?.substring(1);
        const validFilters = getFiltersFromUrl({
          filtersFromUrl,
          collectionFilters: collectionMetadata?.filters,
        });
        setSelectedFilters(validFilters);
      } catch (e) {
        setActiveOffers([]);
        setIsCollectionWithOffers(false);
        setPriceFloor(undefined);
        setOfferRetrievalResponseCount(0);
        setError(true);
        console.error(`Could not fetch collection metadata for: ${collectionName}`);
      }
    } else {
      loadOffers({ isInitialLoad: true });
    }
  };

  let loadOffersController = useRef<AbortController>();
  const loadOffers = useCallback(
    async ({ isInitialLoad = false }: { isInitialLoad?: boolean }) => {
      if (isLoadingOffers) {
        return;
      }

      if (!!nextCursor || isInitialLoad) {
        if (isInitialLoad) {
          setActiveOffers([]);
          setPriceFloor(undefined);
        }
        setIsLoading(true);
        setIsLoadingOffers(true);
        const apiUrl = `${BASE_URL_OFFERS_RETRIEVER}?${mapObjectQueryParams(
          removeNullValuesFromObject({
            ...(!isUnverifeyedPage ? { [OFFERS_RETRIEVER_QUERY_PARAM]: nameFromCollection } : {}),
            cursor: isInitialLoad ? null : nextCursor,
            ...selectedFilters,
          })
        )}&${sorting}`;
        try {
          const signal = loadOffersController.current?.signal;
          const response = await fetch(apiUrl, { signal });
          const responseJson: OffersRetrievalResponse = await response.json();
          console.log(responseJson);
          await parseOffersRetrievalResponse(responseJson, isInitialLoad);
        } catch (e) {
          setActiveOffers([]);
          setIsCollectionWithOffers(false);
          setPriceFloor(undefined);
          setOfferRetrievalResponseCount(0);
          setError(true);
          console.error(`Could not fetch offers for collection: ${collectionName}`);
        }
        setIsLoading(false);
        setIsLoadingOffers(false);
      }
    },
    [filtersFromMetadata, nextCursor, activeOffers, selectedFilters, sorting, isLoadingOffers]
  );

  const parseOffersRetrievalResponse = async (
    response: OffersRetrievalResponse,
    isInitialLoad: boolean
  ) => {
    setNextCursor(response.next_cursor);
    if (isInitialLoad) {
      setPriceFloor(response.price_floor / LAMPORTS_PER_SOL);
      setOfferRetrievalResponseCount(response.count);
      setIsCollectionWithOffers(response.count !== 0);
    }
    if (response?.offers?.length > 0) {
      const accountsDecoded = (
        await Promise.all(
          response?.offers.map(async (offer: any) => {
            if (!!offer && offer.price > 0) {
              return {
                mint: offer.mint,
                price: offer.price / LAMPORTS_PER_SOL,
                escrowPubkeyStr: offer.pk,
                owner: offer.owner,
                uri: offer.uri,
                collectionName: offer.collection,
                contract: offer.contract,
                isVerifeyed: offer.verifeyed,
                metadata: offer.metadata,
                lastPrice: offer.lastPrice,
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
      setIsCollectionWithOffers(!!selectedFilters && Object.keys(selectedFilters).length > 0);
      setPriceFloor(undefined);
    }
  };

  const handleScroll = useCallback(() => {
    if (Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      loadOffers({});
    }
  }, [loadOffers]);

  useEffect(() => {
    const highestSaleEndpoint = `${BASE_URL_HIGHEST_SALE_RETRIEVER}?collection=${collectionName}`;
    async function fetchHighestSale() {
      try {
        const response = await fetch(highestSaleEndpoint);
        const responseJson = await response.json();
        setHighestSale(responseJson.highest_sale);
      } catch (e) {
        setHighestSale(undefined);
        console.error(`Could not fetch highest sale for collection: ${collectionName}`);
      }
    }

    const collectionSalesHistoryEndpoint = `${BASE_URL_COLLECTION_SALES_HISTORY}?${COLLECTION_SALES_HISTORY_PARAM}=${collectionName}&${TYPE_SALES_HISTORY_PARAM}=SALE`;
    async function fetchSalesHistory() {
      try {
        const response = await fetch(collectionSalesHistoryEndpoint);

        const responseJson = await response.json();

        const salesFromHistory = responseJson.sales_history;
        setSalesHistory(salesFromHistory);
      } catch (e) {
        setSalesHistory([]);
        console.log("error", e);
        console.error(`Could not fetch sales history for collection: ${collectionName}`);
      }
    }

    fetchHighestSale();
    fetchSalesHistory();
  }, [collectionName]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useDidMountEffect(() => {
    loadOffers({ isInitialLoad: true });
  }, [selectedFilters]);

  useDidMountEffect(() => {
    if (!isLoading) {
      loadOffers({ isInitialLoad: true });
    }
  }, [sorting]);

  useEffect(() => {
    if (selectedFilters) {
      const encodedFilters = encodeFiltersToUrl(selectedFilters);
      push(`${location.pathname}?${encodedFilters}`);
    }
  }, [selectedFilters]);

  // IIFE to set the localstorage key if not present
  (function () {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_DISPLAY_NSFW_COLLECTIONS)) {
      // add it in localstorage for the first time
      localStorage.setItem(
        LOCAL_STORAGE_KEY_DISPLAY_NSFW_COLLECTIONS,
        LocalStorageValueDisplayNSFW.FALSE
      );
    }
  })();

  const handleClick = (offer: ActiveOffer) => {
    setMonkey(offer);
    setModalCard(true);
  };

  const isAnyFilterSelected = (): boolean =>
    !!selectedFilters &&
    Object.keys(selectedFilters).length > 0 &&
    Object.values(selectedFilters).some((filters) => !!filters);

  const getOffersCount = (): number =>
    !!offerRetrievalResponseCount ? offerRetrievalResponseCount : 0;

  const toggleActiveFilters = () => {
    setShowActiveFilters(!showActiveFilters);
  };

  const resetFilters = () => {
    setSelectedFilters({});
    toggleActiveFilters();
  };

  const refreshCollection = () => {
    loadOffers({ isInitialLoad: true });
  };

  const [showNsfwPopupLocalStorage, setShowNsfwPopupLocalStorage] = useLocalStorageState(
    LOCAL_STORAGE_KEY_DISPLAY_NSFW_COLLECTIONS,
    LocalStorageValueDisplayNSFW.FALSE
  );

  const goHomeNsfw = () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_DISPLAY_NSFW_COLLECTIONS,
      LocalStorageValueDisplayNSFW.FALSE
    );
    setShowNsfwPopupLocalStorage(false);
  };

  const goToCollectionNsfw = () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_DISPLAY_NSFW_COLLECTIONS,
      LocalStorageValueDisplayNSFW.TRUE
    );
    setShowNsfwPopupLocalStorage(true);
  };
  const pageTitle = currentCollection
    ? `${currentCollection?.name} | DigitalEyes`
    : "DigitalEyes Market";

  if (!currentCollection && !isLoadingCollections && !isLoadingOffers) {
    return <NotFoundView />;
  }

  if (error) {
    return <ErrorView />;
  }

  const showSalesHistory = () => {
    setSalesHistoryDrawer(true);
  };

  const hideSalesHistory = () => {
    setSalesHistoryDrawer(false);
  };

  return (
    <Page title={pageTitle}>
      {modalCard && monkey && (
        <NftModalBuyView
          offer={monkey}
          modalCard={modalCard}
          modalCardToggleHandler={modalCardToggleHandler}
          disputedMessage={disputedMessageFromCollection}
        />
      )}

      {isNsfwCollection && !showNsfwPopupLocalStorage && (
        <NsfwPopup goHomeNsfw={goHomeNsfw} goToCollectionNsfw={goToCollectionNsfw} />
      )}

      <div
        className={classNames(
          isNsfwCollection && !showNsfwPopupLocalStorage
            ? "filter blur-xl pointer-events-none select-none"
            : "",
          "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        )}
      >
        <span className="absolute top-0 left-0 p-3 sm:p-5">
          {!isUnverifeyedPage && <VerifeyedBadge />}
        </span>
        <div className="pt-16 sm:pt-12">
          <div className="relative text-center">
            <h1 className="h1">{currentCollection?.name}</h1>
            <div className="flex justify-evenly flex-col w-full text-center">
              {collectionDescription && (
                <p className="text-gray-400 mt-2 capitalize mx-auto w-5/6 text-sm leading-loose">
                  {collectionDescription}
                </p>
              )}
              {disputedMessageFromCollection && (
                <p className="text-orange text-sm font-bold my-2">
                  {disputedMessageFromCollection}
                </p>
              )}
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              <FavouriteButton currentCollectionName={currentCollection?.name} />
              <button onClick={refreshCollection} className="py-2 px-3 bg-gray-600 rounded-md">
                <span className="flex items-center text-xxs">
                  <RefreshIcon className="text-white h-4 w-4 mr-1 focus:outline-none" />
                  <span className="relative text-white">Refresh</span>
                </span>
              </button>
              <button onClick={showSalesHistory} className="py-2 px-3 bg-gray-600 rounded-md">
                <span className="flex items-center text-xxs">
                  <CurrencyDollarIcon className="text-white h-4 w-4 mr-1 focus:outline-none" />
                  <span className="relative text-white">Sales History</span>
                </span>
              </button>
            </div>
          </div>

          <div className="flex-wrap flex justify-center items-center mt-6">
            {currentCollection?.thumbnail && (
              <ThumbnailImage
                thumbnail={currentCollection?.thumbnail}
                name={collectionName}
                className="rounded-md h-16 mx-4 my-3"
              />
            )}
            <div className="flex justify-center">
              <CollectionMeta
                isCollectionWithOffers={isCollectionWithOffers}
                priceFloor={priceFloor}
                highestSale={highestSale}
                totalVolume={totalVolume}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>

        {!isCollectionWithOffers && (
          <div className="max-w-5xl mx-4 mt-20 sm:mx-6 lg:mx-auto shadow-md relative py-10 px-7">
            <IKImage
              urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
              path="/logo/digitaleyes-cant-find.gif"
              alt="digital eyes cant find"
              className="w-auto h-12 absolute -top-5 mx-auto my-0 left-0 right-0"
            />

            <div className="text-center uppercase">
              <h2 className="text-3xl font-extrabold">Nothing to see here right now.</h2>
              <div className="my-6">
                <p className="text-xl font-light">This collection does not have any listings.</p>
                <p className="text-xl font-light">
                  Please select a different collection above or explore the home page.
                </p>
              </div>
              <Link to={ROUTES.HOME} className="btn">
                Explore home page
              </Link>
            </div>
          </div>
        )}

        <CollectionActions
          isCollectionWithOffers={isCollectionWithOffers}
          filtersFromMetadata={filtersFromMetadata}
          toggleActiveFilters={toggleActiveFilters}
          sorting={sorting}
          setSorting={setSorting}
          isLoading={isLoading}
          count={getOffersCount()}
        />

        <div className="flex items-start">
          {!!selectedFilters && (
            <CollectionFilters
              showActiveFilters={showActiveFilters}
              filtersFromMetadata={filtersFromMetadata}
              selectedFilters={selectedFilters}
              addSelectedFilter={addSelectedFilter}
              resetFilters={resetFilters}
              toggleActiveFilters={toggleActiveFilters}
            />
          )}

          <ul
            className={`${
              !!showActiveFilters
                ? "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
            } flex-1 grid gap-4 md:gap-6 lg:gap-8 pb-6`}
          >
            {activeOffers &&
              activeOffers.map((offer, index) => (
                <NftCard
                  key={index}
                  offer={offer}
                  // onClick={(e) => handleClick(offer)}
                />
              ))}
            {!isLoading && getOffersCount() === 0 && isAnyFilterSelected() && (
              <div
                className={`${
                  !!showActiveFilters
                    ? "col-span-2 lg:col-span-3 xl:col-span-5"
                    : "col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5"
                } flex justify-center`}
              >
                <div className="max-w-5xl mx-4 mt-20 sm:mx-6 lg:mx-auto relative py-10 px-7">
                  <IKImage
                    urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
                    path="/logo/digitaleyes-cant-find.gif"
                    alt="digital eyes cant find"
                    className="w-auto h-12 absolute -top-5 mx-auto my-0 left-0 right-0"
                  />
                  <div className="text-center uppercase">
                    <h2 className="text-xl sm:text-3xl font-extrabold">
                      We don't have anything matching these filters right now.
                    </h2>
                    <div className="my-6">
                      <p className="text-xl font-light">
                        Reset the filters to see what we do have for this collection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </ul>
        </div>

        {isLoading && (
          <div className="flex-1 justify-center pt-20">
            <div className="w-48 mx-auto">
              <LoadingWidget />
            </div>
          </div>
        )}
      </div>

      <SalesHistoryList
        salesHistory={salesHistory}
        isModalOpen={salesHistoryDrawer}
        onCloseClick={hideSalesHistory}
      />
    </Page>
  );
};

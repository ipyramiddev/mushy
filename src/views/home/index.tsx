import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingWidget } from "../../components/loadingWidget";
import { NftCard } from "../../components/NftCard";
import { NftMiniCard } from "../../components/NftMiniCard";
import { NftModalBuyView } from "../../components/NftModalBuyView";
import { Page } from "../../components/Page";
import { TopCollections } from "../../components/TopCollections";
import { VerifeyedBadge } from "../../components/VerifeyedBadge";
import { LAMPORTS_PER_SOL } from "../../constants";
import * as ROUTES from "../../constants/routes";
import { BASE_URL_OFFERS_RETRIEVER, OFFERS_RETRIEVER_QUERY_PARAM } from "../../constants/urls";
import { useCollections } from "../../contexts/collections";
import { useConnection, useConnectionConfig } from "../../contexts/connection";
import { ActiveOffer, Collection } from "../../types";
import { classNames, findCollection, getEscrowContract } from "../../utils";
import { IMAGE_KIT_ENDPOINT_URL, isImageInCache } from "../../constants/images";
// @ts-ignore
import { IKImage } from "imagekitio-react";
import { ReactComponent as DiscordLogo } from "../../assets/logo/discord.svg";
import { HomeFeatured } from "./featured";
import { HomeFeaturedComingSoon } from "./featured-soon";
import { TrendingCollections } from "./trending";
import { LatestCollections } from "./latest";

export const HomeView = () => {
  const { collections, isLoading: isCollectionsLoading } = useCollections();
  const [todaysCollection, setTodaysCollection] = useState<Collection>();

  const connection = useConnection();
  const { endpoint } = useConnectionConfig();

  const todaysCollectionName = "ShroomZ";

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      if (!isCollectionsLoading) {
        const todaysCollection = findCollection(collections, todaysCollectionName);
        setTodaysCollection(todaysCollection);
      }
    })();
    return () => {
      controller.abort();
    };
  }, [connection, endpoint, collections]);

  return (
    <Page>
      <div className="z-5 relative">
        <div className="bg-max-w-7xl mx-auto pt-12 px-4 text-center">
          <h1 className="text-white text-4xl font-bold">
            Solana's First Open
            <br /> NFT Marketplace
          </h1>
        </div>

        {todaysCollection && <HomeFeatured collection={todaysCollection} />}

        {/* <HomeFeatured
          collection={{
            name: "Kingdom of Dwarves",
            description:
              "Kingdom of Dwarves is a collection of 4,000 cinematic-quality NFTs made by Emmy and Academy Award-winning artists who worked on projects such as Game of Thrones, Westworld, and Gears of Wars.  Whitelist Tokens for pre-mint are also available on Digital Eyes.",
            website: "https://kingdomofdwarves.io/",
            thumbnail: "",
            isCurated: true,
            disputedMessage: "",
            isNsfw: false,
          }}
        /> */}

        {isCollectionsLoading ? (
          <div className="flex justify-center">
            <div className="w-48">
              <LoadingWidget />
            </div>
          </div>
        ) : (
          <>
            <LatestCollections />
            <TrendingCollections />
            <TopCollections />
          </>
        )}
      </div>
    </Page>
  );
};

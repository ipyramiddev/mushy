// @ts-ignore-next-line
import { IKImage } from "imagekitio-react";
import { Link } from "react-router-dom";
import { IMAGE_KIT_ENDPOINT_OLDURL } from "../../constants/images";
import * as ROUTES from "../../constants/routes";
import { useCollections } from "../../contexts/collections";
import { Collection } from "../../types";
import { classNames } from "../../utils";
import { ThumbnailImage } from "../../components/ThumbnailImage";
import { Carousel } from "../../components//Carousel";
import { UNVERIFEYED_COLLECTION_OPTION } from "../../constants/collections";
import { CollectionCard } from "../../components/CollectionCard";

export const LatestCollections = () => {
  const { collections } = useCollections();
  const collectionsWithEpoch = collections.filter(
    (collection) => !!collection.publishedEpoch && collection.publishedEpoch > 0
  );

  const latestCollections = collectionsWithEpoch
    .sort(
      (collectionA, collectionB) =>
        (collectionB?.publishedEpoch as number) - (collectionA?.publishedEpoch as number)
    )
    .slice(0, 10);

  //   const collectionArray= topCollections.map((collection)=>Object.entries(collection));
  //   console.log(typeof topCollections);

  return latestCollections.length > 0 ? (
    <div className="relative max-w-7xl mx-auto px-8 mb-24">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-10 text-white">
        Latest Collections
      </h2>
      <div className="max-w-7xl sm:mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
        {latestCollections.map((collection: Collection, index: number) => (
          <CollectionCard
            key={index}
            collection={collection}
            verifeyed={collection.name !== UNVERIFEYED_COLLECTION_OPTION.name}
          />
        ))}
      </div>
    </div>
  ) : null;
};

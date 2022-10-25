import { LAMPORTS_PER_SOL } from "@solana/web3.js";
// @ts-ignore
import { useHistory } from "react-router";
import { Collection } from "../../types";
import * as ROUTES from "../../constants/routes";
// @ts-ignore-next-line
import { IKImage } from "imagekitio-react";
import { IMAGE_KIT_ENDPOINT_URL } from "../../constants/images";
import { useEffect, useRef, useState } from "react";
import { BASE_URL_OFFERS_RETRIEVER } from "../../constants/urls";
import { CollectionMetadata } from "../../views/collections";
import { ThumbnailImage } from "../ThumbnailImage";

export interface FavouriteCardProps {
  collection: Collection;
}

export const FavouriteCard: React.FC<FavouriteCardProps> = ({ collection }) => {
  const { push } = useHistory();
  const [priceFloor, setPriceFloor] = useState<undefined | number>(undefined);
  const openCollection = () => {
    push(`${ROUTES.COLLECTIONS}/${collection.name}`);
  };

  let loadOffersController = useRef<AbortController>();
  useEffect(() => {
    const collectionMetadataApiUrl = `${BASE_URL_OFFERS_RETRIEVER}?collection=${collection?.name}`;
    const signal = loadOffersController.current?.signal;
    const fetchRequest = async () => {
      try {
        const collectionMetadata: CollectionMetadata = await (
          await fetch(collectionMetadataApiUrl, { signal })
        ).json();
        await setPriceFloor(collectionMetadata.price_floor / LAMPORTS_PER_SOL);
      } catch (e) {}
    };
    fetchRequest();
  }, [collection.name]);

  return (
    <li
      onClick={() => openCollection()}
      onAuxClick={(e) => {
        e.button==1 &&
        window.open(
            `${window.location.origin}${ROUTES.COLLECTIONS}/${collection.name}`
          )
      }}
      className="col-span-1 flex flex-col shadow-md bg-color-main-primary cursor-pointer overflow-hidden max-w-max mx-auto md:mx-0"
    >
      <div className="flex-initial p-3 relative">
        <div className="flex flex-wrap justify-start">
          <div className="flex-1">
            <p className="text-sm font-bold">{collection.name}</p>
          </div>
          <div className="flex flex-col leading-tight text-right">
            <p className="text-xs uppercase text-gray-500">{`Floor ◎${
              priceFloor && priceFloor
            }`}</p>
          </div>
        </div>
      </div>
      <ThumbnailImage
        className="card-img w-max-none flex-auto object-cover"
        name={collection?.name}
        thumbnail={collection?.thumbnail}
        width="300"
      />
    </li>
  );
};

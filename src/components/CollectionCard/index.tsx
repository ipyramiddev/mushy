import { useHistory } from "react-router-dom";
import { useState } from "react";
import { ReactComponent as CheckShield } from "../../assets/icons/check-shield.svg";
import * as ROUTES from "../../constants/routes";
// @ts-ignore-next-line
import { IKImage } from "imagekitio-react";
import { getImagePath, IMAGE_KIT_ENDPOINT_URL, isImageInCache } from "../../constants/images";
import { Collection } from "../../types";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import { CollectionThumbnail } from "../CollectionThumbnail";

export interface CollectionCardProps {
  collection: Collection;
  verifeyed: boolean;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({ collection, verifeyed }) => {
  const [cacheFailed, setCacheFailed] = useState<boolean>(false);
  const tooltipVerified = useTooltipState();
  const history = useHistory();

  const cacheFallback = (parentNode: any) => {
    setCacheFailed(true);
  };

  const goToCollection = () => {
    history.push(`${ROUTES.COLLECTIONS}/${collection?.name}`);
  };

  return (
    <div
      className="w-full shadow-lg bg-color-main-gray-medium hover:bg-gray-800 cursor-pointer overflow-hidden mx-auto md:mx-0 rounded-lg"
      onClick={goToCollection}
    >
      <CollectionThumbnail
        className="card-img w-max-none flex-auto object-cover"
        name={collection?.name}
        thumbnail={collection?.thumbnail}
        width="300"
      />

      <div className="grid grid-rows-2 grid-flow-col justify-between p-3">
        <div className="row-span-2 col-span-2">
          {collection && (
            <p className="text-white text-xxs sm:text-sm font-semibold text-left">
              {collection.name}
            </p>
          )}
        </div>
        {verifeyed && (
          <>
            <span className="text-gray-400 w-5 h-5 inline-block">
              <CheckShield />
            </span>
          </>
        )}
      </div>
      {/*
        <div className="px-4 pb-2 flex justify-between items-end">
          <p className="text-xxs text-gray-400">{getOfferAmount}
          </p>
        </div>
         */}
    </div>
  );
};

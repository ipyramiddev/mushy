// @ts-ignore-next-line
import { IKImage } from "imagekitio-react";
import { Link } from "react-router-dom";
import { IMAGE_KIT_ENDPOINT_OLDURL } from "../../constants/images";
import * as ROUTES from "../../constants/routes";
import { useCollections } from "../../contexts/collections";
import { Collection } from "../../types";
import { classNames } from "../../utils";
import { ThumbnailImage } from "../ThumbnailImage";
import { Carousel } from "../Carousel";
import { CollectionCard } from "../CollectionCard";
import { UNVERIFEYED_COLLECTION_OPTION } from "../../constants/collections";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/outline";

export const TopCollections = () => {
  const { topCollections } = useCollections();
  const tooltipInfo = useTooltipState();

  return topCollections.length > 0 ? (
    // <div>
    //   <Carousel
    //     cluster={topCollections}
    //     text={"Top Verifeyed Collections"}
    //      tooltipText={"Updated weekly based on Market Cap"}
    //     />
    // </div>
    <div className="relative max-w-7xl mx-auto px-8 mb-24">
      <div className="flex justify-start mb-10">
        <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-semibold">
          Top Verifeyed Collections
        </h2>

        <div className="cursor-pointer">
          <TooltipReference {...tooltipInfo}>
            <span className="text-gray-400 self-end">
              <InformationCircleIcon className="h-5 w-5 m-2 opacity-60" />
            </span>
          </TooltipReference>
          <Tooltip {...tooltipInfo}>
            <div className="bg-black text-xxs md:text-xs p-2 text-white rounded-md">
              <TooltipArrow {...tooltipInfo} />
              Updated weekly based on Market Cap
            </div>
          </Tooltip>
        </div>
      </div>
      <div className="max-w-7xl sm:mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
        {topCollections.map((collection: Collection, index: number) => (
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

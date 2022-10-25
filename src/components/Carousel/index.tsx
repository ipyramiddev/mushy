import React, { useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { CollectionCard } from "../CollectionCard";
import { Collection } from "../../types";
import { ArrowCircleLeftIcon, ArrowCircleRightIcon,InformationCircleIcon } from "@heroicons/react/outline";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference} from "reakit/Tooltip";

interface CarouselProps {
  cluster: any;
  text?: string;
  tooltipText?:string;
}
const responsive = {
  0: { items: 2 },
  568: { items: 3 },
  1024: { items: 5 },
};

export const Carousel: React.FC<CarouselProps> = ({ cluster, text,tooltipText }) => {
  const tooltipInfo = useTooltipState();
  const items = cluster.map((collection: Collection) => (
    <div className="py-6 px-2">
      <CollectionCard collection={collection} verifeyed={true} />
    </div>
  ));

  return (
    <div className="relative max-w-7xl mx-auto px-4 md:px-0">
    <div className="flex justify-start">
      <h2 className="pl-4 text-xl md:text-2xl lg:text-3xl font-semibold">{text}</h2>
      {tooltipText &&
      <div className="cursor-pointer">
      <TooltipReference {...tooltipInfo}>
      <span className="text-white self-end">
      <InformationCircleIcon className="h-5 w-5 m-2"/>
      </span>
      </TooltipReference>
      <Tooltip {...tooltipInfo} style={{ background: "none" }}>
      <div className="bg-black text-xxs md:text-xs p-2 text-white rounded-md">
      <TooltipArrow {...tooltipInfo} />
      {tooltipText}
      </div>
      </Tooltip>
      </div>}
      </div>

        <AliceCarousel
          mouseTracking={true}
          disableDotsControls
          items={items}
          responsive={responsive}
          controlsStrategy="responsive"
          autoPlay={true}
          autoPlayInterval={5000}
          infinite={true}
          keyboardNavigation={true}
          renderPrevButton={() => {
            return (
              <ArrowCircleLeftIcon className="w-8 mx-2 opacity-50 hover:opacity-100 lg:absolute lg:right-12 lg:-top-10 cursor-pointer" />
            );
          }}
          renderNextButton={() => {
            return (
              <ArrowCircleRightIcon className="w-8 mx-4 opacity-50 hover:opacity-100 absolute right-0 bottom-5 lg:absolute lg:right-0 lg:-top-10 cursor-pointer" />
            );
          }}
        />
      </div>
  );
};

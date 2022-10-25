import { HeartIcon as HeartIconSolid, ShieldCheckIcon } from "@heroicons/react/solid";
import {
  HeartIcon as HeartIconOutline,
  ClipboardCopyIcon,
  EyeIcon,
  MusicNoteIcon,
} from "@heroicons/react/outline";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useHistory } from "react-router-dom";
// @ts-ignore
import { IKImage } from "imagekitio-react";
import LazyLoad from 'react-lazyload'; // tslint:disable-line:no-any variable-name
import { useContext, useState } from "react";
import * as ROUTES from "../../constants/routes";
import { getImagePath, IMAGE_KIT_ENDPOINT_URL, isImageInCache } from "../../constants/images";
import { ActiveOffer } from "../../types";
import {
  getTraitValueByKey,
  isSolarian,
  handlerFavorites,
  itemIsFavorite,
  extensionIsAudio,
} from "../../utils";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import QuickViewContext from "../../contexts/quick-view";
import AudioContext, { IAudioContext } from "../../contexts/audio";
import { ShimmeringImage } from "../ShimmeringImage";
import { HTMLContent } from "../NftTypes";

export interface NftCardProps {
  offer: ActiveOffer;
  onClick?: (e: any) => void;
}

export const NftCard: React.FC<NftCardProps> = ({ offer }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(itemIsFavorite(offer));
  const [cacheFailed, setCacheFailed] = useState<boolean>(false);
  const tooltipVerified = useTooltipState();
  const tooltipCopy = useTooltipState();
  const tooltipQuickView = useTooltipState();
  const tooltipAudio = useTooltipState();
  const [copied, setCopied] = useState<boolean>(false);
  const history = useHistory();
  const { open } = useContext(QuickViewContext);
  const audio: IAudioContext = useContext(AudioContext);

  const cacheFallback = (parentNode: any) => {
    setCacheFailed(true);
  };

  const collectionPath = offer?.collectionName ? offer?.collectionName : "unverifeyed";

  const copyLink = () => {
    setCopied(true);
    navigator.clipboard.writeText(
      `${window.location.origin}${ROUTES.ITEM}/${collectionPath}/${offer.mint}?pk=${offer.escrowPubkeyStr}`
    );
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const goToNFT = (e: any) => {
    const collName = offer?.collectionName;
    if (collName?.split("#")[0] == "solo") {
      if (Boolean(e.ctrlKey || e.metaKey || e.button === 1)) {
        window.open(
          `${window.location.origin}${ROUTES.ITEM}/${offer.mint}?pk=${offer.escrowPubkeyStr}`
        );
      } else {
        history.push(`${ROUTES.ITEM}/${offer.mint}?pk=${offer.escrowPubkeyStr}`);
      }
    } else {
      if (Boolean(e.ctrlKey || e.metaKey || e.button === 1)) {
        window.open(
          `${window.location.origin}${ROUTES.ITEM}/${collectionPath}/${offer.mint}?pk=${offer.escrowPubkeyStr}`
        );
      } else {
        history.push(`${ROUTES.ITEM}/${collectionPath}/${offer.mint}?pk=${offer.escrowPubkeyStr}`);
      }
    }
  };

  const category = offer.metadata?.properties?.category;
  const animation_url = offer.metadata?.animation_url;
  const animationUrlExt = animation_url
    ? animation_url.includes("?ext=")
      ? animation_url.split("?ext=").pop()
      : animation_url.split(".").pop()
    : null;

  const canPlayAudioPreview = extensionIsAudio(animationUrlExt);

  return (

      <li
        className="col-span-1 flex flex-col justify-between w-full bg-color-main-gray-medium cursor-pointer overflow-hidden mx-auto md:mx-0 rounded-lg transition-all hover:bg-gray-800"
        onClick={(e) => goToNFT(e)}
      >
        <LazyLoad height={200} offset={100}>
        {offer.metadata?.animation_url && (category === "html" || animationUrlExt === "html") ? (
          <HTMLContent animationUrl={offer.metadata?.animation_url}></HTMLContent>
        ) : (
          <div className="relative aspect-w-16 aspect-h-16">
            {offer.metadata?.image && (
              <ShimmeringImage
                url={offer.metadata.image}
                name={offer.metadata.image}
                width="20px"
                height="auto"
              />
            )}
          </div>
        )}
        <div className="flex-initial relative">
          <div className="flex flex-wrap justify-start p-2.5">
            <div className="flex-1">
              {offer.metadata && (
                <p className="text-white text-sm font-bold text-left">
                  {offer.metadata.name}{" "}
                  {isSolarian(offer?.collectionName) && (
                    <small className="text-xxs block uppercase text-gray-500 font-normal">
                      {getTraitValueByKey("Title", offer?.metadata?.attributes || [])}
                    </small>
                  )}
                </p>
              )}
              <p className="text-xxs text-gray-400">{offer.collectionName}</p>
            </div>
            {offer.isVerifeyed && (
              <div className="group">
                <TooltipReference {...tooltipVerified}>
                  <span className="text-gray-400 w-5 h-5 self-start inline-block">
                    <ShieldCheckIcon className="group-hover:text-solana-teal transition 150 ease-in-out" />
                  </span>
                </TooltipReference>
                <Tooltip {...tooltipVerified} style={{ background: "none" }}>
                  <div className="bg-black text-xs p-2 rounded-md">
                    <TooltipArrow {...tooltipVerified} />
                    Verifeyed
                  </div>
                </Tooltip>
              </div>
            )}
          </div>

              <div className="px-4 pb-2 flex justify-between items-end">
                <p className="font-bold text-xl -ml-1 leading-none">
                  {offer.price ? `◎${offer.price}` : " "}
                </p>
                <p className="text-xs text-gray-400">
                  {offer.lastPrice && offer.lastPrice > 0 && (
                    <span>Last ◎{offer.lastPrice / LAMPORTS_PER_SOL}</span>
                  )}
                </p>
              </div>

          <div className="flex justify-between items-center text-gray-400 bg-color-main-gray-lighter">
            <div className="flex-grow">
              <button
                onClick={(e) => {
                  setIsFavorite(handlerFavorites(e, offer));
                }}
                className="inline-flex justify-end hover:text-white group p-2.5"
              >
                {isFavorite ? (
                  <div className="inline-flex items-center text-xxs">
                    <HeartIconSolid className="text-red-400 h-4 w-4 mr-1 focus:outline-none transition 150 ease-in-out" />
                    <span className="relative top-px text-white transition 150 ease-in-out">
                      Favorite
                    </span>
                  </div>
                ) : (
                  <div className="inline-flex items-center text-xxs transition 50 ease-in-out">
                    <HeartIconOutline className="text-gray-400 h-4 w-4 mr-1 focus:outline-none group-hover:text-red-400 transition 150 ease-in-out" />

                    <span className="relative top-px transition 150 ease-in-out">
                    </span>
                  </div>
                )}
              </button>
            </div>

            <TooltipReference {...tooltipQuickView}>
              <button
                className="hover:text-white p-2.5 group"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  // open quickview
                  open(offer);
                }}
              >
                <span className="text-gray-400 self-start">
                  <EyeIcon className="h-4 w-4 group-hover:text-white transition 150 ease-in-out" />
                </span>
              </button>
            </TooltipReference>
            <Tooltip {...tooltipQuickView} style={{ background: "none" }}>
              <div className="bg-black text-xs p-2 rounded-md">
                <TooltipArrow {...tooltipQuickView} />
                Quick Preview
              </div>
            </Tooltip>

            {canPlayAudioPreview ? (<div>
              <TooltipReference {...tooltipAudio}>
                  <button
                  className="hover:text-white p-2.5 group"
                  onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (canPlayAudioPreview && animation_url) {
                          audio.trigger(animation_url);
                      }
                  }}
                  >
                  <span className="text-gray-400 self-start">
                      <MusicNoteIcon className="h-4 w-4 group-hover:text-white transition 150 ease-in-out" />
                  </span>
                  </button>
              </TooltipReference>
              <Tooltip {...tooltipAudio} style={{ background: "none" }}>
                  <div className="bg-black text-xs p-2 rounded-md">
                  <TooltipArrow {...tooltipAudio} />
                  Play Audio
                  </div>
              </Tooltip></div>) : null
            }

            <TooltipReference {...tooltipCopy}>
              <button
                className="hover:text-white p-2.5 group"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  copyLink();
                }}
              >
                <span className="text-gray-400 self-start">
                  <ClipboardCopyIcon className="h-4 w-4 group-hover:text-white transition 150 ease-in-out" />
                </span>
              </button>
            </TooltipReference>
            <Tooltip {...tooltipCopy} style={{ background: "none" }}>
              <div className="bg-black text-xs p-2 rounded-md">
                <TooltipArrow {...tooltipCopy} />
                {copied ? "Copied :)" : "Copy Link"}
              </div>
            </Tooltip>
          </div>
        </div>
         </LazyLoad>
      </li>
  );
};

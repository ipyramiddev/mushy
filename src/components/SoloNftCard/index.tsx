import { HeartIcon as HeartIconSolid, ShieldCheckIcon } from "@heroicons/react/solid";
import {
  HeartIcon as HeartIconOutline,
  ClipboardCopyIcon,
  EyeIcon,
} from "@heroicons/react/outline";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useHistory } from "react-router-dom";
// @ts-ignore
import { IKImage } from "imagekitio-react";
import { useContext, useState } from "react";
import * as ROUTES from "../../constants/routes";
import { getImagePath, IMAGE_KIT_ENDPOINT_OLDURL, isImageInCache } from "../../constants/images";
import { ActiveOffer } from "../../types";
import { getTraitValueByKey, isSolarian, handlerFavorites, itemIsFavorite } from "../../utils";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import QuickViewContext from "../../contexts/quick-view";
import { shortenAddress } from "../../utils";

export interface SoloNftCardProps {
  offer?: any;
  onClick?: (e: any) => void;
}

export const SoloNftCard: React.FC<SoloNftCardProps> = ({ offer }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(itemIsFavorite(offer));
  const [cacheFailed, setCacheFailed] = useState<boolean>(false);
  const tooltipQuickView = useTooltipState();
  const [copied, setCopied] = useState<boolean>(false);
  const history = useHistory();
  const { open } = useContext(QuickViewContext);

  const cacheFallback = (parentNode: any) => {
    setCacheFailed(true);
  };

  const collectionPath = offer?.collectionName ? offer?.collectionName : "unverifeyed";

  // const copyLink = () => {
  //   setCopied(true);
  //   navigator.clipboard.writeText(
  //     `${window.location.origin}${ROUTES.ITEM}/${collectionPath}/${offer?.mint}?pk=${offer?.escrowPubkeyStr}`
  //   );
  //   setTimeout(() => {
  //     setCopied(false);
  //   }, 2000);
  // };

  const goToNFT = (e: any) => {
    if (Boolean(e.ctrlKey || e.metaKey || e.button === 1)) {
      window.open(
        `${window.location.origin}${ROUTES.ITEM}/${offer.mint}?pk=${offer.escrowPubkeyStr}`
      );
    } else {
      history.push(`${ROUTES.ITEM}/${offer.mint}?pk=${offer.escrowPubkeyStr}`);
    }
  };

  const goToArtist = (e: any) => {
    if (Boolean(e.ctrlKey || e.metaKey || e.button === 1)) {
      window.open(`${window.location.origin}${ROUTES.SOLOPROFILE}/${offer.artistUser}`);
    } else {
      history.push(`${ROUTES.SOLOPROFILE}/${offer.artistUser}`);
    }
  };

const anonDisplay : string | undefined = offer.solo? `Anon${shortenAddress(offer?.collectionName.split("#")[2])}`:undefined;

  return (
    <div>
      <li
        className="grid-cols-2 flex justify-between w-auto cursor-pointer overflow-hidden mx-0 pt-15 transition-all"
        onClick={goToNFT}
      >
        <div className="col-span-2 w-full">
          {offer?.metadata?.image && isImageInCache(offer.metadata.image) && !cacheFailed ? (
            <IKImage
              urlEndpoint={IMAGE_KIT_ENDPOINT_OLDURL}
              path={getImagePath(offer.metadata?.image)}
              transformation={[
                {
                  height: 600,
                  dpr: "auto",
                },
              ]}
              lqip={{ active: true, quality: 5, blur: 20 }}
              alt={offer.metadata?.name}
              height="600"
              onError={cacheFallback}
              className="card-img w-auto mx-auto h-full object-center object-contain"
            />
          ) : (
            <img
              className="card-img w-auto h-full object-center object-contain"
              src={offer?.metadata?.image}
              alt={offer?.metadata?.name}
            />
          )}
        </div>
      </li>
      <div className="col-span-2 py-2 flex justify-between items-center">
        <div className="flex-1">
          {offer?.metadata && (
            <>
              <p className="text-white text-sm text-left inline">{offer?.metadata.name}</p>
              {offer?.artistUser ?
                <li
                  className="text-white text-sm text-left inline cursor-pointer"
                  onClick={goToArtist}
                >
                  {" - "}
                  {offer?.artistUser}
                </li>
              : <div
                className="text-white text-xs text-left inline opacity-60"
              >
                {" - "}
                {anonDisplay}
              </div>
            }
            </>
          )}
        </div>
        <div className="flex justify-between gap-5 items-center">
          <TooltipReference {...tooltipQuickView}>
            <button
              className="hover:text-white p-1 group"
              onClick={() => {
                open(offer);
              }}
            >
              <EyeIcon className="h-4 w-4 group-hover:text-white transition 150 ease-in-out" />
            </button>
          </TooltipReference>
          <Tooltip {...tooltipQuickView} style={{ background: "none" }}>
            <div className="bg-black text-xs p-2 rounded-md">
              <TooltipArrow {...tooltipQuickView} />
              Quick Preview
            </div>
          </Tooltip>
          <p className="text-sm">{offer?.price ? `◎${offer?.price}` : " "}</p>
          {/**<button
              onClick={(e) => {
                setIsFavorite(handlerFavorites(e, offer));
              }}
              className="inline-flex justify-end hover:text-white pl-2"
            >
              {isFavorite ? (
                <p className="inline-flex items-center text-xxs">
                  <HeartIconSolid className="text-red-400 h-5 w-5 mr-1 focus:outline-none" />
                </p>
              ) : (
                <p className="inline-flex items-center text-xxs">
                  <HeartIconOutline className="text-gray-400 h-5 w-5 mr-1 focus:outline-none hover:text-red-400" />
                </p>
              )}
            </button>*/}
        </div>
      </div>
    </div>
  );
};

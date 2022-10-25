import { HeartIcon as HeartIconSolid, ShieldCheckIcon } from "@heroicons/react/solid";
import { HeartIcon as HeartIconOutline, ClipboardCopyIcon } from "@heroicons/react/outline";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useHistory } from "react-router-dom";
// @ts-ignore
import { IKImage } from "imagekitio-react";
import { useState } from "react";
import * as ROUTES from "../../constants/routes";
import { getImagePath, IMAGE_KIT_ENDPOINT_URL, isImageInCache } from "../../constants/images";
import { ActiveOffer, ActiveArtist } from "../../types";
import { getTraitValueByKey, isSolarian, handlerFavorites, itemIsFavorite } from "../../utils";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";

export interface ArtistCardProps {
  artist?: ActiveArtist;
  onClick?: (e: any) => void;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  //const [isFavorite, setIsFavorite] = useState<boolean>(itemIsFavorite(artist));
  const [cacheFailed, setCacheFailed] = useState<boolean>(false);
  const tooltipVerified = useTooltipState();
  const tooltipCopy = useTooltipState();
  const [copied, setCopied] = useState<boolean>(false);
  const history = useHistory();

  const cacheFallback = (parentNode: any) => {
    setCacheFailed(true);
  };

  //const collectionPath = (artist?.collectionName) ? artist?.collectionName : 'unverifeyed';

  {
    /**const copyLink = () => {
    setCopied(true);
    navigator.clipboard.writeText(
      `${window.location.origin}${ROUTES.ITEM}/${collectionPath}/${artist?.mint}?pk=${artist?.escrowPubkeyStr}`
    );
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }
*/
  }
  const goToArtist = () => {
    history.push(`${ROUTES.SOLOPROFILE}/${artist?.username}`);
  };
  //// TODO: dynamic subdomains for all user profiles
  //const artistUrl= `${artist.name}.${window.location.host}`;
  //console.log(artistUrl);

  return (
    <a
      className="flex items-center w-auto cursor-pointer overflow-hidden p-3 transition-all border-2 border-color-main-gray-lighter hover:bg-color-main-gray-medium rounded-lg"
      onClick={goToArtist}
    >
      <div className="flex justify-center object-contain m-5 w-1/5">
        {artist?.image && isImageInCache(artist.image) && !cacheFailed ? (
          <IKImage
            urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
            path={getImagePath(artist?.image)}
            transformation={[
              {
                height: 400,
                dpr: "auto",
              },
            ]}
            lqip={{ active: true, quality: 5, blur: 20 }}
            alt={artist?.username}
            width="600"
            onError={cacheFallback}
            className="card-img object-center object-contain rounded-lg max-w-full"
          />
        ) : (
          <img
            className="card-img object-center object-contain rounded-lg max-w-full"
            src={artist?.image}
            alt={artist?.username}
          />
        )}
      </div>
      <div className="flex-col py-2 w-4/5">
        <div>
          {artist && (
            <p className="text-white text-lg md:text-2xl text-left pb-2">{artist.username}</p>
          )}
        </div>
        <div className="flex justify-between">
          <p className="text-sm md:text-lg opacity-70">
            {artist?.description ? `${artist?.description}` : ""}
          </p>
        </div>
      </div>
      {/**<button
            onClick={(e) => {
              setIsFavorite(handlerFavorites(e, artist));
            }}
            className="flex justify-end flex-wrap content-center hover:text-white pl-2"
          >
            {isFavorite ? (
              <p className="inline-flex items-center text-xxs">
                <HeartIconSolid className="text-red-400 w-5 h-5 md:h-10 md:w-10 mr-1 focus:outline-none" />
              </p>
            ) : (
              <p className="inline-flex items-center text-xxs">
                <HeartIconOutline className="text-gray-400 w-5 h-5 md:h-10 md:w-10 mr-1 focus:outline-none hover:text-red-400" />
              </p>
            )}
          </button>*/}
    </a>
  );
};

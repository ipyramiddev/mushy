// @ts-ignore
import { IKImage } from 'imagekitio-react';
import { ActiveOffer } from "../../types";
import { ReactComponent as CheckShield } from "../../assets/icons/check-shield.svg";

import { getImagePath, IMAGE_KIT_ENDPOINT_URL, isImageInCache, } from '../../constants/images';

export interface NftMiniCardProps {
  offer: ActiveOffer;
  onClick: any;
}

export const NftMiniCard: React.FC<NftMiniCardProps> = ({ offer, onClick }) => {
  return (
    <li
      onClick={onClick}
      className="col-span-1 flex flex-col shadow-lg bg-color-main-primary cursor-pointer overflow-hidden max-w-max mx-auto md:mx-0"
    >
      <div className="flex-initial py-2 px-3 relative bg-color-main-primary">
        <div className="flex flex-wrap justify-start items-center">
          {offer.isVerifeyed && <span className="text-dark-blue w-4 h-4"><CheckShield/></span> }
            <div className="origin-top-right absolute right-2 top-2 text-xs text-light-blue">
                <span className="h-5">{(offer.price) ? `${offer.price} SOL` : ' '}</span>
              </div>
          </div>
        </div>
      {offer.metadata?.image && isImageInCache(offer.metadata.image) ?
        <IKImage
            urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
            path={getImagePath(offer.metadata?.image)}
            transformation={[{ quality: 10 }]}
            alt={offer.metadata?.name}
            width="300"
            className="card-img w-max-none flex-auto object-cover mx-auto"
        />
        : <img className="card-img w-max-none flex-auto object-cover" src={offer.metadata?.image} alt={offer.metadata?.name} />
        }
    </li>
  );
};

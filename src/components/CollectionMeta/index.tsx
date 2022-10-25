import { CollectionMetaProps } from "./interfaces/props";
import { LoadingWidget } from "../../components/loadingWidget";
import { kFormatter } from "../../utils";
import { LAMPORTS_PER_SOL } from "../../constants";

import {
  BASE_URL_HIGHEST_SALE_RETRIEVER,
} from "../../constants/urls";

export const CollectionMeta = ({
  isCollectionWithOffers,
  priceFloor,
  highestSale,
  totalVolume,
  isLoading,
}: CollectionMetaProps) => {

  const wrapperClasses = 'flex flex-col text-md font-bold';
  const labelClasses = 'mx-4 sm:mx-8 text-white text-xs font-light mb-2';
  const valueClasses = 'mx-4 sm:mx-8 block text-2xl font-medium leading-none';

  return (
    <div className="flex justify-center items-stretch">
        {isCollectionWithOffers && (
          <div className={wrapperClasses}>
            <span className={labelClasses}>
              Price floor
            </span>

            {!isLoading && <span className={valueClasses}>◎{priceFloor}</span>}
            {isLoading && (
              <div className="w-8 mx-auto">
                <LoadingWidget />
              </div>
            )}
          </div>
        )}
        
        {isCollectionWithOffers && totalVolume && totalVolume > 0 ? (
          <>
            <span className="h-full bg-white opacity-20 w-px border-color-main-gray-medium"></span>
            <div className={wrapperClasses}>
              <span className={labelClasses}>
                Volume
              </span>
              <span className={valueClasses}>
                ◎{kFormatter(totalVolume as number / LAMPORTS_PER_SOL)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center text-md font-bold mb-4 md:mb-0 col-span-1"></div>
        )}

        { highestSale && highestSale > 0 ? (
          <>
            <span className="h-full bg-white opacity-20 w-px border-color-main-gray-medium"></span>
            <div className={wrapperClasses}>
              <span className={labelClasses}>
                Highest Sale
              </span>
              <span className={valueClasses}>
                ◎{kFormatter(highestSale as number / LAMPORTS_PER_SOL)}
              </span>
            </div>
          </>
        ) : (
          <div className="flex items-center text-md font-bold mb-4 md:mb-0 col-span-1"></div>
        )}
    </div>
  );
};

export default CollectionMeta;

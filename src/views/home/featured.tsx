import { FireIcon } from "@heroicons/react/solid";
import { TicketIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import { Collection } from "../../types";

interface HomeFeaturedProps {
  collection: Collection;
}

export const HomeFeatured: React.FunctionComponent<HomeFeaturedProps> = ({ collection }) => {
  return (
    <div className="my-8">
      <div className="max-w-7xl mx-auto pb-6 px-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-center my-5">
          <div className="mt-10 lg:mt-0 px-4 lg:col-span-6 align-middle md:max-w-2xl md:mx-auto lg:order-2">
            <div className="sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
              <img src="/assets/featured/shroomz-banner.png" />
            </div>
          </div>
          <div className="py-16 xl:py-40 px-4 sm:px-6 md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center lg:order-1">
            <div>
              <p className="flex align-middle">
                <FireIcon width="20" color="orange" className="mr-1" />
                <span className="mt-1 text-gray-200">Featured Collection</span>
              </p>
              <h1 className="mt-4 text-3xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl">
                {collection?.name}
              </h1>

              <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-md lg:text-lg">
                {/* {collection?.description} */}
                ShroomZ is an collection of 2,420 unique shroom NFT's growing on the Solana
                blockchain. 7th collection on SOL and first collection to implement contractual NFT
                staking on SOL. Innovation focused collection disrupting the status quo since day 1.
              </p>

              {/* <div className="flex items-end text-white mt-4">
                <TicketIcon width="20" color="gray" className="mr-1 mb-1" />
                <span className="mt-1 text-gray-500">
                  Public Mint:{" "}
                  <span className="text-xl text-gray-300 font-bold">
                    30th November 2021, 19:30 UTC
                  </span>
                </span>
              </div> */}

              <div className="flex space-x-2 mt-8 gap-2 text-sm text-white  uppercase tracking-wide font-semibold sm:mt-10">
                <Link to={"/collections/" + collection?.name} className="btn">
                  View Collection
                </Link>

                {/* <a href={collection?.website} className="btn" target="_blank">
                  Visit Website
                </a> */}
              </div>
              <div className="mt-5 w-full sm:mx-auto sm:max-w-lg lg:ml-0">
                <div className="flex flex-wrap items-start justify-between"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

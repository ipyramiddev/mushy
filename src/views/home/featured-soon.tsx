import { FireIcon } from "@heroicons/react/solid";
import { TicketIcon } from "@heroicons/react/outline";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";

export const HomeFeaturedComingSoon: React.FunctionComponent = () => {
  const tooltipCopy = useTooltipState();

  return (
    <div>
      <div className="max-w-7xl mx-auto pb-6 px-4">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-center">
          <div className="mt-10 lg:mt-0 px-4 lg:col-span-6 align-middle md:max-w-2xl md:mx-auto lg:order-2">
            <div className="sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
              <img src="/assets/featured/battle-drones-banner.png" />
            </div>
          </div>
          <div className="py-16 xl:py-40 px-4 sm:px-6 md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center lg:order-1">
            <div>
              <p className="flex align-middle text-white">
                <FireIcon width="20" color="orange" className="mr-1" />
                <span className="mt-1 text-gray-800">DigitalEyes Exclusive Collection</span>
              </p>
              <h1 className="mt-4 text-3xl tracking-tight font-extrabold text-black sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl">
                Battle Drones
              </h1>

              <p className="mt-3 text-base text-gray-600 sm:mt-5 sm:text-md lg:text-lg">
                BattleDrones is an investment into the future of gaming. Battle Drones is a NFT
                character collection on Solana, which will be playable in an upcoming 3D PC/Console
                video game with play to earn mechanics.
              </p>

              <p className="flex items-end text-white mt-4">
                <TicketIcon width="20" color="black" className="mr-1 mb-1" />
                <span className="mt-1 text-gray-700">
                  Public Mint:{" "}
                  <span className="text-xl text-gray-700 font-bold">31st oct 8:30PM UTC</span>
                </span>
              </p>

              <div className="flex space-x-2 mt-8 text-sm text-white  uppercase tracking-wide font-semibold sm:mt-10">
                <a href="https://battledronesnft.com/" className="btn" target="_blank">
                  Visit Website
                </a>

                <TooltipReference {...tooltipCopy}>
                  <button className="btn btn-gray disabled">View Collection</button>
                </TooltipReference>
                <Tooltip {...tooltipCopy} style={{ background: "none" }}>
                  <div className="bg-black text-xs p-2 rounded-md">
                    <TooltipArrow {...tooltipCopy} />
                    Coming Soon, after public mint
                  </div>
                </Tooltip>
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

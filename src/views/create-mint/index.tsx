import { Page } from "../../components/Page";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as anchor from "@project-serum/anchor";
import MintButton from "../mint-button";
import { LockOpenIcon, CurrencyDollarIcon, TicketIcon } from "@heroicons/react/solid";

export const CreateMintView = () => {
  const treasury = new anchor.web3.PublicKey(process.env.REACT_APP_TREASURY_ADDRESS!);

  const config = new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_CONFIG!);

  const candyMachineId = new anchor.web3.PublicKey(process.env.REACT_APP_CANDY_MACHINE_ID!);

  const rpcHost = process.env.REACT_APP_SOLANA_RPC_HOST!;
  const connection = new anchor.web3.Connection(rpcHost);

  const startDateSeed = parseInt(process.env.REACT_APP_CANDY_START_DATE!, 10);

  const txTimeout = 30000;
  const soldierImgs = ["army-card-1.png", "army-card-2.png", "army-card-3.png"];
  let settings = {
    dots: false,
    className: "army-img",
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    centerMode: true,
    fade: true,
  };
  return (
    <Page>
      {/* <div className="z-5 relative">
        <div className="bg-max-w-7xl mx-auto pt-12 px-4 text-center">
          <h1 className="text-white text-4xl font-bold">
            Solana's First Open
            <br /> NFT Marketplace
          </h1>
        </div>
        <LaunchCollection collection={LaunchCollection} />
      </div> */}
      <div className="bg-max-w-7xl mx-auto pt-12 px-4 text-center">
        <h1 className="text-white text-4xl font-bold">
          Digital Eyes Presents Pengos
          {/* <br /> <br /> */}
        </h1>
      </div>
      <div className="my-8">
        <div className="max-w-7xl mx-auto pb-6 px-4">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6 items-center my-5">
            <div className="mt-10 lg:mt-0 px-4 lg:col-span-6 align-middle md:max-w-2xl md:mx-auto lg:order-2">
              <div className="sm:w-full sm:mx-auto sm:rounded-lg sm:overflow-hidden">
                <img src="/assets/launchpad/pengos-banner.jpeg" />
              </div>
            </div>
            <div className="py-16 xl:py-40 px-4 sm:px-6 md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center lg:order-1">
              <div>
                <p className="flex align-middle">
                  <LockOpenIcon width="20" color="white" className="mr-1" />
                  <span className="mt-1 text-gray-200">Featured Launch</span>
                </p>
                <h1 className="mt-4 text-3xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl">
                  Pengos
                </h1>
                <div className="flex items-center mt-4">
                  <div className="pr-2 text-xs">
                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-md lg:text-lg">
                      SUPPLY
                    </p>
                    <TicketIcon width="20" color="white" className="ml-4" />
                    <p className="text-base text-white-300 sm:mt-5 sm:text-md lg:text-lg">6969</p>
                  </div>
                  <div className="px-2 text-xs">
                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-md lg:text-lg">
                      PRICE
                    </p>
                    <CurrencyDollarIcon width="20" color="white" className="ml-3" />
                    <p className="text-base text-white-300 sm:mt-5 sm:text-md lg:text-lg">
                      0.25 SOL
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-md lg:text-lg">
                  Pengos is a fully community driven NFT project made up of 6969 Pengos; there are
                  so many variations that scientists still haven't discovered them all. Join our
                  colony, discover your unique Pengo and decide the fate of our colony!
                </p>

                <div className="flex space-x-2 mt-8 gap-2 text-sm text-white  uppercase tracking-wide font-semibold sm:mt-10">
                  <MintButton
                    candyMachineId={candyMachineId}
                    config={config}
                    connection={connection}
                    startDate={startDateSeed}
                    treasury={treasury}
                    txTimeout={txTimeout}
                  />
                </div>
                <div className="mt-5 w-full sm:mx-auto sm:max-w-lg lg:ml-0">
                  <div className="flex flex-wrap items-start justify-between"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

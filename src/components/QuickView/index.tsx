import { useContext, useEffect, useRef } from "react";
import { XIcon, ShieldCheckIcon } from "@heroicons/react/solid";
import { ShimmeringImage } from "../ShimmeringImage";
import { ActiveOffer } from "../../types";
import * as ROUTES from "../../constants/routes";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import QuickViewContext from "../../contexts/quick-view";
import { useHistory } from "react-router";
import { buyOfferTx, sellTx } from "../../contracts/escrow";
import { useUserAccounts } from "../../hooks";
import { ReactComponent as BtnSpinner } from "../../assets/icons/btn-spinner.svg";
import { useWallet } from "../../contexts/wallet";
import { useConnection, useConnectionConfig } from "../../contexts/connection";
import { classNames, getEscrowContract, getEscrowFromCollectionName } from "../../utils";
import { DigitalEyesAnimatedIcon } from "../DigitalEyesAnimatedIcon";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";

import "./styles.css";

interface QuickViewProps {
  nftData: ActiveOffer;
}

export const QuickView: React.FC<QuickViewProps> = ({ nftData }) => {
  const { close } = useContext(QuickViewContext);
  const history = useHistory();
  const modalRef = useRef<HTMLDivElement>(null);

  const collectionPath = nftData?.collectionName ? nftData?.collectionName : "unverifeyed";

  const goToNFT = () => {
    window.open(`${ROUTES.ITEM}/${collectionPath}/${nftData.mint}?pk=${nftData.escrowPubkeyStr}`);
  };

  const closeModal = () => {
    const modal = modalRef.current;
    const animationDuration: number = 125;

    // animates the center modal out
    modal?.animate(
      [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0 },
      ],
      {
        duration: animationDuration,
        fill: "forwards",
        easing: "ease-in",
      }
    );

    // animates the modal container out
    modal?.parentElement?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: animationDuration,
      fill: "forwards",
      easing: "ease-in",
    });

    setTimeout(close, animationDuration);
  };

  const shortcutsListener = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  const ifOutsideModalExitQuickView = (event: MouseEvent) => {
    if (event.target === modalRef?.current?.parentElement) {
      closeModal();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", shortcutsListener);
    window.addEventListener("click", ifOutsideModalExitQuickView);

    return () => {
      window.removeEventListener("keydown", shortcutsListener);
      window.removeEventListener("click", ifOutsideModalExitQuickView);
    };
  }, []);

  return (
    <div className="quickview-modal-container fixed top-0 left-0 w-full h-full bg-modal-black flex items-center justify-center z-50 cursor-default">
      <div
        className="quickview-modal flex flex-col bg-modal-main-bg p-4 rounded-md w-full lg:max-w-3xl h-max max-width-80 max-height-80"
        ref={modalRef}
      >
        <header className="flex items-center justify-between gap-10">
          <div className="flex flex-col items-baseline justify-between">
            {/* TODO: Digital eyes animated eyes icon */}
            {/* <DigitalEyesAnimatedIcon
              color="rgba(255, 255, 255, 0.1)"
              background="#2f2f2f"
              className="w-8 h-auto"
            /> */}
            <p className="text-gray-500 text-xs">Quick view</p>
            <h1 className="text-white font-bold whitespace-nowrap">{nftData?.metadata?.name}</h1>
          </div>
          <button
            onClick={closeModal}
            className="group flex items-center justify-center cursor-pointer pointer-events-auto origin-center"
          >
            <kbd className="text-sm text-white mr-2 hidden md:flex">ESC</kbd>
            <XIcon className="w-7 h-7 transition duration-125 ease-in-out rounded-sm group-hover:bg-gray-600" />
          </button>
        </header>
        <main className="quickview-main overflow-auto md:grid md:grid-cols-2 my-8 md:gap-6">
          <section className="w-full flex flex-col position-sticky">
            {nftData?.metadata?.image && (
              <ShimmeringImage
                url={nftData.metadata.image}
                name={nftData.metadata.image}
                width="20px"
                height="auto"
                classString="w-full flex items-center mx-auto"
              />
            )}
            <div className="flex flex-row justify-between my-5">
              <div className="flex flex-col justify-between">
                <p className="font-bold text-4xl leading-none">
                  {nftData.price ? `◎${nftData.price}` : " "}
                </p>
                <p className="text-xs text-gray-400 pt-1">
                  {nftData.lastPrice && nftData.lastPrice > 0 && (
                    <span>Last ◎{nftData.lastPrice / LAMPORTS_PER_SOL}</span>
                  )}
                </p>
              </div>
              {nftData.isVerifeyed && (
                <span className="text-gray-400 w-6 h-6 self-start inline-block">
                  <ShieldCheckIcon />
                </span>
              )}
            </div>
          </section>
          <section className="quickview-attributes w-full">
            {nftData.metadata?.attributes?.map((attr, index) => (
              <div
                key={index}
                className="quickview-attribute-container w-full flex flex-row justify-between bg-modal-traits-bg rounded-md p-3 md:gap-10"
              >
                <span className="font-normal text-gray-400 whitespace-nowrap text-sm">
                  {attr.trait_type}
                </span>
                <span className="font-semibold text-white whitespace-nowrap text-right w-full text-sm truncate ...">
                  {attr.value}
                </span>
              </div>
            ))}
          </section>
        </main>
        <footer className="flex flex-wrap">
          <button
            className="flex-grow btn bg-blue-700 hover:bg-blue-800 transition ease-in-out"
            onClick={goToNFT}
          >
            View Item Details
          </button>
          {/* TODO: Add buy button */}
        </footer>
      </div>
    </div>
  );
};

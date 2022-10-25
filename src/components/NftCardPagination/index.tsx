import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { NftCard } from "../NftCard";
import { ActiveOffer } from "../../types";
import { NftModalListingView } from "../NftModalListingView";

export const NftCardPagination = (props: {
  activeOffers: ActiveOffer[];
  pageLimit: number;
  dataLimit: number;
  refreshWalletItems: () => void;
}) => {
  const [pages] = useState(Math.ceil(props.activeOffers.length / props.dataLimit));
  const [currentPage, setCurrentPage] = useState(1);
  const [offer, setOffer] = useState<ActiveOffer>();
  const [modalCard, setModalCard] = useState(true);
  function goToNextPage(event: React.MouseEvent<HTMLElement>): void {
    setCurrentPage((page) => page + 1);
  }

  function goToPreviousPage(event: React.MouseEvent<HTMLElement>): void {
    setCurrentPage((page) => page - 1);
  }

  const getPaginatedData = () => {
    const startIndex = currentPage * props.dataLimit - props.dataLimit;
    const endIndex =
      props.activeOffers.length < props.dataLimit
        ? props.activeOffers.length
        : startIndex + props.dataLimit;
    return props.activeOffers.slice(startIndex, endIndex);
  };

  const handleClick = (offer: ActiveOffer) => () => {
    setOffer(offer);
    setModalCard(true);
  };

  const modalCardToggleHandler = () => {
    if (modalCard) {
      setModalCard(false);
    } else {
      setModalCard(true);
    }
  };

  const listingCardSuccessHandler = () => {
    props.refreshWalletItems();
    setModalCard(false);
  };

  return (
    <>
      {modalCard && offer && (
        <NftModalListingView
          offer={offer}
          modalCard={modalCard}
          modalCardToggleHandler={modalCardToggleHandler}
          modalCardSuccessHandler={listingCardSuccessHandler}
        />
      )}
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 pb-10">
        {getPaginatedData().map((offer, idx) => (
          <NftCard 
            key={idx} 
            offer={offer} 
            // onClick={handleClick(offer)} 
          />
        ))}
      </ul>

      {props.activeOffers.length > props.dataLimit ? (
        <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0 mb-20">
          <div className="-mt-px w-0 flex-1 flex">
            <button
              disabled={currentPage === 1}
              onClick={(e) => goToPreviousPage(e)}
              className={` ${
                currentPage === 1 ? "disabled:opacity-50" : ""
              } border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300`}
            >
              <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
              Previous
            </button>
          </div>
          <div className="hidden md:-mt-px md:flex"></div>
          <div className="-mt-px w-0 flex-1 flex justify-end">
            <button
              disabled={currentPage === pages}
              onClick={(e) => goToNextPage(e)}
              className={`${
                currentPage === pages ? "disabled:opacity-50" : ""
              } border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300`}
            >
              Next
              <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
            </button>
          </div>
        </nav>
      ) : (
        ""
      )}
    </>
  );
};

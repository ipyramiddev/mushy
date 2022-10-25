import { XCircleIcon } from "@heroicons/react/outline";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Button, Divider } from "antd";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import { shortenAddress } from "../../candy-machine";
import { SOL_SCAN_BASE_URL } from "../../constants/urls";
import { useConnection } from "../../contexts";
import { SaleData } from "../../types";
import { kFormatter, toPublicKey } from "../../utils";
import { getDomainList } from "../../utils/getDomainList";
import { getUserDomains } from "../../utils/name-service";

interface SalesHistoryProps {
  isModalOpen: boolean;
  salesHistory: SaleData[];
  onCloseClick: () => void;
}

export const SalesHistoryList = ({
  isModalOpen,
  salesHistory,
  onCloseClick,
}: SalesHistoryProps) => {
  const [listLength, setListLength] = useState(8);
  const connection = useConnection();

  // useEffect(() => {
  //   (async () => {
  //     salesHistory?.map(async (sale, idx) => {
  //       if (idx + 1 <= listLength) {
  //         try {
  //           salesHistory[idx].buyerDomain = getDomainList(
  //             await getUserDomains(connection, toPublicKey(sale?.buyer))
  //           );

  //           salesHistory[idx].sellerDomain = getDomainList(
  //             await getUserDomains(connection, toPublicKey(sale?.seller))
  //           );
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       }
  //     });
  //   })();
  // }, [connection, salesHistory, listLength]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const loadMoreItems = () => {
    const newListLength = listLength + 8;
    setListLength(newListLength);
  };

  const handleScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      loadMoreItems();
    }
  };

  const closeAndReset = () => {
    onCloseClick();
    setListLength(8);
  };

  return isModalOpen ? (
    <>
      <div
        onClick={closeAndReset}
        className="fixed w-full h-full bg-gray-900 opacity-70 left-0 top-0 z-50 cursor-pointer"
      />
      <div className="fixed w-full max-w-4xl transform rounded-md shadow -translate-x-1/2 -translate-y-1/2 h-3/4 max-h-full top-1/2 left-1/2 z-50 flex-grow overflow-hidden">
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="grid grid-cols-2 px-4 py-5">
            <p className="justify-self-start">Sales History</p>{" "}
            <button onClick={closeAndReset} className="justify-self-end">
              <span className="flex items-center text-xxs">
                <XCircleIcon className="text-white h-6 w-6 mr-1 focus:outline-none" />
              </span>
            </button>
          </div>
          <Divider />
        </div>
        <div
          onScroll={handleScroll}
          className="flex flex-col h-full p-5 bg-gray-800 pb-16 overflow-y-auto"
        >
          <div className="grid grid-cols-6 items-center text-xs text-gray-500 uppercase gap-6 pb-5">
            <span>Time</span>
            <span className="col-span-2">Item</span>
            <span>Price</span>
            <span>Seller</span>
            <span>Buyer</span>
          </div>
          {!salesHistory.length && (
            <div className="p-8 text-gray-200 flex justify-center items-center">
              Could not fetch sales history
            </div>
          )}
          {salesHistory.map((sale, idx) => {
            const classes = `text-xs truncate ... `;
            return (
              idx + 1 <= listLength && (
                <div
                  key={`${sale.seller}${idx}`}
                  className="grid grid-cols-6 items-center my-2 gap-6 text-xss"
                >
                  <span className={`${classes} text-gray-500 col-span-1`}>
                    {dayjs(sale.epoch * 1000).fromNow()}
                  </span>
                  <div className="flex justify-start items-center p-0 m-0 col-span-2">
                    <img
                      className={`${classes} pr-3 object-contain max-w-full h-16 w-16`}
                      src={sale.tags.image}
                      alt="sale"
                    />
                    <p className={`text-sm text-gray-200 col-span-1`}>{sale.tags.name}</p>
                  </div>
                  <span className={`${classes} text-sm text-gray-200 col-span-1`}>
                    ◎{kFormatter((sale.price as number) / LAMPORTS_PER_SOL)}
                  </span>
                  <a
                    className={`${classes} text-gray-500 col-span-1 hover:text-blue`}
                    href={`${SOL_SCAN_BASE_URL}${sale.seller}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {sale?.sellerDomain ? sale.sellerDomain : shortenAddress(sale.seller)}
                  </a>
                  <a
                    className={`${classes} text-gray-500 col-span-1 hover:text-blue`}
                    href={`${SOL_SCAN_BASE_URL}${sale.buyer}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {sale?.buyerDomain ? sale.buyerDomain : shortenAddress(sale.buyer)}
                  </a>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  ) : null;
};

import { useConnectionConfig } from "../../contexts/connection";
import {
  getEndPointName,
  shortenAddress
} from "../../utils";
import { NftModal } from "../NftModal";
import { NftModalViewProps } from "./interfaces/props";

export const NftModalUnlistView = ({
  offer,
  modalCard,
  modalCardToggleHandler,
  modalCardSuccessHandler,
  disputedMessage,
}: NftModalViewProps) => {
  const { endpoint } = useConnectionConfig();

  return (
    <NftModal
      nftData={offer}
      modalCard={modalCard}
      modalCardToggleHandler={modalCardToggleHandler}
      dialogTitle={`Unlist ${offer.metadata?.name}`}
      modalCardSuccessHandler={modalCardSuccessHandler}
      disputedMessage={disputedMessage}
    >
      <div className="flex justify-center items-center space-x-2 uppercase font-light sm:text-xl">
        <span className={"font-medium"}>Price</span>{" "}
        <span>{offer.price} SOL</span>
      </div>

      <div className="flex flex-col space-y-2 w-1/2 py-4 mx-auto">
        <h3 className="text-white text-sm pb-1">Details</h3>
        <div className="text-sm flex justify-between">
          <h4 className="text-white">Token Address</h4>

          <a
            target="_blank"
            rel="noreferrer"
            href={`https://explorer.solana.com/address/${offer.mint}${
              getEndPointName(endpoint) === "devnet" ? "?cluster=devnet" : ""
            }`}
            className="text-blue-400 "
          >
            {shortenAddress(offer.mint)}
          </a>
        </div>
      </div>
    </NftModal>
  );
};

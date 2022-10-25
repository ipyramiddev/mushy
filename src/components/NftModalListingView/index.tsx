import { NftModal } from "../NftModal";
import { NftModalViewProps } from "./interfaces/props";

export const NftModalListingView = ({
  offer,
  modalCard,
  modalCardToggleHandler,
  modalCardSuccessHandler,
}: NftModalViewProps) => {

  return (
    <NftModal
      nftData={offer}
      modalCard={modalCard}
      modalCardToggleHandler={modalCardToggleHandler}
      modalCardSuccessHandler={modalCardSuccessHandler}
      dialogTitle={`List your nft`}
      disputedMessage={""}
    >
    </NftModal>
  );
};

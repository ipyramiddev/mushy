import { NftModalViewProps } from "./interfaces/props";
import { NftModal } from '../NftModal';

export const NftModalBuyView = ({
  offer,
  modalCard,
  modalCardToggleHandler,
  disputedMessage
}: NftModalViewProps) => {

  const buyModalCardSuccessHandler = () => {
    // TODO: refresh user accounts contexts
  };

  return (
    <NftModal
      nftData={offer}
      modalCard={modalCard}
      modalCardToggleHandler={modalCardToggleHandler}
      modalCardSuccessHandler={buyModalCardSuccessHandler}
      buttonText={`Buy for ${offer.price} SOL`}
      dialogTitle={"Buy some art"}
      cancelText={"Close"}
      disputedMessage={disputedMessage}
    />
  );
};

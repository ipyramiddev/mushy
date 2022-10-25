import { Dialog } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import { ActiveOffer } from "../../types";
import { NftDetails } from "../NftDetails";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

interface NftModalProps {
  buttonText?: string;
  modalCard: boolean;
  modalCardToggleHandler: () => void;
  modalCardSuccessHandler?: () => void;
  dialogTitle: string;
  nftData: ActiveOffer;
  cancelText?: string;
  disputedMessage?: string;
}

export const NftModal: React.FC<NftModalProps> = ({
  buttonText,
  modalCard,
  modalCardToggleHandler,
  modalCardSuccessHandler,
  dialogTitle,
  nftData,
  children,
  cancelText,
  disputedMessage
}) => {
  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Dialog
        as="div"
        static
        className="fixed z-100 inset-0 overflow-y-auto"
        open={modalCard}
        onClose={modalCardToggleHandler}
      >
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <NftDetails
          nftData={nftData}
          cancelAction={modalCardToggleHandler}
          buttonText={buttonText}
          dialogTitle={dialogTitle}
          cancelText={cancelText}
          successAction={modalCardSuccessHandler}
          disputedMessage={disputedMessage}
          refreshItem={() => {}}
        >
          <CloseIcon className="md:hidden cursor-pointer absolute -top-1 right-1 w-6 h-6" onClick={modalCardToggleHandler}/>
          {children}
        </NftDetails>
      </Dialog>
    </>
  );
};

import { useHistory } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import * as ROUTES from "../../constants/routes";
import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import { encodeFiltersToUrl } from "../../utils";
import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { useWallet } from "../../contexts/wallet";
import { STRING_API_URL, VERIFY_SIGNATURE } from "../../constants/urls";
import { LoadingWidget } from "../../components/loadingWidget";
import { sign } from "tweetnacl";
import bs58 from "bs58";
import { toast, ToastContainer } from "react-toastify";
//@ts-ignore
import { IKImage } from "imagekitio-react";
import { IMAGE_KIT_ENDPOINT_OLDURL } from "../../constants/images";

export interface SoloWalletSignerProps {
  data?: any;
  mint?: string;
  collection?: string;
  path: any;
}

export const SoloWalletSigner: React.FC<SoloWalletSignerProps> = ({
  data,
  mint,
  collection,
  path,
}) => {
  const { wallet } = useWallet();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    //const soloAuth = localStorage.getItem("soloAuth")
  }, [wallet?.publicKey]);

  const authenticateAccount = async () => {
    if (wallet?.publicKey) {
      setIsLoading(true);
      const stringPublicKey = wallet.publicKey.toString();
      try {
        const randomString = await fetch(STRING_API_URL, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify({ wallet_key: stringPublicKey }),
        }).then((res) => res.json());

        const signMessage = await wallet.signMessage(
          new TextEncoder().encode(randomString?.random_string)
        );

        const signature = {
          signature: bs58.encode(signMessage),
          wallet_key: wallet?.publicKey.toString(),
        };
        console.log(signature);

        const JWT = await fetch(VERIFY_SIGNATURE, {
          method: "POST",
          headers: {
            "content-Type": "application/json",
          },
          body: JSON.stringify(signature),
        }).then((res) => res.json());

        localStorage.setItem(`soloAuth${stringPublicKey}`, JSON.stringify(JWT));
        toast.info("authentication complete", {
          position: "top-right",
          autoClose: 5000,
        });
        setSuccess(true);
      } catch (e) {
        setError(true);
        setErrorMessage(e.message);
        console.log(e);
      }

      setIsLoading(false);
    }
  };

  const goToPath = () => {
    history.push(path);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {error && (
        <div className="flex-1 justify-center pt-20">
          <div className="w-48 mx-auto">
            <div className="text-3xl text-center my-4 text-red-500">an error occured </div>
            <div className="text-md text-center my-2">{errorMessage} </div>
            <div className="flex justify-center my-4">
              <button
                className="btn"
                onClick={() => {
                  setError(false);
                  setErrorMessage("");
                }}
              >
                retry
              </button>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="flex-1 justify-center pt-20">
          <div className="w-48 mx-auto">
            <div className="text-3xl text-center my-4">success! </div>
            <div className="text-xs text-center my-2">you're all set. </div>
            <div className="flex justify-center my-10">
              <button className="btn" onClick={goToPath}>
                continue
              </button>
            </div>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="flex-1 justify-center pt-20">
          <div className="w-48 mx-auto">
            <LoadingWidget />
          </div>
        </div>
      )}
      {!isLoading && !success && !error && wallet?.publicKey && (
        <div>
          <div className="text-3xl text-center my-10 ">
            authenticate your wallet with DigitalEyes{" "}
          </div>
          <div className="text-md text-center my-2">
            to continue you must authenticate your wallet for use with Digitaleyes #solo{" "}
          </div>
          <div className="text-xs text-center my-2">
            don't worry! this is free & we do not store or share any of your personal information.{" "}
          </div>
          <div className="text-xs text-center my-2">
            this authentication is what helps us ensure your ownership of your valued creations!{" "}
          </div>
          <div className="flex justify-center my-10">
            <button className="btn" onClick={authenticateAccount}>
              authenticate
            </button>
          </div>
        </div>
      )}
      {!wallet?.publicKey && (
        <div className="max-w-5xl mx-4 mt-20 sm:mx-6 lg:mx-auto relative py-10 px-7">
          <IKImage
            urlEndpoint={IMAGE_KIT_ENDPOINT_OLDURL}
            path="/logo/digitaleyes-cant-find.gif"
            alt="digital eyes cant find"
            className="w-auto h-12 absolute -top-5 mx-auto my-0 left-0 right-0"
          />
          <div className="text-center lowercase">
            <h2 className="text-xl sm:text-3xl font-extrabold">
              please connect your wallet to proceed.
            </h2>
            <div className="my-6">
              <p className="text-xl font-light lowercase">
                if you're a little lost for wallets, have a look at this{" "}
                <a
                  className="text-blue-500 underline"
                  href={"https://docs.solana.com/wallet-guide"}
                  target="_blank"
                >
                  guide
                </a>
              </p>
              <p className="text-md font-light lowercase">
                we recommend{" "}
                <a
                  className="text-blue-500 underline"
                  href={"https://phantom.app/"}
                  target="_blank"
                >
                  {" "}
                  phantom wallet
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

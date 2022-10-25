// import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import { PublicKey, TokenAccountsFilter } from "@solana/web3.js";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import {
  HeartIcon as HeartIconOutline,
  ClipboardCopyIcon,
  ExclamationCircleIcon,
  MusicNoteIcon,
  RefreshIcon,
} from "@heroicons/react/outline";
import { ReactComponent as VerifiedCircle } from "../../assets/icons/user-verified.svg";
// @ts-ignore
import { IKImage } from "imagekitio-react";
import { HTMLContent } from "../NftTypes";
import { useEffect, useState, useContext } from "react";
import { useInputState } from "../../hooks/useInputState";
import { useAccountByMint } from "../../hooks/useAccountByMint";
import { NftRoyaltyCalculator } from "../NftRoyaltyCalculator";
import { getImagePath, IMAGE_KIT_ENDPOINT_URL, isImageInCache } from "../../constants/images";
import * as ROUTES from "../../constants/routes";
import { useWallet } from "../../contexts/wallet";
import { ActiveOffer, Metadata } from "../../types";
import BottomBanner from "../BottomBanner";
import { ConnectButton } from "../ConnectButton";
import { NotificationModal } from "../NotificationModal";
import { VerifeyedBadge } from "../VerifeyedBadge";
import "@google/model-viewer";
// @ts-ignore
import { useUserAccounts } from "../../hooks";
import { buyOfferTx, sellTx, cancelSellTx, lowerPrice } from "../../contracts/direct-sell";
import { buyOfferTx as buyOfferTxEscrow } from "../../contracts/escrow";
import { useConnection, useConnectionConfig } from "../../contexts/connection";
import {
  getEscrowContract,
  getEscrowFromCollectionName,
  programIds,
  toPublicKey,
} from "../../utils";
import { Divider } from "../Divider";
import { BASE_URL_SALES_HISTORY_RETRIEVER, SOL_SCAN_BASE_URL } from "../../constants/urls";
import AudioContext, { IAudioContext } from "../../contexts/audio";
import { shortenAddress } from "../../utils";
import { handlerFavorites, itemIsFavorite } from "../../utils";
import { Attributes } from "../Attributes";
import { NFTDetailsAccordion } from "../NFTdetailsAccordion";
import { useHistory, useParams } from "react-router-dom";

import { useTooltipState, Tooltip, TooltipArrow, TooltipReference } from "reakit/Tooltip";
import { useTabState, Tab, TabList, TabPanel } from "reakit/Tab";
import {
  DIRECT_SELL_CONTRACT_ID,
  DIRECT_SELL_TAX_ID,
  DIRECT_SELL_TAX_AMOUNT,
} from "../../constants/contract_id";
import { DomainNames, getUserDomains } from "../../utils/name-service";
import { getDomainList } from "../../utils/getDomainList";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface ModelViewerJSX {
  src: string;
  poster?: string;
  minimumRenderScale?: number;
}
interface SaleHistoryTransaction {
  metadata: {
    price: string;
    signature: string;
    type: string;
  };
  timestamp: number;
  participants: any;
}

interface NftDetailsProps {
  cancelAction: () => void;
  successAction?: () => void;
  nftData: ActiveOffer;
  buttonText?: string;
  // buttonLoading?: boolean;
  cancelText?: string;
  dialogTitle: string;
  isListed?: boolean;
  disputedMessage?: string;
  collection?: string;
  refreshItem: () => void;
  statusOnchain?: string;
}

export const NftDetails: React.FC<NftDetailsProps> = ({
  nftData,
  cancelAction,
  successAction,
  cancelText,
  buttonText,
  dialogTitle,
  children,
  isListed,
  disputedMessage,
  collection,
  refreshItem,
  statusOnchain,
}) => {
  const { wallet } = useWallet();
  const connection = useConnection();
  const { endpoint } = useConnectionConfig();
  const [displayCopyBanner, setDisplayCopyBanner] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isNoticeLoading, setIsNoticeLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [listingPrice, handleListingPriceChange] = useInputState(0);
  const {
    listedMintsFromEscrow,
    setListedMintsFromEscrow,
    mintsInWalletUnlisted,
    setMintsInWalletUnlisted,
    listedMintsFromDirectSell,
    setListedMintsFromDirectSell,
  } = useUserAccounts();
  const { isVerifeyed, metadata, mint, escrowPubkeyStr, price } = nftData;
  const audio: IAudioContext = useContext(AudioContext);
  const history = useHistory();

  let collectionMeta;
  try {
    collectionMeta = !!nftData.collection && JSON.parse(nftData.collection);
  } catch (e) {
    collectionMeta = "";
  }

  const collectionName = nftData.collectionName
    ? nftData.collectionName
    : !!collectionMeta
    ? collectionMeta.name
    : "unverifeyed";
  const collectionDesc =
    metadata && metadata.description != ""
      ? metadata.description
      : collectionMeta
      ? collectionMeta.description
      : "";
  const contract = getEscrowFromCollectionName(endpoint, collectionName);
  const escrow = getEscrowContract(endpoint, contract?.escrowProgram);
  const { name, image, ...rest } = { ...metadata };
  const [domainNames, setDomainNames] = useState<(DomainNames | undefined)[]>();
  const [salesHistory, setSalesHistory] = useState<SaleHistoryTransaction[]>([]);
  const [isSalesHistoryLoading, setIsSalesHistoryLoading] = useState<boolean>();
  const [videoFailed, setVideoFailed] = useState<boolean>();
  const [isFavorite, setIsFavorite] = useState<boolean>(itemIsFavorite(nftData));
  const [showLowerPrice, setShowLowerPrice] = useState<boolean>();
  const [copied, setCopied] = useState<boolean>(false);
  const [cacheFailed, setCacheFailed] = useState<boolean>(false);
  const [mintPrice, setMintPrice] = useState<Number>();
  const [isOwnedByWallet, setIsOwnedByWallet] = useState<boolean>(false);
  const [isEscrowListing, setIsEscrowListing] = useState<boolean>(false);
  const [notificationTitle, setNotificationTitle] = useState(
    "Please don’t close this modal while we confirm your purchase on the blockchain"
  );
  const [notificationDesc, setNotificationDesc] = useState(
    "After wallet approval, your transaction will be finished shortly…"
  );
  const [notificationCanClose, setNotificationCanClose] = useState<boolean>(false);
  const [modalTimer, setModalTimer] = useState<number>(0);
  const tooltipConnectWallet = useTooltipState();
  const tab = useTabState();

  const cacheFallback = (parentNode: any) => {
    setCacheFailed(true);
  };

  useEffect(() => {
    (async () => {
      if (nftData?.owner) {
        setDomainNames(await getUserDomains(connection, toPublicKey(nftData?.owner)));
      }
    })();
  }, [nftData?.owner, connection]);

  const copyLink = () => {
    setCopied(true);
    navigator.clipboard.writeText(
      `${window.location.origin}${ROUTES.ITEM}/${collectionName}/${nftData.mint}?pk=${nftData.escrowPubkeyStr}`
    );
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const closeAndResetModal = () => {
    setButtonLoading(false);
    setNotificationTitle(
      "Please don’t close this modal while we confirm your purchase on the blockchain"
    );
    setNotificationDesc("After wallet approval, your transaction will be finished shortly…");
    setModalTimer(5);
  };

  const successText =
    isListed || (!isListed && statusOnchain == "listed")
      ? `You've successfully unlisted ${name}. Please allow some time for the changes to be reflected in the listing and in your wallet.`
      : `You've successfully bought ${name} for ${price} SOL. Please allow some time for the changes to be reflected in the listing and in your wallet.`;

  const pageTitle = !isListed ? `List ${name}` : isOwnedByWallet ? `Unlist ${name}` : `Buy ${name}`;

  const accountByMint = useAccountByMint(mint);

  useEffect(() => {
    if (wallet?.publicKey && accountByMint && accountByMint.info) {
      setIsOwnedByWallet(accountByMint.info.owner.toString() == wallet.publicKey.toString());
    }
    if (
      nftData.initializerPubkey &&
      wallet?.publicKey &&
      wallet?.publicKey.toString() != nftData.initializerPubkey
    ) {
      setIsOwnedByWallet(false);
    }
  }, [wallet?.publicKey, accountByMint]);

  useEffect(() => {
    const getTokenAccount = async () => {
      if (wallet?.publicKey) {
        setIsNoticeLoading(true);
        const tokenAccountsMint = await connection.getTokenLargestAccounts(new PublicKey(mint));
        const token = tokenAccountsMint.value[0].address.toString();
        const infoToken = await connection.getParsedAccountInfo(new PublicKey(token));
        const data = infoToken!.value!.data!;
        // @ts-ignore
        const currentWallet = data.parsed.info.owner;
        const connectedWallet = wallet.publicKey.toString();

        if (nftData.contract == DIRECT_SELL_CONTRACT_ID) {
          if (nftData.initializerPubkey == connectedWallet && connectedWallet != currentWallet) {
            setIsOwnedByWallet(true);
            setNotice(
              "It looks like you have moved this item to a different wallet. Please move it back to unlist or lower the price."
            );
          }
          if (
            (nftData.initializerPubkey != connectedWallet && connectedWallet == currentWallet) ||
            currentWallet != nftData.initializerPubkey
          ) {
            setIsOwnedByWallet(false);
            setNotice(
              "The nft has moved from the wallet that listed it, it currently can not be purchased."
            );
          }
        }

        // console.log( tokenAccountsMint );
        if (tokenAccountsMint.value[0].uiAmount && tokenAccountsMint.value[0].uiAmount > 1) {
          setNotice(
            "Token buy/sell is temporarily disabled for items that share a mint. Thank you for your patience."
          );
        }
        setIsNoticeLoading(false);
      }
    };
    getTokenAccount();
  }, [wallet?.publicKey]);

  useEffect(() => {
    if (
      (nftData.contract && nftData.contract != DIRECT_SELL_CONTRACT_ID) ||
      statusOnchain == "escrow"
    ) {
      setIsEscrowListing(true);
    }
    // setMintPrice(nftData.price);
  }, [nftData]);

  useEffect(() => {
    if (!mintPrice && nftData.price) {
      setMintPrice(nftData.price);
    }
  }, [mintPrice]);

  async function listOffer(): Promise<void> {
    setButtonLoading(true);
    try {
      if (wallet && listingPrice) {
        await sellTx(connection, wallet, mint, listingPrice);
        setMintPrice(listingPrice);
        await setListedMintsFromDirectSell([...listedMintsFromDirectSell, mint]);
        await setMintsInWalletUnlisted(
          mintsInWalletUnlisted.filter((item: string) => item != mint)
        );

        setNotificationTitle(`Success!`);
        setNotificationDesc(
          `You've successfully listed ${name} for ${listingPrice} SOL. Please allow some time for the changes to be reflected in the listing and in your wallet.`
        );
        setNotificationCanClose(true);
        setModalTimer(5);
      }
    } catch (error) {
      setNotificationTitle(`Oops, something went wrong!`);
      setNotificationDesc((error as Error).message);
      setNotificationCanClose(true);
    }
    setTimeout(() => {
      closeAndResetModal();
      setNotificationCanClose(false);
      refreshItem();
    }, 5000);
  }

  async function buyItemEscrow(): Promise<void> {
    setButtonLoading(true);
    try {
      if (wallet?.publicKey) {
        await buyOfferTxEscrow(
          endpoint,
          connection,
          wallet,
          getEscrowContract(endpoint).escrowProgram,
          escrowPubkeyStr,
          escrow.escrowTaxRecipient,
          escrow.taxAmount,
          price
        );

        await setMintsInWalletUnlisted([...mintsInWalletUnlisted, mint]);
        await setListedMintsFromEscrow(
          listedMintsFromEscrow.filter((item: string) => item != mint)
        );

        tab.setSelectedId("fixed");

        setNotificationTitle(`Success!`);
        setNotificationDesc(successText);
        setNotificationCanClose(true);
        setModalTimer(5);
      }
    } catch (error) {
      setNotificationTitle(`Oops, something went wrong!`);
      setNotificationDesc((error as Error).message);
      setNotificationCanClose(true);
      // toast.error(<Notification title="Oops, something went wrong!" description={error.message} />);
    }
    setTimeout(() => {
      closeAndResetModal();
      setNotificationCanClose(false);
      refreshItem();
    }, 5000);
  }

  async function buyItem(): Promise<void> {
    setButtonLoading(true);
    try {
      if (wallet?.publicKey && nftData.saleInfo) {
        await buyOfferTx(
          connection,
          wallet,
          nftData.saleInfo,
          DIRECT_SELL_TAX_ID,
          DIRECT_SELL_TAX_AMOUNT,
          price
        );

        await setMintsInWalletUnlisted([...mintsInWalletUnlisted, mint]);
        await setListedMintsFromDirectSell(
          listedMintsFromDirectSell.filter((item: string) => item != mint)
        );

        setNotificationTitle(`Success!`);
        setNotificationDesc(successText);
        setNotificationCanClose(true);
        setModalTimer(5);
      }
    } catch (error) {
      setNotificationTitle(`Oops, something went wrong!`);
      setNotificationDesc((error as Error).message);
      setNotificationCanClose(true);
      // toast.error(<Notification title="Oops, something went wrong!" description={error.message} />);
    }
    setTimeout(() => {
      closeAndResetModal();
      setNotificationCanClose(false);
      refreshItem();
    }, 5000);
  }

  async function cancelSell(): Promise<void> {
    setButtonLoading(true);
    try {
      if (wallet?.publicKey) {
        await cancelSellTx(connection, wallet, mint);

        await setMintsInWalletUnlisted([...mintsInWalletUnlisted, mint]);
        await setListedMintsFromDirectSell(
          listedMintsFromDirectSell.filter((item: string) => item != mint)
        );
        setNotificationTitle(`Success!`);
        setNotificationDesc(successText);
        setNotificationCanClose(true);
        setModalTimer(5);
      }
    } catch (error) {
      setNotificationTitle(`Oops, something went wrong!`);
      setNotificationDesc((error as Error).message);
      setNotificationCanClose(true);
      // toast.error(<Notification title="Oops, something went wrong!" description={error.message} />);
    }
    setTimeout(() => {
      closeAndResetModal();
      setNotificationCanClose(false);
      refreshItem();
    }, 5000);
  }

  async function lowerOffer(): Promise<void> {
    setButtonLoading(true);
    try {
      if (wallet?.publicKey && nftData.saleInfo) {
        await lowerPrice(connection, wallet, mint, nftData.saleInfo, listingPrice);
        // listedMintsFromEscrow.splice(listedMintsFromEscrow.indexOf(mint), 1);
        // mintsInWalletUnlisted.push(mint);
        setMintPrice(listingPrice);
        setShowLowerPrice(false);
        setNotificationTitle(`Success!`);
        setNotificationDesc(`You've successfully lowered the price to ${listingPrice} SOL.`);
        setNotificationCanClose(true);
        setModalTimer(5);
      }
    } catch (error) {
      setNotificationTitle(`Oops, something went wrong!`);
      setNotificationDesc((error as Error).message);
      setNotificationCanClose(true);
      // toast.error(<Notification title="Oops, something went wrong!" description={error.message} />);
    }
    setTimeout(() => {
      closeAndResetModal();
      setNotificationCanClose(false);
      refreshItem();
    }, 5000);
  }

  const videoFile =
    metadata?.properties?.files && typeof metadata?.properties?.files !== "string"
      ? metadata?.properties?.files instanceof Array
        ? metadata?.properties?.files.find((videoFile: any) => videoFile.type && videoFile.type.includes("video"))
        : metadata?.properties?.files.type === "video/mp4" && metadata?.properties?.files
      : null;

  const videoFallback = (parentNode: any) => {
    console.log("videoFailed");

    setVideoFailed(true);
  };
  const category = metadata?.properties?.category;

  const animationUrl = metadata?.animation_url;
  const animationUrlExt = animationUrl
    ? animationUrl.includes("?ext=")
      ? animationUrl.split("?ext=").pop()
      : animationUrl.split(".").pop()
    : null;

  useEffect(() => {
    (async () => {
      setIsSalesHistoryLoading(true);
      let fullSalesHistory: {
        transactions: SaleHistoryTransaction[];
      };
      try {
        fullSalesHistory = await (
          await fetch(
            `${BASE_URL_SALES_HISTORY_RETRIEVER}?collection=${
              collectionName || "Unverifeyed"
            }&mint=${mint}`
          )
        ).json();
        setSalesHistory(fullSalesHistory?.transactions || []);
      } catch (error) {}
      setIsSalesHistoryLoading(false);
    })();
  }, [mint, collectionName]);

  const imageOutput =
    image && isImageInCache(image) && !cacheFailed ? (
      <IKImage
        urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
        path={getImagePath(image)}
        transformation={[]}
        className="shadow-md w-full h-auto rounded-md"
        alt={name}
        onError={cacheFallback}
      />
    ) : (
      <img src={image} alt={name} className="shadow-md w-full h-auto rounded-md" />
    );

  const isSolo: boolean = collectionName.split("#")[0] == "solo";
  const anonDisplay: string | undefined = isSolo
    ? `Anon${shortenAddress(collectionName.split("#")[2])}`
    : undefined;

  const viewProfile = () => {
    history.push(`${ROUTES.SOLOPROFILE}/${nftData.artistUser}`);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <span className="absolute top-0 left-0 p-3 sm:p-5">
        {isVerifeyed && collectionName != "unverifeyed" && !isSolo && <VerifeyedBadge />}
      </span>
      <div className="pt-16 sm:pt-12">
        <div className="relative text-center">
          <h5 className="text-gray-400 text-base mb-2 flex justify-center">
            <button
              disabled={isSolo && !nftData.artistUser}
              onClick={nftData.artistUser ? viewProfile : cancelAction}
              className={!(isSolo && !nftData.artistUser) ? "hover:text-blue" : "cursor-default"}
            >
              <div className="inline text-center col-span-2 flex flex-row">
                {" "}
                {nftData.artistUser
                  ? nftData.artistUser
                  : isSolo
                  ? anonDisplay
                  : collectionName}{" "}
                {nftData.artistVerified && <VerifiedCircle />}{" "}
              </div>
            </button>
          </h5>
          <h1 className="h1">{pageTitle}</h1>
          {nftData?.owner && (
            <p className="m-2 text-gray-400 text-base mb-2">
              Seller:{" "}
              <a
                className="hover:text-blue"
                href={`${SOL_SCAN_BASE_URL}${nftData?.owner}`}
                target="_blank"
                rel="noreferrer"
              >
                {domainNames ? getDomainList(domainNames) : shortenAddress(nftData?.owner)}
              </a>
            </p>
          )}
          <div className="flex justify-center mt-4">
            <button
              onClick={(e) => {
                setIsFavorite(handlerFavorites(e, nftData));
              }}
              className="inline-flex justify-end hover:text-white mx-2"
            >
              {isFavorite ? (
                <p className="inline-flex items-center text-xxs">
                  <HeartIconSolid className="text-red-400 h-4 w-4 mr-1 focus:outline-none" />
                  <span className="relative top-px text-white">Favorite</span>
                </p>
              ) : (
                <p className="inline-flex items-center text-xxs">
                  <HeartIconOutline className="text-gray-400 h-4 w-4 mr-1 focus:outline-none hover:text-red-400" />
                  <span className="relative top-px">Add to Favorites</span>
                </p>
              )}
            </button>
            <button
              className="hover:text-white mx-2"
              onClick={(e) => {
                copyLink();
              }}
            >
              <span className="text-white self-start inline-flex items-center text-xxs">
                <ClipboardCopyIcon className="h-4 w-4 mr-1" /> {copied ? "Copied :)" : "Copy Link"}
              </span>
            </button>
            <button className="hover:text-white mx-2" onClick={refreshItem}>
              <span className="text-white self-start inline-flex items-center text-xxs">
                <RefreshIcon className="h-4 w-4 mr-1" /> Refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-5 md:gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="rounded-md overflow-hidden mb-4">
              {animationUrl && (category === "vr" || animationUrlExt === "glb") && (
                <div className="shadow-md w-full md:h-96 h-auto block">
                  <model-viewer camera-controls poster={image} src={animationUrl}></model-viewer>
                </div>
              )}
              {animationUrl && (category === "html" || animationUrlExt === "html") && (
                <HTMLContent animationUrl={animationUrl}></HTMLContent>
              )}
              {videoFile && !videoFailed && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  controlsList="nodownload"
                  className="shadow-md w-full h-auto block"
                  onError={videoFallback}
                >
                  <source src={videoFile.uri} type="video/mp4" />
                  <source src={videoFile.uri} type="video/ogg" />
                </video>
              )}

              {animationUrl && animationUrlExt === "mp3" && (
                <>
                  {imageOutput}
                  <button
                    className="hover:text-white flex space-x-2 items-center py-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      audio.trigger(animationUrl);
                    }}
                  >
                    <MusicNoteIcon className="h-4 w-4 group-hover:text-white transition 150 ease-in-out" />
                    <span>{audio.isPlaying ? "Pause Audio" : "Play Audio"}</span>
                  </button>
                </>
              )}

              {!animationUrl && (!videoFile || videoFailed) && imageOutput}
            </div>

            <div className="my-5">
              <Attributes data={metadata?.attributes} mint={mint} collection={collectionName} />
            </div>
          </div>
          <div className="col-span-1 md:col-span-3">
            {/* {nftData.escrowPubkeyStr && (
              <p className="text-gray-500 uppercase">Owned By: {ownedBy()}</p>
            )} */}

            <div className="grid grid-cols-2">
              {nftData.price && isListed && (
                <div className="col-span-1">
                  <p className="text-base text-gray-500 uppercase mb-2">Current Price:</p>
                  {nftData.price != listingPrice}
                  <p className="text-3xl font-bold text-white mb-6">◎{mintPrice}</p>
                </div>
              )}
              {nftData.lastPrice && (
                <div className="col-span-1">
                  <p className="text-base text-gray-500 uppercase mb-2">Last Sold:</p>
                  <p className="text-3xl font-bold text-white mb-6">◎{nftData.lastPrice}</p>
                </div>
              )}
            </div>
            <div className="">
              {displayCopyBanner && <BottomBanner setDisplayCopyBanner={setDisplayCopyBanner} />}

              <div className="">
                <div className="space-y-2 md:space-y-8">
                  <div className="w-full">
                    {!isVerifeyed ||
                      (collectionName == "unverifeyed" && (
                        <div className="bg-gray-800 border-2 border-orange rounded-md w-full mb-8 mx-auto flex justify-between p-5">
                          <span className="text-orange">
                            <ExclamationCircleIcon className="w-10 mr-4" />
                          </span>
                          <p className="text-white font-semibold">
                            This is an UNVERIFEYED NFT. If it appears to be part of a VERIFEYED
                            collection, know that it is not.
                          </p>
                        </div>
                      ))}

                    {notice != "" && (
                      <div className="bg-gray-800 border-2 border-orange rounded-md w-full mb-8 mx-auto flex justify-between p-5">
                        <span className="text-orange">
                          <ExclamationCircleIcon className="w-10 mr-4" />
                        </span>
                        <p className="text-white font-semibold">{notice}</p>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <div>
                        {disputedMessage && (
                          <p className="text-orange text-sm font-bold my-2">{disputedMessage}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {children}
                </div>

                {!wallet?.publicKey && (
                  <div className="mb-5">
                    <ConnectButton size="lg" />
                  </div>
                )}

                {/*
                  {`isListed: ${isListed} `}<br/>
                  {`isOwnedByWallet: ${isOwnedByWallet} `}<br/>
                  {`isEscrowListing: ${isEscrowListing} `}<br/>
                  {`statusOnChain: ${statusOnchain}`}
                  */}

                <div className="flex space-x-2">
                  {isListed && !isOwnedByWallet && !isEscrowListing && (
                    <div className="mb-12">
                      <TooltipReference {...tooltipConnectWallet}>
                        <button
                          type="button"
                          disabled={!wallet?.publicKey || notice || isNoticeLoading ? true : false}
                          className="btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          onClick={() => buyItem()}
                        >
                          {buttonText}
                        </button>
                      </TooltipReference>
                    </div>
                  )}

                  {isListed && isEscrowListing && (
                    <div className="mb-12">
                      <TooltipReference {...tooltipConnectWallet}>
                        <button
                          type="button"
                          disabled={!wallet?.publicKey || notice || isNoticeLoading ? true : false}
                          className="btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          onClick={() => buyItemEscrow()}
                        >
                          {listedMintsFromEscrow.includes(mint) ? `Unlist Now` : buttonText}
                        </button>
                      </TooltipReference>
                    </div>
                  )}

                  {((statusOnchain == "listed" && !isListed) ||
                    (isListed && isOwnedByWallet && !isEscrowListing)) && (
                    <div className="flex space-x-2 mb-6">
                      <TooltipReference {...tooltipConnectWallet}>
                        <button
                          type="button"
                          disabled={!wallet?.publicKey || notice || isNoticeLoading ? true : false}
                          className="btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                          onClick={() => cancelSell()}
                        >
                          Unlist Item
                        </button>
                      </TooltipReference>

                      <button
                        type="button"
                        disabled={!wallet?.publicKey || notice || isNoticeLoading ? true : false}
                        className="btn btn-gray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        onClick={() => setShowLowerPrice(!showLowerPrice)}
                      >
                        Lower Item Price
                      </button>
                    </div>
                  )}
                </div>

                {showLowerPrice && (
                  <div className="mb-6 pb-5">
                    <div className="">
                      <div className="relative">
                        <label className="text-xxs text-white font-light">Price (sol)</label>
                        <input
                          onChange={(e) => {
                            handleListingPriceChange(e);
                          }}
                          value={listingPrice || ""}
                          type="number"
                          name="price"
                          min="0"
                          id="price"
                          className="block w-auto border border-gray-600 bg-transparent rounded-md text-gray-500 focus:text-white px-4 py-3 mb-2 focus:outline-none font-light"
                          placeholder="Amount"
                          aria-describedby="price-currency"
                          onWheel={(e) => (e.target as HTMLElement).blur()}
                        />
                      </div>
                    </div>

                    <NftRoyaltyCalculator offer={nftData} listingPrice={listingPrice} />

                    <button
                      type="button"
                      disabled={!wallet?.publicKey || listingPrice <= 0 ? true : false}
                      className="btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => lowerOffer()}
                    >
                      {listingPrice > 0 ? `Change Price to ${listingPrice}` : `Enter Lower Price`}
                    </button>
                  </div>
                )}

                {!isListed && isOwnedByWallet && statusOnchain != "listed" && (
                  <div className="w-full mb-12">
                    <TabList {...tab} aria-label="My tabs">
                      <Tab
                        {...tab}
                        style={{
                          color: "white",
                          background: "#222",
                          padding: "1rem 2rem",
                          marginRight: "5px",
                          borderRadius: "5px 5px 0 0",
                        }}
                        id="fixed"
                      >
                        Fixed Price
                      </Tab>
                      {/* <Tab {...tab} style={{ color: "white", background: "#444", padding: "1rem", borderRadius: '5px 5px 0 0' }} disabled>
                          Dutch Auction
                        </Tab> */}
                    </TabList>
                    <TabPanel
                      {...tab}
                      style={{
                        color: "white",
                        background: "#222",
                        padding: "2rem",
                        borderRadius: "0 5px 5px 5px",
                        margin: "0",
                      }}
                    >
                      <>
                        <div className="mb-5">
                          <div className="">
                            <div className="relative">
                              <label className="text-xxs text-white font-light">Price (sol)</label>
                              <input
                                onChange={(e) => {
                                  handleListingPriceChange(e);
                                }}
                                value={listingPrice || ""}
                                type="number"
                                name="price"
                                min="0"
                                id="price"
                                className="block w-auto border border-gray-600 bg-transparent rounded-md text-gray-500 focus:text-white px-4 py-3 focus:outline-none font-light"
                                placeholder="Amount"
                                aria-describedby="price-currency"
                                onWheel={(e) => (e.target as HTMLElement).blur()}
                              />
                            </div>
                          </div>

                          <NftRoyaltyCalculator offer={nftData} listingPrice={listingPrice} />
                        </div>

                        <TooltipReference {...tooltipConnectWallet}>
                          <button
                            type="button"
                            disabled={!wallet?.publicKey || listingPrice <= 0 ? true : false}
                            className="btn focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            onClick={() => listOffer()}
                          >
                            {listingPrice > 0
                              ? `List this NFT for ${listingPrice} SOL`
                              : "Enter Price to List"}
                          </button>
                        </TooltipReference>
                      </>
                    </TabPanel>
                  </div>
                )}

                <div className="mb-5">
                  <Divider rounded={true} />
                </div>
                <NFTDetailsAccordion salesHistoryData={salesHistory} collDesc={collectionDesc} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tooltip
        {...tooltipConnectWallet}
        style={{ background: "none", display: !wallet?.publicKey ? "block" : "none" }}
      >
        <div className="bg-black text-xs p-2 rounded-md">
          <TooltipArrow {...tooltipConnectWallet} />
          Please connect your wallet
        </div>
      </Tooltip>

      <NotificationModal
        isShow={buttonLoading}
        isToast={false}
        title={notificationTitle}
        description={notificationDesc}
        timer={modalTimer}
        onBackDropClick={() => {
          if (notificationCanClose) {
            closeAndResetModal();
          }
        }}
      ></NotificationModal>
    </div>
  );
};

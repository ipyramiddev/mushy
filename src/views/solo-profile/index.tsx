// @ts-ignore
import { IKImage } from "imagekitio-react";
import { Tooltip, TooltipArrow, TooltipReference, useTooltipState } from "reakit/Tooltip";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ReactComponent as VerifiedCircle } from "../../assets/icons/user-verified.svg";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { LoadingWidget } from "../../components/loadingWidget";
import { CreationsMasonry } from "../../components/CreationsMasonry";
import { Page } from "../../components/Page";
import { VerifeyedBadge } from "../../components/VerifeyedBadge";
import { getImagePath, IMAGE_KIT_ENDPOINT_URL, isImageInCache } from "../../constants/images";
import Masonry from "react-masonry-css";
import * as ROUTES from "../../constants/routes";
import { GET_SOLO_USER_NO_AUTH, GET_SOLO_USER_NO_AUTH_QUERY_PARAM } from "../../constants/urls";
import { useWallet as useWallet0 } from "../../contexts/wallet";
import {
  classNames,
  encodeFiltersToUrl,
  findCollection,
  getFiltersFromUrl,
  kFormatter,
  mapObjectQueryParams,
  removeNullValuesFromObject,
  useLocalStorageState,
} from "../../utils";
import useDidMountEffect from "../../utils/use-did-mount-effect";
import { NotFoundView } from "../404";
import { ErrorView } from "../error";
import { FavouriteButton } from "../../components/FavouriteButton";
import { ThumbnailImage } from "../../components/ThumbnailImage";
import { ReactComponent as DiscordLogo } from "../../assets/logo/discord.svg";
import { ReactComponent as TwitterLogo } from "../../assets/logo/twitter.svg";
import { Divider } from "../../components/Divider";
import { useTabState, Tab, TabList, TabPanel } from "reakit/Tab";
import { ActiveArtist, Metadata } from "../../types";
import { useConnection, useOpenConnection } from "../../contexts/connection";
import { fetchMetadataSolo } from "../../actions/metadata";
import { PublicKey, PublicKeyInitData } from "@solana/web3.js";
import { ProfileLink } from "../../components/SoloCreateStepper/ProfileImagesUploader/ProfileLink";

import "./styles.css";
import { PencilAltIcon } from "@heroicons/react/outline";

export const SoloProfileView = () => {
  const tab = useTabState();
  const tooltipEditProfile = useTooltipState();
  const history = useHistory();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [imageCacheFailed, setImageCacheFailed] = useState<boolean>(false);
  const [bannerCacheFailed, setBannerCacheFailed] = useState<boolean>(false);
  const [artist, setArtist] = useState<ActiveArtist>();
  const [creations, setCreations] = useState<any[]>([]);
  const [rerender, setRerender] = useState(false);
  const connection = useConnection();
  const openConnection = useOpenConnection();
  const wallet = useWallet0();

  const publicKey = wallet.publicKey;

  const { artist: artistName } = useParams<{ artist: string }>();

  async function getUserInfo() {
    const retrievedUser = await fetch(
      `${GET_SOLO_USER_NO_AUTH}?${GET_SOLO_USER_NO_AUTH_QUERY_PARAM}=${artistName}`
    ).then((res) => res.json());

    if (retrievedUser) {
      Promise.all(
        retrievedUser.mints_list.map(async (mint: any) => {
          try {
            const mintMetadata = await fetchMetadataSolo(connection, new PublicKey(mint?.mint_address))
            return {image:mintMetadata?.image,mint:mint?.mint_address,escrowPubkeyStr:""} ;
          } catch (e) {
            console.log("Getting Metadata failed", e);
          }
        })
      )
        .then((artistCreations) => {
          setCreations(artistCreations);
        })
        .catch((err) => console.log(err));
      setArtist(retrievedUser);
    }
  }

  const imageCacheFallback = (parentNode: any) => {
    setImageCacheFailed(true);
  };

  const bannerCacheFallback = (parentNode: any) => {
    setBannerCacheFailed(true);
  };

  useEffect(() => {
    openConnection();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        await getUserInfo();
        setIsLoading(false);
        setRerender(!rerender);
      } catch (err) {
        setIsLoading(false);
      }
    })();
  }, [connection, openConnection, artistName]);

  function goToEditProfile() {
    history.push(`${ROUTES.SOLO_SETTINGS}`);
  }

  const pageTitle = `DigitalEyes Market | ${artist?.username ? artist?.username : ""}`;

  return (
    <Page title={pageTitle} className="flex flex-col">
      {isLoading ? (
        <div className="flex justify-center">
          <div className="w-48 text-center">
            <LoadingWidget />
            Loading Artist Profile...
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex">
          <div className="mx-auto">
            <div className="overflow-hidden h-72 w-full object-cover mb-24">
              {artist?.banner && isImageInCache(artist?.banner) && !bannerCacheFailed ? (
                <IKImage
                  urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
                  path={artist?.banner}
                  alt={artist?.username + "banner"}
                  className="w-full"
                  width="1000"
                  onError={bannerCacheFallback}
                />
              ) : (
                <img
                  src={artist?.banner}
                  alt={artist?.username + "banner"}
                  className="w-full"
                  width="1000"
                />
              )}
            </div>
            <div className="max-w-5xl mx-4 sm:mx-6 lg:mx-auto relative flex justify-center px-7 z-10">
              {artist?.image && isImageInCache(artist?.image) && !imageCacheFailed ? (
                <IKImage
                  urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
                  path={artist?.image}
                  alt={artist?.username + "banner"}
                  className="w-48 h-auto absolute mx-auto my-0 bottom-0 border-8 border-black rounded-full"
                  onError={imageCacheFallback}
                />
              ) : (
                <img
                  src={artist?.image}
                  alt={artist?.username + "image"}
                  className="w-48 h-auto absolute mx-auto my-0 bottom-0 border-8 border-black rounded-full"
                />
              )}
            </div>
            <div className="max-w-5xl mx-4 sm:mx-6 lg:mx-auto relative  px-7 my-10">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold inline">{artist?.username}</h2>
                {artist?.verified && <VerifiedCircle className="inline mx-3 mb-4 w-7 h-7" />}
                {publicKey?.toString() === artist?.wallet_key.toString() && (
                  <>
                    <div className="w-full flex justify-center items-center my-5">
                      <button
                        onClick={goToEditProfile}
                        className="flex gap-2 items-center border-2 border-gray-500 py-2 px-4 rounded-md transition hover:border-white"
                      >
                        <PencilAltIcon className="w-6 h-auto" />
                        <span>edit profile</span>
                      </button>
                    </div>
                  </>
                )}

                <div className="my-6 text-gray-500">
                  <p className="text-md font-light">{artist?.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-8 w-full my-10">
                {artist?.discord && (
                  <ProfileLink isClipboard username={artist?.discord} social={"discord"} />
                )}
                {artist?.twitter && (
                  <ProfileLink
                    link={`https://twitter.com/${artist?.twitter}`}
                    username={artist?.twitter}
                    social={"twitter"}
                  />
                )}
                {artist?.instagram && (
                  <ProfileLink
                    link={`https://www.instagram.com/${artist?.instagram}`}
                    username={artist?.instagram}
                    social={"instagram"}
                  />
                )}
                {artist?.website && (
                  <ProfileLink
                    link={artist?.website}
                    username={artist?.website}
                    social={"website"}
                  />
                )}
              </div>

              <div className="pt-20">
                <Divider />
              </div>
              <div id="wallet-nav" className="flex justify-start text-xs md:text-sm my-5">
                <TabList {...tab} aria-label="Wallet Tabs">
                  <Tab {...tab}>
                    <p className="lowercase">creations</p>
                  </Tab>
                  {/** TODO: display artists NFT collection
              <Tab {...tab}><p className="lowercase">artist's collection</p></Tab>*/}
                </TabList>
              </div>
              <TabPanel {...tab}>
                <>{creations && <CreationsMasonry array={creations} />}</>
              </TabPanel>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

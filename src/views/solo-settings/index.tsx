import { useWallet as useWallet0 } from "../../contexts/wallet";
import { useContext, useEffect, useState } from "react";
// @ts-ignore
import { IKImage } from "imagekitio-react";
import { IMAGE_KIT_ENDPOINT_OLDURL } from "../../constants/images";
import { Page } from "../../components/Page";
import { SoloCreateProgressBar } from "../../components/SoloCreateProgressBar";
import { ProfileData, SoloCreateStepper } from "../../components/SoloCreateStepper";
import SoloCreationContext from "../../contexts/solo-creation";

import "./styles.css";
import { SoloWalletSigner } from "../../components/SoloWalletSigner";
import { GET_AUTHED_DETAILS } from "../../constants/urls";

type FalsyOr<T> = T | false | undefined | null | 0;

export const SoloSettingsView = () => {
  const { title, subtitle } = useContext(SoloCreationContext);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const wallet = useWallet0();

  const publicKey = wallet.publicKey;

  const userAuth = localStorage.getItem(`soloAuth${publicKey?.toBase58()}`)
    ? JSON.parse(localStorage.getItem(`soloAuth${publicKey?.toBase58()}`) as string).jwt_token
    : false;

  const fetchProfileData = async () => {
    let jwt: FalsyOr<string> = false;

    const authStorage: FalsyOr<string> = localStorage.getItem(
      `soloAuth${wallet?.publicKey?.toString()}`
    );

    if (authStorage) {
      jwt = JSON.parse(authStorage)["jwt_token"];
    }

    if (!jwt) {
      return;
    }

    try {
      const artistAuthed = await fetch(GET_AUTHED_DETAILS, {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          Authorization: `Bearer ${userAuth}`,
        },
      }).then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          return false;
        }
      });

      if (artistAuthed) {
        setProfileData({
          username: artistAuthed.username,
          description: artistAuthed.description,
          email: artistAuthed.email,
          discord: artistAuthed.discord,
          twitter: artistAuthed.twitter,
          instagram: artistAuthed.instagram,
          website: artistAuthed.website,
          image: artistAuthed.image,
          banner: artistAuthed.banner,
          theme: artistAuthed.theme,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <Page title="#solo | DigitalEyes">
      {!userAuth && <SoloWalletSigner path={"/solo-create"} />}
      {wallet?.publicKey && userAuth && (
        <main className="solo-create-container px-4 lg:px-0">
          <header className="my-12 flex flex-col gap-2 items-center">
            <h1 className="text-white text-center text-4xl lowercase font-bold">{title}</h1>
            <span className="text-gray-500 text-center lowercase">{subtitle}</span>
          </header>
          <SoloCreateProgressBar />
          <SoloCreateStepper data={profileData} />
        </main>
      )}
      {!wallet?.publicKey && userAuth && (
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
    </Page>
  );
};

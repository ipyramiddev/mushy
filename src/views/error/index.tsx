// @ts-ignore-next-line
import { IKImage } from "imagekitio-react";
import { ReactComponent as TwitterLogo } from "../../assets/logo/twitter.svg";
import { Page } from "../../components/Page";
import { IMAGE_KIT_ENDPOINT_OLDURL } from "../../constants/images";
import { DE_DISCORD } from "../../utils/DeSocials";

export const ErrorView = () => {
  return (
    <Page title="Something went wrong | DigitalEyes">
      <IKImage
        urlEndpoint={IMAGE_KIT_ENDPOINT_OLDURL}
        path="/logo/digitaleyes.svg"
        alt="digital eyes logo"
        className="w-auto h-56 absolute opacity-5 left-1/4 top-5"
      />
      <div className="max-w-2xl px-4 sm:px-6 lg:px-8 text-2xl md:text-4xl uppercase font-black py-6 md:py-10 mx-auto">
        Hmmm... <br/>something went wrong
      </div>
      <div className="max-w-2xl font-light px-4 sm:px-6 lg:px-8 mx-auto ">
        <p>Something went wrong and it looks like service is unavailable right now. First things first
        try refreshing the page. If that doesn't work, check out DigitalEyes on Twitter for updates
        on the site.</p>

        <a
        href={DE_DISCORD}
        target="_blank"
        className="btn inline-flex mt-10"
        rel="noreferrer"
      >
        <span>visit our twitter</span>
        <TwitterLogo className="h-5 w-5 ml-2" />
      </a>
      </div>
    </Page>
  );
};

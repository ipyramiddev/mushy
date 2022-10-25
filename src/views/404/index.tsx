// @ts-ignore-next-line
import { IKImage } from "imagekitio-react";
import { Page } from "../../components/Page";
import { TopCollections } from "../../components/TopCollections";
import { IMAGE_KIT_ENDPOINT_OLDURL } from "../../constants/images";

export const NotFoundView = () => {
  return (
    <Page title="Not found | DigitalEyes">
      <IKImage
        urlEndpoint={IMAGE_KIT_ENDPOINT_OLDURL}
        path="/logo/digitaleyes.svg"
        alt="digital eyes logo"
        className="w-auto h-56 absolute opacity-5 left-1/4 top-5"
      />
      <div className="mt-10 px-4 sm:px-6 lg:px-8 text-2xl md:text-4xl uppercase font-black py-6 md:py-10 mx-auto text-center">
        404 Not a Single thing HERE
      </div>
      <div className="max-w-2xl font-light px-4 sm:px-6 lg:px-8 mx-auto mb-24">
        We looked high and low but we just can’t find you a page for that URL. Don’t worry though,
        we do have a lot for you to explorer, take a look at some of our top collections below 👇
      </div>
      <TopCollections />
    </Page>
  );
};

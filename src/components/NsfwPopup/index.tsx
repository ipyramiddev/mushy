import { IMAGE_KIT_ENDPOINT_URL } from "../../constants/images";
import { Link } from "react-router-dom";
import * as ROUTES from "../../constants/routes";
// @ts-ignore
import { IKImage } from "imagekitio-react";

export const NsfwPopup = ({ goHomeNsfw, goToCollectionNsfw }: any) => {
  return (
    <div className="fixed top-1/7 sm:top-1/3 inset-x-0 pb-2 sm:pb-5 z-50">
      <div className="max-w-5xl mx-4 sm:mx-6 lg:mx-auto relative shadow-md py-10 px-7 bg-color-main-primary">
        <IKImage
          urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
          path="/logo/digitaleyes-cant-find.gif"
          alt="digital eyes cant find"
          className="w-auto h-12 absolute -top-5 mx-auto my-0 left-0 right-0"
        />

        <div className="text-center uppercase">
          <h2 className="text-3xl font-extrabold">GENTLE NOTICE</h2>
          <div className="my-6 text-center">
            <p className="text-sm md:text-xl font-light">
              THE COLLECTION YOU ARE ABOUT TO VIEW MAY CONTAIN CONTENT THAT COULD BE CLASSIFIED AS
              NSFW, UNSAFE FOR USERS BELOW THE AGE OF 18, OR ARE A COLLECTION OF DERIVATIVE ARTWORK.
            </p>
            <p className="text-sm m md:text-xl font-light">
              IT MAY CONTAIN NAKED PEOPLE, GRAPHIC IMAGES, ARTWORK THAT MIGHT HAVE CREATED BASED OFF
              OTHER EXISTING COLLECTIONS AND MAY BE DEEMED UNSAFE FOR SOME USERS.
            </p>
          </div>
          <div className="flex flex-wrap lg:flex-nowrap justify-center">
            <Link
              to={ROUTES.HOME}
              onClick={() => goHomeNsfw()}
              className="flex items-center justify-center disabled:opacity-50 duration-150 ease-in border border-transparent px-8 sm:px-8 py-4 bg-color-main-secondary text-base sm:text-2xl font-light text-color-main-primary hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm uppercase md:mx-auto w-full sm:w-96 mt-4"
            >
              Back to safety
            </Link>
            <button
              onClick={() => goToCollectionNsfw()}
              className="flex items-center justify-center disabled:opacity-50 duration-150 ease-in border border-transparent px-8 sm:px-8 py-4 bg-color-main-secondary text-base sm:text-2xl font-light text-color-main-primary hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm uppercase md:mx-auto w-full sm:w-96 mt-4"
            >
              Proceed to collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

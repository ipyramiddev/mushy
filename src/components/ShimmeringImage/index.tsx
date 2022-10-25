// @ts-ignore
import { IKImage } from "imagekitio-react";
import { useState } from "react";

import { getImagePath, IMAGE_KIT_ENDPOINT_URL, isImageInCache } from "../../constants/images";

import "./styles.css";

interface ShimmeringImageProps {
  url: string;
  name: string;
  width: string;
  height: string;
  classString?: string;
}

// TODO: Handle error getting the image and return a "image not found" kind of component
export const ShimmeringImage: React.FC<ShimmeringImageProps> = ({
  url,
  name,
  width,
  height,
  classString,
}) => {
  const [cacheFailed, setCacheFailed] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const cacheFallback = (parentNode: any) => {
    setCacheFailed(true);
  };

  const imageLoaded = (parentNode: any) => {
    setLoaded(true);
  };

  const wrapperClasses = `${classString} ${
    loaded ? "loaded" : ""
  } image-container rounded-lg overflow-hidden aspect-w-16 aspect-h-16`;

  return (
    <div data-width={width} data-height={height} className={wrapperClasses}>
      {url && isImageInCache(url) && !cacheFailed ? (
        <IKImage
          urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
          path={getImagePath(url)}
          lqip={{ active: true, quality: 5, blur: 20 }}
          alt={name}
          width="600"
          onError={cacheFallback}
          onLoad={imageLoaded}
          className={"card-img w-auto mx-auto rounded-md h-full object-center object-contain"}
        />
      ) : (
        <img
          className={"card-img w-auto mx-auto rounded-md h-full object-center object-contain"}
          src={url}
          alt={name}
          onLoad={imageLoaded}
        />
      )}
    </div>
  );
};

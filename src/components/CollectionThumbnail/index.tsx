//@ts-ignore
import { IKImage } from "imagekitio-react";
import { useState } from "react";
import { IMAGE_KIT_ENDPOINT_URL } from "../../constants/images";
import "../ShimmeringImage/styles.css";

interface CollectionThumbnailProps {
  className?: string;
  width?: string;
  height?: string;
  thumbnail: string;
  name: string;
  loading?: "eager" | "lazy";
  ikImageTransformation?: any[];
}

export const CollectionThumbnail = ({
  thumbnail,
  name,
  width,
  height,
  className,
  ikImageTransformation,
  loading,
}: CollectionThumbnailProps) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const isHttpsAddress = Boolean(thumbnail.includes("https"));

  const imageLoaded = (parentNode: any) => {
    setLoaded(true);
  };

  const wrapperClasses = `${loaded ? "loaded" : ""} image-container aspect-w-16 aspect-h-16`;
  const imageClasses = `${className} ${loaded? "" : "invisible"}`;

  return (
    <div data-width={width} data-height={height} className={wrapperClasses}>
      {isHttpsAddress ? (
        <img
          src={thumbnail}
          alt={name + "logo"}
          width={width}
          height={height}
          className={imageClasses}
          loading={loading}
          onLoad={imageLoaded}
        />
      ) : (
        <IKImage
          urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
          path={thumbnail}
          transformation={ikImageTransformation}
          alt={name + "logo"}
          width={width}
          height={height}
          className={imageClasses}
          loading={loading}
          onLoad={imageLoaded}
        />
      )}
    </div>
  );
};

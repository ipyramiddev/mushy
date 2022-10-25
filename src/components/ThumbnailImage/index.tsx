//@ts-ignore
import { IKImage } from "imagekitio-react";
import { IMAGE_KIT_ENDPOINT_URL } from "../../constants/images";

interface ThumbnailImageProps {
  className?: string;
  width?: string;
  height?: string;
  thumbnail: string;
  name: string;
  loading?: "eager" | "lazy";
  ikImageTransformation?: any[];
}

export const ThumbnailImage = ({
  thumbnail,
  name,
  width,
  height,
  className,
  ikImageTransformation,
  loading,
}: ThumbnailImageProps) => {
  const isHttpsAddress = Boolean(thumbnail.includes("https"));
  return isHttpsAddress ? (
    <img
      src={thumbnail}
      alt={name + "logo"}
      width={width}
      height={height}
      className={className}
      loading={loading}
    />
  ) : (
    <IKImage
      urlEndpoint={IMAGE_KIT_ENDPOINT_URL}
      path={thumbnail}
      transformation={ikImageTransformation}
      alt={name + "logo"}
      width={width}
      height={height}
      className={className}
      loading={loading}
    />
  );
};
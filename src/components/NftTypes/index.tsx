import { useState } from "react";
import { LoadingWidget } from "../loadingWidget";

export const HTMLContent = ({
  animationUrl,
  className,
  style,
}: {
  animationUrl?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);
  return (
    <div
      style={{
        paddingTop: "100%",
        position: "relative",
      }}
    >
      {!loaded ? (
        <LoadingWidget
          style={{ width: "100%", height: "100%", top: 0, left: 0, position: "absolute" }}
        />
      ) : null}
      <iframe
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts"
        frameBorder="0"
        src={animationUrl}
        className={className}
        onLoad={() => {
          setLoaded(true);
        }}
        style={{
          ...style,
          height: !loaded ? 0 : "100%",
          width: "100%",
          top: 0,
          left: 0,
          position: "absolute",
        }}
      ></iframe>
    </div>
  );
};

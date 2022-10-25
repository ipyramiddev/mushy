import { useLottie } from "lottie-react";
import loadingDotsAnimation from "../../assets/lottie/loading-dots.json";

export const LoadingWidget = ({ style }: { style?: React.CSSProperties }) => {
  const options = {
    animationData: loadingDotsAnimation,
    loop: true,
    autoplay: true,
  };
  const { View } = useLottie(options, style);
  return View;
};

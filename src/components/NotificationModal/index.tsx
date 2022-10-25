import { CircularProgress } from "@material-ui/core";
import { useEffect, useState, useRef } from "react";
import { DE_DISCORD, DE_TWITTER } from "../../utils/DeSocials";
import { useInterval } from "../../hooks/useInterval";
interface NotificationModalProps {
  isShow?: boolean;
  isToast?: boolean;
  title: string;
  description: string;
  timer: number;
  onBackDropClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}
export const NotificationModal = ({
  isShow,
  isToast,
  title,
  description,
  timer,
  onBackDropClick,
}: NotificationModalProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(true);
  
  useInterval(() => {
    setTimeLeft(timeLeft - 1);
  }, isRunning ? 1000 : null);
  
  useEffect(() => {
    setTimeLeft(timer)
    if( timer >= 5 )
      setIsRunning(true);
  }, [timer])

  return isShow || isToast ? (
    <div
      className={
        isToast
          ? "h-auto w-auto"
          : "z-50 fixed flex inset-0 bg-black bg-opacity-90 overflow-y-auto h-full w-full pl-10 pr-10"
      }
      onClick={(e) => onBackDropClick && onBackDropClick(e)}
    >
      <div
        style={{ background: "#2F2F2F", boxShadow: "0px 3px 36px #000000CB" }}
        className="flex-columb m-auto rounded-lg h-auto max-w-2xl overflow-hidden"
      >
        <div className="flex overflow-auto">
          <div className={`flex-columb ${isToast ? "mr-5" : "mr-10"} ml-5`}>
            <h4 className={`font-white ${isToast ? "text-md" : "text-lg"}  mt-6`}>{title}</h4>
            <p
              style={{ color: "#AAAAAA" }}
              className={`font-gray ${isToast ? "text-xs" : "text-sm"} mt-4 mb-4`}
            >
              {description}
            </p>
          </div>
          {!isToast && (
            <div className="w-auto ml-auto relative">
              <CircularProgress className="m-6" color="inherit" size="40px" thickness={4} />
              <span className="absolute top-0 right-0 m-6 text-xs text-center flex items-center justify-center" style={{width:"40px", height:"40px"}}>
                {timeLeft && timeLeft > 0 ? `${timeLeft}` : ``}
              </span>
            </div>
          )}
        </div>
        <div style={{ background: "#222222" }} className="flex-columb overflow-auto">
          <div
            className="h-1 w-full"
            style={{
              background:
                "transparent linear-gradient(270deg, #CF35EC 0%, #2EE9A8 100%) 0% 0% no-repeat padding-box",
            }}
          />
          <p className={`m-5 ${isToast ? "text-sm" : "text-md"}`}>
            Please join us on{" "}
            <a style={{ color: "#4FBBEB" }} href={DE_DISCORD} target="_blank" rel="noreferrer">
              Discord
            </a>{" "}
            &{" "}
            <a style={{ color: "#4FBBEB" }} href={DE_TWITTER} target="_blank" rel="noreferrer">
              Twitter
            </a>{" "}
            for community updates and promotions
          </p>
        </div>
      </div>
    </div>
  ) : null;
};

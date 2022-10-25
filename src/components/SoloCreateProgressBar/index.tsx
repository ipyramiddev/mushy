import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import CreateSoloContext from "../../contexts/solo-creation";

import "./styles.css";

export const SoloCreateProgressBar: React.FC = () => {
  const { completedPercentage } = useContext(CreateSoloContext);
  const [stopColorPercentage, setStopColorPercentage] = useState<number>(0);

  function animateProgressBarGradient() {
    setStopColorPercentage((previousPercentage) =>
      previousPercentage === 100 ? -20 : previousPercentage + 1
    );
  }

  useEffect(() => {
    let interval = setInterval(animateProgressBarGradient, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky progress-bar-container w-full my-14 py-8 z-50">
      <svg
        width="565"
        height="19"
        viewBox="0 0 565 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <g id="progress-bar">
          <g id="progress-bar_2">
            <mask
              id="path-1-outside-1_196:13"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="565"
              height="19"
              fill="#2d2d2d"
            >
              <rect fill="white" width="565" height="19" />
              <path d="M16.5732 12C15.5436 14.913 12.7655 17 9.5 17C5.35786 17 2 13.6421 2 9.5C2 5.35786 5.35786 2 9.5 2C12.7655 2 15.5436 4.08702 16.5732 7H184.427C185.456 4.08702 188.234 2 191.5 2C194.766 2 197.544 4.08702 198.573 7H366.427C367.456 4.08702 370.234 2 373.5 2C376.766 2 379.544 4.08702 380.573 7H548.427C549.456 4.08702 552.234 2 555.5 2C559.642 2 563 5.35786 563 9.5C563 13.6421 559.642 17 555.5 17C552.234 17 549.456 14.913 548.427 12H380.573C379.544 14.913 376.766 17 373.5 17C370.234 17 367.456 14.913 366.427 12H198.573C197.544 14.913 194.766 17 191.5 17C188.234 17 185.456 14.913 184.427 12H16.5732Z" />
            </mask>
            <path
              d="M16.5732 12C15.5436 14.913 12.7655 17 9.5 17C5.35786 17 2 13.6421 2 9.5C2 5.35786 5.35786 2 9.5 2C12.7655 2 15.5436 4.08702 16.5732 7H184.427C185.456 4.08702 188.234 2 191.5 2C194.766 2 197.544 4.08702 198.573 7H366.427C367.456 4.08702 370.234 2 373.5 2C376.766 2 379.544 4.08702 380.573 7H548.427C549.456 4.08702 552.234 2 555.5 2C559.642 2 563 5.35786 563 9.5C563 13.6421 559.642 17 555.5 17C552.234 17 549.456 14.913 548.427 12H380.573C379.544 14.913 376.766 17 373.5 17C370.234 17 367.456 14.913 366.427 12H198.573C197.544 14.913 194.766 17 191.5 17C188.234 17 185.456 14.913 184.427 12H16.5732Z"
              fill="#2d2d2d"
            />
            <path
              d="M16.5732 12C15.5436 14.913 12.7655 17 9.5 17C5.35786 17 2 13.6421 2 9.5C2 5.35786 5.35786 2 9.5 2C12.7655 2 15.5436 4.08702 16.5732 7H184.427C185.456 4.08702 188.234 2 191.5 2C194.766 2 197.544 4.08702 198.573 7H366.427C367.456 4.08702 370.234 2 373.5 2C376.766 2 379.544 4.08702 380.573 7H548.427C549.456 4.08702 552.234 2 555.5 2C559.642 2 563 5.35786 563 9.5C563 13.6421 559.642 17 555.5 17C552.234 17 549.456 14.913 548.427 12H380.573C379.544 14.913 376.766 17 373.5 17C370.234 17 367.456 14.913 366.427 12H198.573C197.544 14.913 194.766 17 191.5 17C188.234 17 185.456 14.913 184.427 12H16.5732Z"
              stroke="#444444"
              strokeOpacity="0.22"
              strokeWidth="2"
              mask="url(#path-1-outside-1_196:13)"
            />
          </g>
          <g id="masked group">
            <mask
              id="mask0_196:13"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="2"
              y="2"
              width="561"
              height="15"
            >
              <rect
                style={{
                  transformOrigin: "left",
                  transition: "transform 0.3s ease-in-out",
                  width: "100%",
                  transform: `scaleX(${completedPercentage / 100})`,
                }}
                id="progress-mask"
                x="2"
                y="2"
                height="15"
                fill="url(#paint0_linear_196:13)"
              />
            </mask>
            <g mask="url(#mask0_196:13)">
              <path
                id="progress-bar_3"
                d="M16.5732 12C15.5436 14.913 12.7655 17 9.5 17C5.35786 17 2 13.6421 2 9.5C2 5.35786 5.35786 2 9.5 2C12.7655 2 15.5436 4.08702 16.5732 7H184.427C185.456 4.08702 188.234 2 191.5 2C194.766 2 197.544 4.08702 198.573 7H366.427C367.456 4.08702 370.234 2 373.5 2C376.766 2 379.544 4.08702 380.573 7H548.427C549.456 4.08702 552.234 2 555.5 2C559.642 2 563 5.35786 563 9.5C563 13.6421 559.642 17 555.5 17C552.234 17 549.456 14.913 548.427 12H380.573C379.544 14.913 376.766 17 373.5 17C370.234 17 367.456 14.913 366.427 12H198.573C197.544 14.913 194.766 17 191.5 17C188.234 17 185.456 14.913 184.427 12H16.5732Z"
                fill="url(#paint1_linear_196:13)"
              />
            </g>
          </g>
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_196:13"
            x1="2"
            y1="9.00017"
            x2="563"
            y2="9.00025"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF2424" />
            <stop offset="1" stopColor="#780032" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_196:13"
            x1="2"
            y1="9.00017"
            x2="563"
            y2="9.00025"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#4FBBEB" />
            <stop offset={`${stopColorPercentage - 15}%`} stopColor="#4FBBEB" />
            <stop offset={`${stopColorPercentage}%`} stopColor="#a6d6eb" />
            <stop offset={`${stopColorPercentage + 15}%`} stopColor="#4FBBEB" />
            <stop offset="100%" stopColor="#4FBBEB" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className="completed-percentage-span text-blue-500 text-sm font-semibold"
        style={{
          left: `${completedPercentage}%`,
          transform: `translateX(-${completedPercentage}%)`,
        }}
      >
        {completedPercentage}% completed
      </span>
    </div>
  );
};

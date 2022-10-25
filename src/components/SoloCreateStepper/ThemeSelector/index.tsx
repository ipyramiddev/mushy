import { useEffect, useRef, useState } from "react";
import SOLO_THEMES from "../../../constants/solo-themes";
import { DigitalEyesAnimatedIcon } from "../../DigitalEyesAnimatedIcon";
import "./styles.css";

interface ThemeSelectorProps {
  themeSelected: string;
  setThemeSelected: (theme: string) => void;
}

interface ThemeRadioInput {
  theme: string;
  themeSelected: string;
}

const ThemeRadioInput: React.FC<ThemeRadioInput> = ({ theme, themeSelected, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    name,
    backgroundPrimary,
    backgroundSecondary,
    textPrimary,
    textSecondary,
    border,
    icons,
  } = SOLO_THEMES[theme];

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className={
        "flex flex-col items-center cursor-pointer bg-gray-900 rounded-md transition border-2 border-gray-900 hover:border-blue-500 " +
        (themeSelected === theme ? "border-blue-500" : "")
      }
      style={{ width: "30%" }}
    >
      <div
        className="w-full h-36 pointer-events-none rounded-md"
        style={{ background: backgroundPrimary }}
      >
        <div className="w-full h-14 rounded-md" style={{ background: backgroundSecondary }}></div>
        <div
          className="h-12 w-12 rounded-full transform -translate-y-6 mx-auto"
          style={{ background: backgroundSecondary, border: `6px solid ${border}` }}
        ></div>
        <div
          className="h-1.5 w-12 rounded-full transform -translate-y-4 mx-auto"
          style={{ background: textPrimary }}
        ></div>
        <div
          className="h-1 w-28 rounded-full transform -translate-y-2 mx-auto"
          style={{ background: textSecondary }}
        ></div>
        <div
          className="h-1 w-20 rounded-full transform -translate-y-1 mx-auto"
          style={{ background: textSecondary }}
        ></div>
        <div className="flex gap-1 items-center justify-center w-full transform translate-y-2">
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: icons }}></div>
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: icons }}></div>
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: icons }}></div>
          <div className="h-2.5 w-2.5 rounded-sm" style={{ background: icons }}></div>
        </div>
      </div>
      <div className="w-full flex px-4 py-2 items-center justify-start gap-2 pointer-events-none">
        <input
          ref={inputRef}
          type="radio"
          id={"radio-" + theme}
          name="theme"
          value={theme}
          onChange={() => {}}
          checked={themeSelected === theme}
          {...rest}
        />
        <label htmlFor={"radio-" + theme} className="truncate">
          {name}
        </label>
      </div>
    </div>
  );
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themeSelected,
  setThemeSelected,
}) => {
  const handleThemeChange = (theme: string) => {
    setThemeSelected(theme);
  };

  return (
    <div className="relative w-full my-10 rounded-md">
      <form
        onChange={(e: any) => {
          handleThemeChange(e.target.value);
        }}
        className="flex flex-wrap gap-5 items-center justify-center w-full my-10"
      >
        {Object.keys(SOLO_THEMES).map((themeKey, index) => (
          <ThemeRadioInput key={index} theme={themeKey} themeSelected={themeSelected} />
        ))}
      </form>
      <div className="absolute top-0 left-0 w-full h-full coming-soon-overlay flex flex-col items-center justify-center">
        <DigitalEyesAnimatedIcon className="h-6 w-auto my-2" />
        coming soon
      </div>
    </div>
  );
};

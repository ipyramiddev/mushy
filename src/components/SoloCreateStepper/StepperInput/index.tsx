import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import SoloCreationContext from "../../../contexts/solo-creation";

import "./styles.css";

interface StepperInputProps extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  type: string;
  labelComponent?: React.ReactNode;
  isTextArea?: boolean;
}

export const StepperInput: React.FC<any> = ({
  name,
  type,
  labelComponent,
  isValid,
  error,
  isTextArea = false,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const labelRef = useRef<HTMLLabelElement>(null);

  useLayoutEffect(() => {
    let clipSize: number = 0;

    if (labelRef.current) {
      clipSize = 16 + labelRef.current.clientWidth;
    }

    if (inputRef.current) {
      inputRef.current.style.clipPath = `polygon(-10px -10px, -10px 110%, 16px 110%, 16px -10px, ${clipSize}px -10px, ${clipSize}px 5px, 16px 5px, 16px 110%, 110% 110%, 110% -10px)`;
    }

    if (textAreaRef.current) {
      textAreaRef.current.style.clipPath = `polygon(-10px -10px, -10px 110%, 16px 110%, 16px -10px, ${clipSize}px -10px, ${clipSize}px 5px, 16px 5px, 16px 110%, 110% 110%, 110% -10px)`;
    }
  }, []);

  return (
    <div className="relative w-full">
      <label ref={labelRef} htmlFor={name} className="stepper-input-label">
        {labelComponent ? labelComponent : name}
      </label>
      {isTextArea ? (
        <textarea
          spellCheck={false}
          className={`stepper-input w-full rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out resize-none ${
            !isValid
              ? "border-red-600 focus:border-red-600"
              : "border-gray-500 focus:border-blue-500"
          }`}
          ref={textAreaRef}
          name="description"
          id="description"
          cols={40}
          rows={8}
          {...rest}
        ></textarea>
      ) : (
        <input
          spellCheck={false}
          className={`stepper-input w-full rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out ${
            !isValid
              ? "border-red-600 focus:border-red-600"
              : "border-gray-500 focus:border-blue-500"
          }`}
          ref={inputRef}
          type={type}
          id={name}
          name={name}
          {...rest}
        />
      )}
      {!isValid && <span className="absolute top-full left-2 my-1 text-red-600">{error}</span>}
    </div>
  );
};

import { createContext, useEffect, useState } from "react";
import * as Yup from "yup";

interface ISoloCreationContextProvider {
  children: React.ReactNode;
}

interface ISoloCreationContext {
  completedPercentage: number;
  currentStep: SoloCreationStep;
  previousStep: () => void;
  nextStep: () => void;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;
  title: string;
  subtitle: string;
  nextButtonText: string;
  previousButtonText: string;
  resetStepper: () => void;
}

export type SoloCreationStep = "details" | "verification" | "customization" | "outro";

const SoloCreationContext = createContext({} as ISoloCreationContext);

export const stepList: SoloCreationStep[] = ["details", "verification", "customization", "outro"];

export function SoloCreationContextProvider({ children }: ISoloCreationContextProvider) {
  const [completedPercentage, setCompletedPercentage] = useState<number>(50);
  const [currentStep, setCurrentStep] = useState<SoloCreationStep>("details");
  const [title, setTitle] = useState<string>("");
  const [subtitle, setSubtitle] = useState<string>("");
  const [nextButtonText, setNextButtonText] = useState<string>("");
  const [previousButtonText, setPreviousButtonText] = useState<string>("");

  const updateCompletedPercentage = (percentage: number) => {
    setCompletedPercentage(percentage);
  };

  const resetStepper = () => {
    setCurrentStep("details");
  };

  const previousStep = () => {
    if (currentStep === "details") return;

    const currentIndex = stepList.indexOf(currentStep);

    setCurrentStep(stepList[currentIndex - 1]);
  };

  const nextStep = () => {
    if (currentStep === "outro") return;

    const currentIndex = stepList.indexOf(currentStep);

    setCurrentStep(stepList[currentIndex + 1]);
  };

  const isLastStep = () => {
    return currentStep === stepList[stepList.length - 1];
  };

  const isFirstStep = () => {
    return currentStep === stepList[0];
  };

  useEffect(() => {
    const stepHeaderTextMap: any = {
      details: {
        title: "let’s create a #solo profile first",
        subtitle: "then we will get you minting in no time...",
        percentage: 0,
        previousButtonText: "back",
        nextButtonText: "next",
        nextCallback: () => {},
      },
      verification: {
        title: "verify your #solo email",
        subtitle: "we’ve sent you a code, check your email",
        percentage: 33,
        previousButtonText: "back",
        nextButtonText: "next",
      },
      customization: {
        title: "customize your #solo profile",
        subtitle: "give your profile more personality",
        percentage: 66,
        previousButtonText: "back",
        nextButtonText: "next",
      },
      outro: {
        title: "#solo profile created",
        subtitle: "you can now start your #solo journey",
        percentage: 100,
      },
    };

    const { title, subtitle, percentage, previousButtonText, nextButtonText } =
      stepHeaderTextMap[currentStep];

    setTitle(title);
    setSubtitle(subtitle);
    setPreviousButtonText(previousButtonText);
    setNextButtonText(nextButtonText);
    updateCompletedPercentage(percentage);
  }, [currentStep]);

  return (
    <SoloCreationContext.Provider
      value={{
        completedPercentage,
        currentStep,
        previousStep,
        nextStep,
        isFirstStep,
        isLastStep,
        title,
        subtitle,
        nextButtonText,
        previousButtonText,
        resetStepper,
      }}
    >
      {children}
    </SoloCreationContext.Provider>
  );
}

export default SoloCreationContext;

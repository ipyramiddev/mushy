import { useContext, useEffect, useRef, useState } from "react";
import Validate from "./validation";
import SoloCreationContext, { SoloCreationStep, stepList } from "../../contexts/solo-creation";
import {
  DescriptionInputLabel,
  DiscordInputLabel,
  EmailInputLabel,
  InstagramInputLabel,
  TwitterInputLabel,
  UsernameInputLabel,
  WebsiteInputLabel,
} from "./Labels";
import { Notification } from "../../components/Notification";
import { toast } from "react-toastify";
import { ProfileImagesUploader } from "./ProfileImagesUploader";
import { StepperInput } from "./StepperInput";
import { ThemeSelector } from "./ThemeSelector";
import { useWallet } from "../../contexts/wallet";
import {
  BASE_URL_SOLO_ADD_USER,
  BASE_URL_SOLO_GET_CODE,
  BASE_URL_SOLO_GET_UPLOAD_URLS,
  BASE_URL_SOLO_UPDATE_USER,
  BASE_URL_SOLO_VERIFY_CODE,
} from "../../constants/urls";
import axios from "axios";
import { Link } from "react-router-dom";

import "./styles.css";

export interface ProfileData {
  username: string;
  description: string;
  email: string;
  discord: string | undefined;
  twitter: string | undefined;
  instagram: string | undefined;
  website: string | undefined;
  image: string;
  banner: string;
  theme: string;
}
interface SoloCreateStepperProps {
  data?: ProfileData | null;
}

export const SoloCreateStepper: React.FC<SoloCreateStepperProps> = ({ data }) => {
  // hooks
  const {
    previousStep,
    nextStep,
    currentStep,
    isLastStep,
    isFirstStep,
    nextButtonText,
    previousButtonText,
    resetStepper,
  } = useContext(SoloCreationContext);
  // Images
  const [profileImage, setProfileImage] = useState<string>("");
  const [hasProfileImageChanged, setHasProfileImageChanged] = useState<boolean>(false);
  const [profileBanner, setProfileBanner] = useState<string>("");
  const [hasProfileBannerChanged, setHasProfileBannerChanged] = useState<boolean>(false);

  // Username input
  const [originalUsername, setOriginalUsername] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const [usernameError, setUsernameError] = useState<string>("");
  const [hasUsernameChanged, setHasUsernameChanged] = useState<boolean>(false);

  // Description input
  const [description, setDescription] = useState<string>("");
  const [isDescriptionValid, setIsDescriptionValid] = useState<boolean>(true);
  const [descriptionError, setDescriptionError] = useState<string>("");

  // Email input
  const [email, setEmail] = useState<string>("");
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [emailError, setEmailError] = useState<string>("");
  const [hasEmailChanged, setHasEmailChanged] = useState<boolean>(false);

  // Discord input
  const [discord, setDiscord] = useState<string>("");
  const [isDiscordValid, setIsDiscordValid] = useState<boolean>(true);
  const [discordError, setDiscordError] = useState<string>("");

  // Twitter input
  const [twitter, setTwitter] = useState<string>("");
  const [isTwitterValid, setIsTwitterValid] = useState<boolean>(true);
  const [twitterError, setTwitterError] = useState<string>("");

  // Instagram input
  const [instagram, setInstagram] = useState<string>("");
  const [isInstagramValid, setIsInstagramValid] = useState<boolean>(true);
  const [instagramError, setInstagramError] = useState<string>("");

  // Website input
  const [website, setWebsite] = useState<string>("");
  const [isWebsiteValid, setIsWebsiteValid] = useState<boolean>(true);
  const [websiteError, setWebsiteError] = useState<string>("");

  const [emailVerificationCode, setEmailVerificationCode] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  const [themeSelected, setThemeSelected] = useState<string>("default");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { wallet } = useWallet();

  // refs
  const detailsFormRef = useRef<HTMLFormElement>(null);
  const codeFormRef = useRef<HTMLFormElement>(null);
  const codeFirstInputRef = useRef<HTMLInputElement>(null);
  const stepsRefs = {
    details: useRef<HTMLDivElement>(null),
    verification: useRef<HTMLDivElement>(null),
    customization: useRef<HTMLDivElement>(null),
    outro: useRef<HTMLDivElement>(null),
  };

  function animateCurrentStepOut(): number {
    const animDuration: number = 150;

    stepsRefs[currentStep].current?.animate(
      [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.95 },
      ],
      {
        duration: animDuration,
        fill: "forwards",
      }
    );

    return animDuration;
  }

  function animateFollowingStepIn(origin: "fromLeft" | "fromRight"): number {
    const animDuration: number = 100;

    const originX = origin === "fromLeft" ? "-15%" : "15%";
    const stepToAnimateIn: SoloCreationStep =
      origin === "fromLeft"
        ? stepList[stepList.indexOf(currentStep) - 1]
        : stepList[stepList.indexOf(currentStep) + 1];

    stepsRefs[stepToAnimateIn].current?.animate(
      [
        { opacity: 0, transform: `translateX(${originX})` },
        { opacity: 1, transform: "translateX(0%)" },
      ],
      {
        duration: animDuration,
        fill: "forwards",
        easing: "ease-out",
      }
    );

    return animDuration;
  }

  function scrollToTop() {
    if (window.scrollY) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }

  function loadNextStep() {
    setIsLoading(false);
    scrollToTop();
    animateCurrentStepOut();
    setTimeout(() => {
      nextStep();
      animateFollowingStepIn("fromRight");
    }, 150);
  }

  const isOgUsername = () => {
    return username === originalUsername;
  };

  async function sendEmailVerificationCode(email: string) {
    console.log(`Sending email code to ${email}..`);

    setIsLoading(true);

    return new Promise(async (resolve, reject) => {
      if (isEmailVerified) {
        resolve(true);
      }

      try {
        const data = await fetch(BASE_URL_SOLO_GET_CODE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }).then((res) => {
          if (res.status === 200) {
            return res.json();
          }

          toast.error(
            <Notification
              title="Error sending code"
              description={`Error trying to send code to ${email}`}
            />
          );

          setIsLoading(false);
        });

        if (data) {
          resolve(true);
        } else {
          reject(false);
        }
      } catch (error) {
        console.log(error);
        toast.error(
          <Notification
            title="An error as occurred trying to send the email"
            description={error.message}
          />
        );
        setIsLoading(false);
      }
    });
  }

  function resendEmailCode() {
    setEmailVerificationCode(["", "", "", "", "", ""]);
    sendEmailVerificationCode(email);
  }

  async function verifyEmailWithCode(code: string) {
    console.log(`Verifying ${email} with code ${code}..`);

    setIsLoading(true);

    return new Promise(async (resolve, reject) => {
      if (!hasEmailChanged) {
        resolve(true);
      }

      try {
        const data = await fetch(BASE_URL_SOLO_VERIFY_CODE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            email: email,
          }),
        }).then((res) => {
          if (res.status === 200) {
            return res.json();
          }

          toast.error(
            <Notification
              title="Incorrect code"
              description={`Please insert the correct code sent to ${email}`}
            />
          );

          setEmailVerificationCode(["", "", "", "", "", ""]);
          setIsLoading(false);
          reject(false);
        });

        if (data) {
          resolve(true);
        }

        reject(false);
      } catch (error) {
        toast.error(
          <Notification
            title="An error as occurred trying to verify the code"
            description={error.message}
          />
        );

        setIsLoading(false);
      }
    });
  }

  function updateCodeValue(position: number, value: string) {
    const emailVerificationCodeCopy = [...emailVerificationCode];
    emailVerificationCodeCopy[position] = value;
    setEmailVerificationCode(emailVerificationCodeCopy);
  }

  async function getUploadURL(jwt: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const urls = fetch(BASE_URL_SOLO_GET_UPLOAD_URLS, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        }).then((res) => res.json());

        if (!urls) {
          throw new Error("Error getting upload links");
        }

        resolve(urls);
      } catch (error) {
        toast.error(<Notification title="An error as occurred" description={error.message} />);
        setIsLoading(false);
      }
    });
  }

  async function uploadImageToURL(url: string, file: any) {
    console.log("Uploading image:", {
      file,
      type: file.type,
    });

    return new Promise(async (resolve, reject) => {
      try {
        const options = {
          headers: {
            "Content-Type": file.type,
          },
        };

        axios
          .put(url, file, options)
          .then((res) => resolve(res))
          .catch((err) => {
            console.log("err", { err });
            reject(false);
          });
      } catch (error) {
        toast.error(<Notification title="An error as occurred" description={error.message} />);
        setIsLoading(false);
      }
    });
  }

  async function handleDetailsSubmit() {
    if (!hasEmailChanged) {
      setIsEmailVerified(true);
    }

    setIsLoading(true);

    const usernameValidation =
      hasUsernameChanged || !isOgUsername()
        ? await Validate.username(username)
        : { isValid: true, error: "" };
    setIsUsernameValid(usernameValidation.isValid);
    setUsernameError(usernameValidation.error);

    const descriptionValidation = await Validate.description(description);
    setIsDescriptionValid(descriptionValidation.isValid);
    setDescriptionError(descriptionValidation.error);

    const emailValidation = await Validate.email(email);
    setIsEmailValid(emailValidation.isValid);
    setEmailError(emailValidation.error);

    const discordValidation = await Validate.discord(discord);
    setIsDiscordValid(discordValidation.isValid);
    setDiscordError(discordValidation.error);

    const twitterValidation = await Validate.twitter(twitter);
    setIsTwitterValid(twitterValidation.isValid);
    setTwitterError(twitterValidation.error);

    const instagramValidation = await Validate.instagram(instagram);
    setIsInstagramValid(instagramValidation.isValid);
    setInstagramError(instagramValidation.error);

    const websiteValidation = await Validate.website(website);
    setIsWebsiteValid(websiteValidation.isValid);
    setWebsiteError(websiteValidation.error);

    const isFormValid =
      isUsernameValid &&
      isDescriptionValid &&
      isEmailValid &&
      isDiscordValid &&
      isTwitterValid &&
      isInstagramValid &&
      isWebsiteValid;

    if (!isFormValid) {
      toast.error(
        <Notification
          title="Invalid details submitted"
          description="Please fill all the fields with valid information"
        />
      );

      return;
    }

    if (!hasEmailChanged) {
      console.log("Email already verified");
      setIsEmailVerified(true);
      setIsLoading(false);
      loadNextStep();

      return;
    } else {
      setEmailVerificationCode(["", "", "", "", "", ""]);

      try {
        const hasEmailBeenSent = await sendEmailVerificationCode(email);

        if (hasEmailBeenSent) {
          console.log("hasEmailBeenSent", hasEmailBeenSent);
          setIsLoading(false);
          loadNextStep();
        }
      } catch (error) {
        toast.error(<Notification title="Error submitting details" description={error} />);
        setIsLoading(false);
      }
    }
  }

  async function handleCodeSubmit() {
    console.log("handleCodeSubmit...");

    if (isEmailVerified) {
      console.log("Email already verified!");
      loadNextStep();

      return;
    }

    setIsLoading(true);

    const codeInput = emailVerificationCode.join("");
    const hasAllDigits = codeInput.length === 6;

    if (!hasAllDigits) {
      toast.error(
        <Notification
          title="Please insert all the digits of the code"
          description="The code is composed of 6 digits"
        />
      );
      setIsLoading(false);

      return;
    }

    try {
      const isCodeValid = await verifyEmailWithCode(codeInput);

      if (isCodeValid) {
        console.log("isCodeValid", isCodeValid);

        setIsEmailVerified(true);
        setIsLoading(false);

        loadNextStep();
      }
    } catch (error) {
      toast.error(<Notification title="An error as occurred" description={error.message} />);
      setIsLoading(false);
    }
  }

  function handleCodeInputKeypress(event: any) {
    const { key, target } = event;
    const { value } = target;

    const nextInput = target.nextElementSibling;
    const previousInput = target.previousElementSibling;

    const isNumber = /[0-9]/.test(event.key);
    const isBackspace = key === "Backspace";

    if (value || !isNumber) event.preventDefault();

    if (isBackspace) {
      if (previousInput) previousInput.focus();
      return;
    }

    if (nextInput) nextInput.focus();
  }

  async function handleCreateProfile() {
    console.log("handleCreateProfile...");
    //@ts-ignore
    const authStorage: string = localStorage.getItem(`soloAuth${wallet?.publicKey.toString()}`);
    const jwt: string = JSON.parse(authStorage)["jwt_token"];

    if (!jwt) {
      return;
    }

    setIsLoading(true);

    try {
      let imagePublicUrl: string | undefined = undefined;
      let bannerPublicUrl: string | undefined = undefined;

      if (hasProfileImageChanged) {
        const imageUploadUrl: any = await getUploadURL(jwt);

        if (imageUploadUrl) {
          imagePublicUrl = imageUploadUrl["public_url"];
        }

        const imageUploadResponse: any = await uploadImageToURL(
          imageUploadUrl["upload_url"],
          profileImage
        );

        if (!imageUploadResponse) {
          throw new Error("Error trying to upload profile image.");
        }
      }

      if (hasProfileBannerChanged) {
        const bannerUploadUrl: any = await getUploadURL(jwt);

        if (bannerUploadUrl) {
          bannerPublicUrl = bannerUploadUrl["public_url"];
        }

        const bannerUploadResponse: any = await uploadImageToURL(
          bannerUploadUrl["upload_url"],
          profileBanner
        );

        if (!bannerUploadResponse) {
          throw new Error("Error trying to upload banner image.");
        }
      }

      const userData: ProfileData = {
        banner: bannerPublicUrl ? bannerPublicUrl : profileBanner,
        description: description,
        discord: discord ? discord : undefined,
        email: email,
        image: imagePublicUrl ? imagePublicUrl : profileImage,
        instagram: instagram ? instagram : undefined,
        theme: themeSelected,
        twitter: twitter ? twitter : undefined,
        username: username,
        website: website ? website : undefined,
      };

      const userAddResponse = await fetch(BASE_URL_SOLO_ADD_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + jwt,
        },
        body: JSON.stringify(userData),
      }).then(async (res) => {
        console.log("account creation response:", res);
        if (res.status === 200) {
          return res.json();
        }

        console.log("Error adding, trying update...");
        const userUpdateResponse = await fetch(BASE_URL_SOLO_UPDATE_USER, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
          body: JSON.stringify(userData),
        }).then(async (res) => {
          console.log("account update response:", res);
          if (res.ok) {
            return res.json();
          }

          toast.error(
            <Notification
              title="An error as occurred trying to create your profile"
              description="Please try again.."
            />
          );

          resetStepper();
          setIsLoading(false);
          return false;
        });

        if (userUpdateResponse) {
          setIsLoading(false);
          loadNextStep();

          return true;
        }
      });

      if (userAddResponse) {
        loadNextStep();
        toast.success(
          <Notification
            title="Profile created successfully"
            description="You can now start using Solo"
          />
        );
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(
        <Notification
          title="An error as occurred trying to create profile"
          description={error.message}
        />
      );
    }
  }

  function handleButtonNextClick() {
    if (isLastStep()) return;

    if (currentStep === "details") handleDetailsSubmit();
    if (currentStep === "verification") handleCodeSubmit();
    if (currentStep === "customization") handleCreateProfile();
  }

  function handlePreviousButtonClick() {
    if (isFirstStep()) return;

    const outAnimationDuration = animateCurrentStepOut();
    scrollToTop();
    setTimeout(() => {
      previousStep();
      animateFollowingStepIn("fromLeft");
    }, outAnimationDuration);
  }

  useEffect(() => {
    resetStepper();
  }, [wallet]);

  useEffect(() => {
    if (data) {
      setUsername(data?.username);
      setOriginalUsername(data?.username);
      setDescription(data?.description);
      setEmail(data?.email);
      setDiscord(data?.discord || "");
      setTwitter(data?.twitter || "");
      setInstagram(data?.instagram || "");
      setWebsite(data?.website || "");
      setProfileImage(data?.image);
      setProfileBanner(data?.banner);
      setThemeSelected(data?.theme);
    }
  }, [data]);

  return (
    <section className="my-20">
      {currentStep === "details" && (
        <div ref={stepsRefs.details}>
          <form
            ref={detailsFormRef}
            onSubmit={(e) => e.preventDefault()}
            className="w-full flex flex-col gap-14"
          >
            <StepperInput
              labelComponent={<UsernameInputLabel />}
              type="text"
              name="username"
              value={username}
              onFocus={() => setIsUsernameValid(true)}
              onBlur={async (e: any) => {
                const usernameValidation = !isOgUsername()
                  ? await Validate.username(username)
                  : { isValid: true, error: "" };
                setIsUsernameValid(usernameValidation.isValid);
                setUsernameError(usernameValidation.error);
              }}
              onChange={(e: any) => {
                setHasUsernameChanged(true);
                setUsername(e.target.value);
              }}
              error={usernameError}
              isValid={isUsernameValid}
              placeholder="your name to be displayed"
            />
            <StepperInput
              isTextArea
              name="description"
              type="text"
              placeholder="tell us a bit about you..."
              value={description}
              onFocus={() => setIsDescriptionValid(true)}
              onBlur={async (e: any) => {
                const descriptionValidation = await Validate.description(e.target.value);
                setIsDescriptionValid(descriptionValidation.isValid);
                setDescriptionError(descriptionValidation.error);
              }}
              onChange={(e: any) => setDescription(e.target.value)}
              isValid={isDescriptionValid}
              error={descriptionError}
              labelComponent={<DescriptionInputLabel />}
            />
            <StepperInput
              name="email"
              type="email"
              placeholder="enter an email address"
              labelComponent={<EmailInputLabel />}
              value={email}
              onFocus={() => setIsEmailValid(true)}
              onBlur={async (e: any) => {
                const emailValidation = await Validate.email(e.target.value);
                setIsEmailValid(emailValidation.isValid);
                setEmailError(emailValidation.error);
              }}
              onChange={(e: any) => {
                setIsEmailVerified(false);
                setHasEmailChanged(true);
                setEmail(e.target.value);
              }}
              error={emailError}
              isValid={isEmailValid}
            />
            <div className="flex flex-row flex-wrap gap-5 lg:flex-nowrap">
              <StepperInput
                name="discord"
                type="text"
                labelComponent={<DiscordInputLabel />}
                placeholder="discord username"
                value={discord}
                onFocus={() => setIsDiscordValid(true)}
                onBlur={async (e: any) => {
                  const discordValidation = await Validate.discord(e.target.value);
                  setIsDiscordValid(discordValidation.isValid);
                  setDiscordError(discordValidation.error);
                }}
                onChange={(e: any) => setDiscord(e.target.value)}
                error={discordError}
                isValid={isDiscordValid}
              />
              <StepperInput
                name="twitter"
                type="text"
                labelComponent={<TwitterInputLabel />}
                placeholder="twitter @"
                value={twitter}
                onFocus={() => setIsTwitterValid(true)}
                onBlur={async (e: any) => {
                  const twitterValidation = await Validate.twitter(e.target.value);
                  setIsTwitterValid(twitterValidation.isValid);
                  setTwitterError(twitterValidation.error);
                }}
                onChange={(e: any) => setTwitter(e.target.value)}
                error={twitterError}
                isValid={isTwitterValid}
              />
              <StepperInput
                name="instagram"
                type="text"
                labelComponent={<InstagramInputLabel />}
                placeholder="instagram @"
                value={instagram}
                onFocus={() => setIsInstagramValid(true)}
                onBlur={async (e: any) => {
                  const instagramValidation = await Validate.instagram(e.target.value);
                  setIsInstagramValid(instagramValidation.isValid);
                  setInstagramError(instagramValidation.error);
                }}
                onChange={(e: any) => setInstagram(e.target.value)}
                error={instagramError}
                isValid={isInstagramValid}
              />
            </div>
            <StepperInput
              name="website"
              type="url"
              labelComponent={<WebsiteInputLabel />}
              placeholder="your personal website or relevant back-link"
              value={website}
              onFocus={() => setIsWebsiteValid(true)}
              onBlur={async (e: any) => {
                const websiteValidation = await Validate.website(e.target.value);
                setIsWebsiteValid(websiteValidation.isValid);
                setWebsiteError(websiteValidation.error);
              }}
              onChange={(e: any) => setWebsite(e.target.value)}
              error={websiteError}
              isValid={isWebsiteValid}
            />
          </form>
        </div>
      )}
      {currentStep === "verification" && (
        <div ref={stepsRefs.verification} className="relative flex items-center flex-col">
          <h1 className="font-semibold text-xl">
            {isEmailVerified ? "email verified ✅" : "verification code"}
          </h1>
          {isEmailVerified ? (
            <>
              <div className="h-50 pointer-events-none flex items-center gap-3 mt-8 mb-4"></div>
            </>
          ) : (
            <>
              <form
                ref={codeFormRef}
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-3 mt-8 mb-4"
              >
                <input
                  onChange={(e: any) => {
                    updateCodeValue(e.target.dataset.codePosition, e.target.value);
                  }}
                  data-code-position={0}
                  onKeyPress={handleCodeInputKeypress}
                  value={emailVerificationCode[0]}
                  type="number"
                  ref={codeFirstInputRef}
                  className="first-code-input text-center stepper-input w-12 text-2xl font-semibold rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out"
                />
                <input
                  onKeyPress={handleCodeInputKeypress}
                  onChange={(e: any) => {
                    updateCodeValue(e.target.dataset.codePosition, e.target.value);
                  }}
                  data-code-position={1}
                  value={emailVerificationCode[1]}
                  type="number"
                  className="text-center stepper-input w-12 text-2xl font-semibold rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out"
                />
                <input
                  onKeyPress={handleCodeInputKeypress}
                  onChange={(e: any) => {
                    updateCodeValue(e.target.dataset.codePosition, e.target.value);
                  }}
                  data-code-position={2}
                  value={emailVerificationCode[2]}
                  type="number"
                  className="text-center stepper-input w-12 text-2xl font-semibold rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out"
                />
                <input
                  onKeyPress={handleCodeInputKeypress}
                  onChange={(e: any) => {
                    updateCodeValue(e.target.dataset.codePosition, e.target.value);
                  }}
                  data-code-position={3}
                  value={emailVerificationCode[3]}
                  type="number"
                  className="text-center stepper-input w-12 text-2xl font-semibold rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out"
                />
                <input
                  onKeyPress={handleCodeInputKeypress}
                  onChange={(e: any) => {
                    updateCodeValue(e.target.dataset.codePosition, e.target.value);
                  }}
                  data-code-position={4}
                  value={emailVerificationCode[4]}
                  type="number"
                  className="text-center stepper-input w-12 text-2xl font-semibold rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out"
                />
                <input
                  onKeyPress={handleCodeInputKeypress}
                  onChange={(e: any) => {
                    updateCodeValue(e.target.dataset.codePosition, e.target.value);
                  }}
                  data-code-position={5}
                  value={emailVerificationCode[5]}
                  type="number"
                  className="text-center stepper-input w-12 text-2xl font-semibold rounded-md focus:outline-none focus:border-blue-500 transition ease-in-out"
                />
              </form>
              <button
                className="bg-none p-2 text-sm text-gray-500 hover:text-white"
                onClick={resendEmailCode}
              >
                resend code
              </button>
            </>
          )}
        </div>
      )}
      {currentStep === "customization" && (
        <div ref={stepsRefs.customization} className="flex items-center flex-col">
          <h1 className="font-semibold text-xl">profile image & banner</h1>
          <ProfileImagesUploader
            profileBanner={profileBanner}
            profileImage={profileImage}
            setProfileBanner={setProfileBanner}
            setProfileImage={setProfileImage}
            setHasProfileImageChanged={setHasProfileImageChanged}
            setHasProfileBannerChanged={setHasProfileBannerChanged}
            username={username}
            description={description}
            discord={discord ? discord : undefined}
            twitter={twitter ? twitter : undefined}
            instagram={instagram ? instagram : undefined}
            website={website ? website : undefined}
          />
          <h1 className="font-semibold text-xl mt-10">profile page theme</h1>
          <ThemeSelector themeSelected={themeSelected} setThemeSelected={setThemeSelected} />
        </div>
      )}
      {currentStep === "outro" && (
        <div ref={stepsRefs.outro} className="flex items-center flex-col">
          <h1 className="font-normal text-2xl">
            hey <span className="font-semibold">{username}</span>!
          </h1>
          <img
            src={profileImage}
            alt={`${username} profile image`}
            className="rounded-full h-48 w-48 mx-auto my-10"
          />
          <span>welcome to #solo on DigitalEyes</span>
          <Link
            to={"/solo-profile/" + username}
            className="bg-blue-600 font-semibold mx-auto my-10 rounded-md py-4 px-12 text-white"
          >
            VISIT PROFILE
          </Link>
        </div>
      )}
      <section className="my-20 flex w-full justify-between">
        {!isLastStep() && (
          <>
            <button
              onClick={handlePreviousButtonClick}
              className={
                "text-sm py-4 px-12 bg-gray-600 rounded-md transition ease-in-out hover:bg-gray-700" +
                (isFirstStep() ? "pointer-events-none blur-3xl opacity-0" : "")
              }
            >
              {previousButtonText}
            </button>
            <button
              onClick={handleButtonNextClick}
              className={
                "text-sm py-4 px-12 bg-blue-600 text-black font-semibold rounded-md transition ease-in-out hover:bg-blue-400" +
                (isLastStep() ? "pointer-events-none blur-3xl cursor-not-allowed opacity-5" : "")
              }
            >
              {!isLoading ? nextButtonText : "loading..."}
            </button>
          </>
        )}
      </section>
    </section>
  );
};

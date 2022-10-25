import { useEffect, useRef, useState } from "react";
import { extension } from "mime-types";
import { DownloadIcon } from "@heroicons/react/outline";

import "./styles.css";
import { ProfileLink } from "./ProfileLink";

interface ProfileImagesUploaderProps {
  profileBanner: string;
  profileImage: string;
  setProfileBanner: (image: string) => void;
  setProfileImage: (image: string) => void;
  setHasProfileBannerChanged: (value: boolean) => void;
  setHasProfileImageChanged: (value: boolean) => void;
  username: string;
  description: string;
  discord?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

export const ProfileImagesUploader: React.FC<ProfileImagesUploaderProps> = ({
  profileBanner,
  profileImage,
  setProfileBanner,
  setProfileImage,
  setHasProfileBannerChanged,
  setHasProfileImageChanged,
  username,
  description,
  discord,
  twitter,
  instagram,
  website,
}) => {
  const [isDraggingOverBanner, setIsDraggingOverBanner] = useState<boolean>(false);
  const [isDraggingOverProfile, setIsDraggingOverProfile] = useState<boolean>(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  function onBannerLoad(event: any) {
    const file = event?.target?.files[0];
    setHasProfileBannerChanged(true);
    setProfileBanner(file);
  }

  function onPfpLoad(event: any) {
    const file = event?.target?.files[0];
    setHasProfileImageChanged(true);
    setProfileImage(file);
  }

  return (
    <section className="pb-10 w-full my-10 bg-gray-700 bg-opacity-5 rounded-md stepper-profile-container">
      <div
        className={`group stepper-draggable-container relative w-full flex items-center justify-center pt-12 pb-36 rounded-md outlined-container ${
          isDraggingOverBanner && "outlined-container_hover"
        }`}
        onMouseEnter={() => setIsDraggingOverBanner(true)}
        onMouseLeave={() => setIsDraggingOverBanner(false)}
      >
        <input
          type="file"
          className={"stepper-draggable-input"}
          name="stepper-banner-input"
          ref={bannerInputRef}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setIsDraggingOverBanner(true);
          }}
          onDragLeave={(e) => {
            setIsDraggingOverBanner(false);
          }}
          onDrop={onBannerLoad}
          onChange={onBannerLoad}
        />
        {profileBanner ? (
          <img
            src={profileBanner}
            className="stepper-banner-image rounded-md"
            alt="Profile banner"
          />
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <DownloadIcon className="w-8 h-8 text-gray-600" />
            <span className="font-normal text-xs">
              <button
                onClick={() => bannerInputRef.current?.click()}
                className="font-semibold group-hover:underline"
              >
                choose a banner
              </button>{" "}
              or drag it here
            </span>
          </div>
        )}
      </div>
      <div
        className={`z-50 transform -translate-y-1/2 mx-auto group stepper-draggable-container relative w-48 h-48 flex items-center justify-center p-12 rounded-full ${
          isDraggingOverProfile && "outlined-container_hover"
        } ${!profileImage && "outlined-container"}`}
        onMouseEnter={() => setIsDraggingOverProfile(true)}
        onMouseLeave={() => setIsDraggingOverProfile(false)}
      >
        <input
          type="file"
          className={"stepper-draggable-input"}
          name="stepper-profile-input"
          ref={profileInputRef}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();

            setIsDraggingOverProfile(true);
          }}
          onDragLeave={(e) => {
            setIsDraggingOverProfile(false);
          }}
          onDrop={onPfpLoad}
          onChange={onPfpLoad}
        />
        {profileImage ? (
          <img
            src={profileImage}
            className="stepper-banner-image rounded-full"
            alt="Profile image"
          />
        ) : (
          <div className="flex flex-col gap-2 items-center">
            <DownloadIcon className="w-8 h-8 text-gray-600" />
            <span className="font-light text-xs text-center">
              <button
                onClick={() => profileInputRef.current?.click()}
                className="font-semibold group-hover:underline"
              >
                choose a pfp
              </button>{" "}
              or drag it here
            </span>
          </div>
        )}
      </div>
      <h1 className="transform -translate-y-12 text-4xl text-white text-center font-semibold">
        {username}
      </h1>
      <p className="transform -translate-y-6 text-sm text-gray-500 text-center font-base max-w-prose mx-auto break-words">
        {description}
      </p>
      <div className="flex items-center justify-center gap-8 w-full my-5">
        {discord && <ProfileLink isClipboard username={discord} social={"discord"} />}
        {twitter && (
          <ProfileLink
            link={`https://twitter.com/${twitter}`}
            username={twitter}
            social={"twitter"}
          />
        )}
        {instagram && (
          <ProfileLink
            link={`https://www.instagram.com/${instagram.replace("@", "")}/`}
            username={instagram}
            social={"instagram"}
          />
        )}
        {website && <ProfileLink link={website} username={website} social={"website"} />}
      </div>
    </section>
  );
};

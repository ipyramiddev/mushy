import { IMAGE_KIT_ENDPOINT_OLDURL } from "../../constants/images";
// @ts-ignore
import { IKImage } from "imagekitio-react";
import { ShieldCheckIcon } from "@heroicons/react/solid";

export const VerifeyedBadge: React.FC = () => {
  return (
    <span className="flex items-center text-sm sm:text-base">
      <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
      <span className="relative top-px">Verifeyed</span>
    </span>
  );
};

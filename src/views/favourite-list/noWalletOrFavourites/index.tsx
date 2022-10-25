import React from "react";
import { TopCollections } from "../../../components/TopCollections";

interface NoWalletOrFavouritesProps {
  title: string;
  description: string;
}

export const NoWalletOrFavourites = ({ title, description }: NoWalletOrFavouritesProps) => {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 text-2xl md:text-4xl uppercase font-black py-6 md:py-10 mx-auto text-center">
        {title}
      </div>
      <div className="max-w-2xl font-light px-4 sm:px-6 lg:px-8 mx-auto mb-24">{description}</div>
      <TopCollections />
    </>
  );
};

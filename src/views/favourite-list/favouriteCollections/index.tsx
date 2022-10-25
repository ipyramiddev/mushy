import React from "react";
import { useCollections } from "../../../contexts/collections";
import { findCollection } from "../../../utils";
import { FavouriteCard } from "../../../components/FavouriteCard";

interface CurrentFavListProps {
  currentFavList: [];
}

export const FavouriteCollections = ({ currentFavList }: CurrentFavListProps) => {
  const { collections, topCollections, isLoading: isLoadingCollections } = useCollections();
  return (
    <>
      <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl uppercase font-black">Your Favourite Collections</h1>
        {currentFavList.length > 0 ? (
          <ul className="grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 pb-6 pt-8">
            {currentFavList.map((collectionName: string, index: number) => {
              const currentCollection = findCollection(
                [...collections, ...topCollections],
                collectionName
              );
              return (
                !isLoadingCollections && (
                  <FavouriteCard key={index} collection={currentCollection} />
                )
              );
            })}
          </ul>
        ) : (
          <div className="font-light px-4 sm:px-6 lg:px-8 mx-auto pt-8">
            No favourite collections to show
          </div>
        )}
      </div>
    </>
  );
};

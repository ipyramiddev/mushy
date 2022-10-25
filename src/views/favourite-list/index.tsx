import React from "react";
import { Page } from "../../components/Page";
import { useWallet } from "../../contexts/wallet";
import { getAllFavorites } from "../../utils";
import { FavoriteOffers } from "./favoritesOffers";
import { FavouriteCollections } from "./favouriteCollections";
import { NoWalletOrFavourites } from "./noWalletOrFavourites";

export const FavouriteListView = () => {
  const { publicKey } = useWallet();
  const currentFavList = localStorage.getItem(`favList:${publicKey}`)
    ? JSON.parse(localStorage.getItem(`favList:${publicKey}`) as string)
    : [];
  const favorites = getAllFavorites();

  return (
    <Page>
      <div className={"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {publicKey ? (
          currentFavList.length + favorites.length > 0 ? (
            <>
              <FavouriteCollections currentFavList={currentFavList} />
              <FavoriteOffers />
            </>
          ) : (
            <NoWalletOrFavourites
              title={"You have no favourite collections"}
              description={
                "You currently have no favourite collections, Don't worry though you can explore some of our top collections below 👇 and add some to your list!"
              }
            />
          )
        ) : (
          <NoWalletOrFavourites
            title={"Wallet not connected"}
            description={
              "Sorry we can't display your favourite collections without a wallet connected! Don't worry though even without a wallet you can explore some of our top collections below 👇"
            }
          />
        )}
      </div>
    </Page>
  );
};

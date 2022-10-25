import { ActiveOffer } from "../types";

export const itemIsFavorite = (offer: ActiveOffer) => {
  const favorites = JSON.parse(localStorage.getItem("de:favorites") as string) || [];
  const mints = favorites.map((item: ActiveOffer) => item.mint);
  return mints.includes(offer.mint);
};

export const handlerFavorites = (event: React.MouseEvent<HTMLButtonElement>, offer: ActiveOffer) => {
  console.log(event);
  event.stopPropagation();
  let favorites = <ActiveOffer[]>[];
  favorites = JSON.parse(localStorage.getItem("de:favorites") as string) || [];
  const alreadyFavorited = favorites.filter(fav => fav.mint == offer.mint);
  if( alreadyFavorited.length ) {
    favorites = favorites.filter(fav => fav.mint != offer.mint);
  } else {
    favorites.push(offer);
  }
  localStorage.setItem("de:favorites", JSON.stringify(favorites));
  return itemIsFavorite(offer);
};

export const getAllFavorites = () => {
  const favorites = localStorage.getItem("de:favorites");
  if (favorites) {
    return JSON.parse(favorites);
  }
  return [];
};

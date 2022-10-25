import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/outline";
import { useWallet } from "../../contexts/wallet";
import { Notification } from "../Notification";

export interface FavouriteButtonProps {
  currentCollectionName: any;
}

export type PublicKey = string[];

export interface FavouriteListProps {
  PublicKey: PublicKey;
}

export const FavouriteButton = ({ currentCollectionName }: FavouriteButtonProps) => {
  const { publicKey, connect } = useWallet();
  const [isCollectionInFavList, setIsCollectionInFavList] = useState<boolean>();
  const [currentFavList, setCurrentFavList] = useState(
    localStorage.getItem(`favList:${publicKey}`)
      ? JSON.parse(localStorage.getItem(`favList:${publicKey}`) as string)
      : []
  );

  useEffect(() => {
    setCurrentFavList(
      localStorage.getItem(`favList:${publicKey}`)
        ? JSON.parse(localStorage.getItem(`favList:${publicKey}`) as string)
        : []
    );
  }, [currentCollectionName, publicKey]);

  useEffect(() => {
    setIsCollectionInFavList(
      Boolean(currentFavList.find((d: string) => d === currentCollectionName))
    );
  }, [currentCollectionName, currentFavList]);

  const getWallet = () => {
    if (publicKey) {
      updateList();
    } else {
      connect();
    }
  };

  const updateList = () => {
    let updatedFavList;
    if (isCollectionInFavList) {
      updatedFavList = JSON.stringify(
        currentFavList.filter((d: string) => {
          return d === currentCollectionName ? null : d;
        })
      );
      localStorage.setItem(`favList:${publicKey}`, updatedFavList);
      setIsCollectionInFavList(false);
      toast.success(
        <Notification
          title="Success!"
          description={`${currentCollectionName} is now removed as a favourite collection`}
        />
      );
    } else {
      updatedFavList = JSON.stringify([...currentFavList, currentCollectionName]);
      localStorage.setItem(`favList:${publicKey}`, updatedFavList);
      setIsCollectionInFavList(true);
      toast.success(
        <Notification
          title="Success!"
          description={`${currentCollectionName} is now added as a favourite collection`}
        />
      );
    }
  };

  return (
    <button onClick={getWallet} className="py-2 px-3 bg-gray-600 rounded-md">
      {isCollectionInFavList ? (
          <span className="flex items-center text-xxs">
            <HeartIconSolid className="text-red-400 h-4 w-4 mr-1 focus:outline-none" />
            <span className="relative text-white">Favorite Collection</span>
          </span>
        ) : (
          <span className="flex items-center text-xxs">
            <HeartIconOutline className="text-gray-400 h-4 w-4 mr-1 focus:outline-none hover:text-red-400" /> 
            <span className="relative">Add Collection to Favorites</span>
          </span>
        )}
    </button>
  );
};

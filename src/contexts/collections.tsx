import React, { useEffect, useState } from "react";
import { BASE_URL_COLLECTIONS_RETRIEVER } from "../constants/urls";
import { sortBy } from "../utils";
import { Collection } from "../types";
import { UNVERIFEYED_COLLECTION_OPTION } from "../constants/collections";

export interface CollectionsContextInterface {
  collections: Collection[];
  topCollections: Collection[];
  isLoading: boolean;
}

const CollectionsContext = React.createContext<CollectionsContextInterface>({
  collections: [],
  topCollections: [],
  isLoading: false,
});

export function CollectionsProvider({ children = null as any }) {
  const [state, setState] = useState<CollectionsContextInterface>({
    collections: [],
    topCollections: [],
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      const collectionsPromise = await fetch(BASE_URL_COLLECTIONS_RETRIEVER);
      const collectionsAsJson = [
        ...(await collectionsPromise.json()),
        UNVERIFEYED_COLLECTION_OPTION,
      ];
      // @ts-ignore
      const collections = sortBy(
        collectionsAsJson.filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i),
        "name"
      );
      const topCollections = collections.filter((collection) => collection.isCurated);
      setState({
        collections: collections.filter((collection) => !collection.isCurated),
        topCollections,
        isLoading: false,
      });
    })();
  }, []);

  return <CollectionsContext.Provider value={state}>{children}</CollectionsContext.Provider>;
}

export const useCollections = () => {
  return React.useContext(CollectionsContext);
};

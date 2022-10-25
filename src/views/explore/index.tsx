import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LoadingWidget } from "../../components/loadingWidget";
import { Page } from "../../components/Page";
import { Collection } from "../../types";
import { useCollections } from "../../contexts/collections";
import { useConnection, useConnectionConfig } from "../../contexts/connection";
import { CollectionCard } from "../../components/CollectionCard";

import { classNames } from "../../utils";
import { UNVERIFEYED_COLLECTION_OPTION } from "../../constants/collections";


export const ExploreView = () => {
  const { collections, isLoading: isCollectionsLoading } = useCollections();

  return (
    <Page>
      <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
          <div className="pt-16 sm:pt-12 mb-10">
            <div className="relative text-center">
              <h1 className="h1">Explore All Collections</h1>
            </div>
          </div>
        </div>

        {isCollectionsLoading ? (
          <div className="flex justify-center">
            <div className="w-48">
              <LoadingWidget />
            </div>
          </div>
        ) : (
          <div className="max-w-7xl px-0 sm:px-4 lg:px-0 mx-6 sm:mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-8 mb-2 md:mb-4">
            {collections.map((collection: Collection, index: number) => (
              <CollectionCard collection={collection} verifeyed={collection.name !== UNVERIFEYED_COLLECTION_OPTION.name} />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
};

import { useEffect, useState } from "react";
import { useConnection, useOpenConnection } from "../../../contexts/connection";
import { getAllFavorites } from "../../../utils";
import { ActiveOffer } from "../../../types";
import { NftCard } from "../../../components/NftCard";
import { LoadingWidget } from "../../../components/loadingWidget";
import { NftModalBuyView } from "../../../components/NftModalBuyView";

export const FavoriteOffers = () => {
  const connection = useConnection();
  const favorites = getAllFavorites();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const openConnection = useOpenConnection();
  const [offer, setOffer] = useState<ActiveOffer>();
  const [modalCard, setModalCard] = useState(true);

  const modalCardToggleHandler = () => {
    if (modalCard) {
      setModalCard(false);
    } else {
      setModalCard(true);
    }
  };

  const handleClick = (offer: ActiveOffer) => () => {
    setOffer(offer);
    setModalCard(true);
  };

  useEffect(() => {
    openConnection();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const items: any = await Promise.all(
          favorites.map(async (favorite: ActiveOffer) => {
            return favorite;
          })
        );
        console.log(items);
        setNfts(items);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    })();
  }, [connection]);

  return (
    <>
      <div className="max-w-7xl mx-auto pt-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl uppercase font-black">Your Favorite NFTs</h1>

        {loading && (
          <span className="w-36 flex items-center pt-20">
            <LoadingWidget />
          </span>
        )}
        {nfts.length ? (
          <ul className="grid gap-4 md:gap-6 lg:gap-8 md:grid-cols-3 lg:grid-cols-4 grid-cols-1 sm:grid-cols-2 pb-6 pt-8">
            {nfts.map((nft, index) => (
              <NftCard 
                key={index} 
                offer={nft} 
                // onClick={handleClick(nft)}
                />
            ))}
          </ul>
        ) : (
          <div className="font-light px-4 sm:px-6 lg:px-8 mx-auto pt-8">
            No favourite NFTs to show
          </div>
        )}
      </div>
      {modalCard && offer && (
        <NftModalBuyView
          offer={offer}
          modalCard={modalCard}
          modalCardToggleHandler={modalCardToggleHandler}
          disputedMessage={""}
        />
      )}
    </>
  );
};

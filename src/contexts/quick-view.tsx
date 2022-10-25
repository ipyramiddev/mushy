import { createContext, useRef, useState } from "react";
import { QuickView } from "../components/QuickView";
import { ActiveOffer } from "../types";

interface IQuickViewContextProvider {
  children: React.ReactNode;
}

interface IQuickViewContext {
  isQuickViewOpen: boolean;
  open: (offer: ActiveOffer) => void;
  close: () => void;
}

const QuickViewContext = createContext({} as IQuickViewContext);

export function QuickViewContextProvider({ children }: IQuickViewContextProvider) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState<boolean>(false);
  const [nftData, setNftData] = useState<ActiveOffer | null>(null);

  const open = (offer: ActiveOffer) => {
    setNftData(offer);
    setIsQuickViewOpen(true);
  };

  const close = () => {
    setNftData(null);
    setIsQuickViewOpen(false);
  };

  return (
    <QuickViewContext.Provider value={{ isQuickViewOpen, open, close }}>
      <>
        {children}
        {isQuickViewOpen && nftData && <QuickView nftData={nftData} />}
      </>
    </QuickViewContext.Provider>
  );
}

export default QuickViewContext;

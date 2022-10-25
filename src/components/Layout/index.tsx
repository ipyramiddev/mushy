import React, { useState } from "react";
import { AppBar } from "../AppBar";
import Disclaimer from "../Disclaimer";
import { Footer } from "../Footer";

const DISCLAIMER_LOCAL_STORAGE_KEYS = {
  alpha: "digitalEyesAlphaDisclaimerClosed",
};

// !!!! If you change the disclaimer message, please don't forget to change the following storage key.
const CURRENT_DISCLAIMER_KEY = "alpha";

export const Layout = React.memo((props: any) => {
  const showDisclaimerLocalStorage =
    localStorage.getItem(DISCLAIMER_LOCAL_STORAGE_KEYS[CURRENT_DISCLAIMER_KEY]) !== "true";
  const [showDisclaimer, setShowDisclaimer] = useState(showDisclaimerLocalStorage);

  const closeDisclaimer = () => {
    localStorage.setItem(DISCLAIMER_LOCAL_STORAGE_KEYS[CURRENT_DISCLAIMER_KEY], "true");
    setShowDisclaimer(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      {showDisclaimer && <Disclaimer closeDisclaimer={closeDisclaimer} />}
      <main className="bg-color-main-tertiary flex-1">{props.children}</main>
      <Footer />
    </div>
  );
});

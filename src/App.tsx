import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./assets/styles/app.css";
import { Layout } from "./components/Layout";
import { LocalStorageValueTheme, LOCAL_STORAGE_KEY_THEME } from "./constants/local-storage";
import * as ROUTES from "./constants/routes";
import { AccountsProvider } from "./contexts/accounts";
import { CollectionsProvider } from "./contexts/collections";
import { ConnectionProvider } from "./contexts/connection";
import { WalletProvider } from "./contexts/wallet";
import { QuickViewContextProvider } from "./contexts/quick-view";
import {
  CollectionsView,
  FaqView,
  PressView,
  ItemView,
  WalletView,
  CreateMintView,
  PresaleView,
  SoloProfileView,
} from "./views";
import { NotFoundView } from "./views/404";
import { FeedbackView } from "./views/feedback";
import { FavouriteListView } from "./views/favourite-list";
import { HomeView } from "./views/home";
import { SoloView } from "./views/solo";
import { SoloSettingsView } from "./views/solo-settings";
import { ExploreView } from "./views/explore";
import { SoloCreationContextProvider } from "./contexts/solo-creation";
import { ArtCreateView } from "./views/artCreate";
import { AudioContextProvider } from "./contexts/audio";
import { ProductsView } from "./views/products";
import "@fontsource/montserrat";

function App() {
  const setTheme = (themeName: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_THEME, themeName);
    document.documentElement.className = themeName;
  };

  // Immediately invoked function to default the theme to dark while we don't have a theme switcher
  (function () {
    setTheme(LocalStorageValueTheme.DARK);
  })();

  return (
    <>
      <Router>
        <AudioContextProvider>
          <SoloCreationContextProvider>
            <QuickViewContextProvider>
              <CollectionsProvider>
                <ConnectionProvider>
                  <WalletProvider>
                    <AccountsProvider>
                      <Layout>
                        <Switch>
                          <Route
                            path={`${ROUTES.COLLECTIONS}/:collectionName?`}
                            component={CollectionsView}
                          />
                          <Route exact path={ROUTES.WALLET} children={<WalletView />} />
                          <Route exact path={ROUTES.FAQ} children={<FaqView />} />
                          <Route exact path={ROUTES.LAUNCHPAD} children={<CreateMintView />} />
                          {/* <Route exact path={ROUTES.LAUNCHPAD_PRESALE} children={<PresaleView />} /> */}
                          <Route exact path={ROUTES.PRESS} children={<PressView />} />
                          <Route
                            exact
                            path={`${ROUTES.ITEM}/:collection?/:mint`}
                            children={<ItemView />}
                          />
                          <Route exact path={ROUTES.HOME} component={HomeView} />
                          <Route exact path={ROUTES.EXPLORE} component={ExploreView} />
                          <Route exact path={ROUTES.SOLO} component={SoloView} />
                          <Route exact path={ROUTES.SOLO_SETTINGS} component={SoloSettingsView} />
                          <Route exact path={ROUTES.MINT} component={ArtCreateView} />
                          <Route
                            exact
                            path={`${ROUTES.SOLOPROFILE}/:artist`}
                            children={<SoloProfileView />}
                          />
                          <Route exact path={ROUTES.FAVOURITE_LIST} component={FavouriteListView} />
                          <Route exact path={ROUTES.FEEDBACK} children={<FeedbackView />} />
                          <Route exact path={`${ROUTES.ITEM}/:mint`} children={<ItemView />} />
                          {/* console.log({ROUTES.PRODUCTS}); */}
                          <Route exact path={ROUTES.PRODUCTS} component={ProductsView} />

                          <Route component={NotFoundView} />
                        </Switch>
                      </Layout>
                    </AccountsProvider>
                  </WalletProvider>
                </ConnectionProvider>
              </CollectionsProvider>
            </QuickViewContextProvider>
          </SoloCreationContextProvider>
        </AudioContextProvider>
      </Router>
    </>
  );
}

export default App;

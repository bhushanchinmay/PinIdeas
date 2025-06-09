import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  newspaperOutline,
  searchOutline,
  personCircleOutline,
  createOutline,
  trendingUpOutline,
} from "ionicons/icons";
import React, { lazy, Suspense } from "react"; // Added lazy and Suspense
import { IonSpinner } from "@ionic/react"; // Optional: for a nicer loader

// Lazy load page components
const News = lazy(() => import("./pages/Tabs/News"));
const Trending = lazy(() => import("./pages/Tabs/Trending"));
const Submit = lazy(() => import("./pages/Tabs/Submit"));
const Search = lazy(() => import("./pages/Tabs/Search"));
const Profile = lazy(() => import("./pages/Tabs/Profile"));
const EditProfile = lazy(() => import("./pages/Auth/EditProfile"));
const Link = lazy(() => import("./pages/Link"));
const Login = lazy(() => import("./pages/Auth/Login"));
const Signup = lazy(() => import("./pages/Auth/Signup"));
const Forgot = lazy(() => import("./pages/Auth/Forgot"));

import useAuth from "./hooks/useAuth";
import UserContext from "./contexts/userContext";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

const App = () => {
  const [user, setUser] = useAuth();
  return (
    <IonApp>
      <IonReactRouter>
        <UserContext.Provider value={{ user, setUser }}>
          <IonTabs>
            <Suspense fallback={<IonSpinner name="dots" />}>
              <IonRouterOutlet>
                <Route
                  path="/"
                  render={() => <Redirect to="/news" />}
                  exact={true}
                />
                <Route path="/news" component={News} />
                <Route path="/trending" component={Trending} />
                <Route path="/submit" component={Submit} />
                <Route path="/search" component={Search} />
                <Route path="/profile" component={Profile} />
                <Route path="/edit-profile" component={EditProfile} />
                <Route path="/register" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot" component={Forgot} />
                <Route path="/link/:linkId" component={Link} />
                <Route component={() => <Redirect to="/news" />} />
              </IonRouterOutlet>
            </Suspense>
            <IonTabBar slot="bottom">
              <IonTabButton tab="news" href="/news">
                <IonIcon icon={newspaperOutline} />
                <IonLabel>PinIdeas</IonLabel>
              </IonTabButton>
              <IonTabButton tab="trending" href="/trending">
                <IonIcon icon={trendingUpOutline} />
                <IonLabel>Trending</IonLabel>
              </IonTabButton>
              <IonTabButton tab="submit" href="/submit">
                <IonIcon icon={createOutline} />
                <IonLabel>Submit</IonLabel>
              </IonTabButton>
              <IonTabButton tab="search" href="/search">
                <IonIcon icon={searchOutline} />
                <IonLabel>Search</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/profile">
                <IonIcon icon={personCircleOutline} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </UserContext.Provider>
      </IonReactRouter>
    </IonApp>
  );
};
export default App;

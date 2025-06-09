import React from "react";
import firebase from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

function useAuth() {
  const [authUser, setAuthUser] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return [authUser, setAuthUser];
}

export default useAuth;

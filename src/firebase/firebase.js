import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "./config";

class Firebase {
  constructor() {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }

  async register(name, email, password) {
    const newUserCredential = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    );
    await updateProfile(newUserCredential.user, {
      displayName: name,
    });
  }

  login(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  resetPassword(email) {
    return sendPasswordResetEmail(this.auth, email);
  }
}

const firebase = new Firebase();
export default firebase;

import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCgZGQQZIfM1CQLvZIyh7QZGhBTaOzyxkk",
  authDomain: "quill-blogs.firebaseapp.com",
  projectId: "quill-blogs",
  storageBucket: "quill-blogs.appspot.com",
  messagingSenderId: "388244056071",
  appId: "1:388244056071:web:25c0a5b51d2a643b4a22a2"
};

const app = initializeApp(firebaseConfig);

// @google auth

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {

  let user = null;
  
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((error) => console.log(error));

  return user;
};

export const storage = getStorage(app);
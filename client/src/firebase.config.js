// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDhl2343UOtDaFI8YY_oHYzfP8YTV5u82M",
  authDomain: "carrental-7e62b.firebaseapp.com",
  projectId: "carrental-7e62b",
  storageBucket: "carrental-7e62b.appspot.com",
  messagingSenderId: "697810607917",
  appId: "1:697810607917:web:5296f5cf8f10195c3d3da4",
  measurementId: "G-BEDV2YQD38",
  };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
export let auth = firebase.auth();

// export const auth = getAuth(app);
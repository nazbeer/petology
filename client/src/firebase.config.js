// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDhFsZtrsRSgLM4GF1LduR1Yfs1hXlPukQ",
  authDomain: "petologynz-25790.firebaseapp.com",
  projectId: "petologynz-25790",
  storageBucket: "petologynz-25790.appspot.com",
  messagingSenderId: "152277664095",
  appId: "1:152277664095:web:582c1724f211d3a03cb6ea",
  measurementId: "G-44RPHTQTGZ",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
firebase.initializeApp(firebaseConfig);
export let auth = firebase.auth();

// export const auth = getAuth(app);

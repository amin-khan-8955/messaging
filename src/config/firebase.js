// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOr_goCLbII5erZFCVGum9Gl3K7ubSsEs",
  authDomain: "massaging-app-e780c.firebaseapp.com",
  projectId: "massaging-app-e780c",
  storageBucket: "massaging-app-e780c.appspot.com",
  messagingSenderId: "355622819340",
  appId: "1:355622819340:web:5c4a3deffc709ba82c0029",
  measurementId: "G-014ETV1V2V"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRYx-dPPRIOsSZkyM8y-wQQrco8L2Pufw",
  authDomain: "pickle-28e79.firebaseapp.com",
  databaseURL: "https://pickle-28e79-default-rtdb.firebaseio.com",
  projectId: "pickle-28e79",
  storageBucket: "pickle-28e79.firebasestorage.app",
  messagingSenderId: "649234349144",
  appId: "1:649234349144:web:4029e31b3f1249a8365e2d",
  measurementId: "G-FYDNLTDNH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
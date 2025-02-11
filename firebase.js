// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmQU48Wg-D8sNUObXnkluxllBXGIfkYyE",
  authDomain: "projectsync-c6df1.firebaseapp.com",
  projectId: "projectsync-c6df1",
  storageBucket: "projectsync-c6df1.firebasestorage.app",
  messagingSenderId: "575659215925",
  appId: "1:575659215925:web:f367cc1009585aaca6b57c",
  measurementId: "G-3Z10CVSGZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgNVFTyuLIrunp-Dys9hZm8Ea0bEktMMg",
  authDomain: "projectsync-36cfd.firebaseapp.com",
  projectId: "projectsync-36cfd",
  storageBucket: "projectsync-36cfd.firebasestorage.app",
  messagingSenderId: "66197779113",
  appId: "1:66197779113:web:aff3b820082b11fef02fb8",
  measurementId: "G-BPGL0H8S50"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCEl1u7vaGXImEHHYwr1iGTb1FnkQA58E4",
    authDomain: "univer-com.firebaseapp.com",
    projectId: "univer-com",
    storageBucket: "univer-com.firebasestorage.app",
    messagingSenderId: "451149143090",
    appId: "1:451149143090:web:88d48190e9603428c7702b",
    measurementId: "G-Q4V9LF9193"
  };

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const storage = getStorage(app);

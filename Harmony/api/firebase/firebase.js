// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCnE6vNazFfza_AWvZGYyGdTZFsdtfuC6I',
  authDomain: 'harmony-54a2c.firebaseapp.com',
  projectId: 'harmony-54a2c',
  storageBucket: 'harmony-54a2c.appspot.com',
  messagingSenderId: '341383604742',
  appId: '1:341383604742:web:ed5d8e68743eefb6447187',
  measurementId: 'G-KSN735Z4NQ',
};
// Initialize Firebase
export const APP_FIREBASE = initializeApp(firebaseConfig);
export const AUTH_FIREBASE = getAuth(APP_FIREBASE);
export const DB_FIREBASE = getFirestore(APP_FIREBASE);
export const STORAGE = getStorage(APP_FIREBASE);

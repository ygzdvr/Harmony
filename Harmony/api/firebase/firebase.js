// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCxLEomeMYogKfKushwMFKu16uppr7qHbo',
  authDomain: 'harmonydeploy.firebaseapp.com',
  projectId: 'harmonydeploy',
  storageBucket: 'harmonydeploy.appspot.com',
  messagingSenderId: '672023419118',
  appId: '1:672023419118:web:c217515883324083cbbbff',
  measurementId: 'G-9L3G30LLCW',
};
// Initialize Firebase
export const APP_FIREBASE = initializeApp(firebaseConfig);

initializeAuth(APP_FIREBASE, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const AUTH_FIREBASE = getAuth();
export const DB_FIREBASE = getFirestore(APP_FIREBASE);
export const STORAGE = getStorage(APP_FIREBASE);

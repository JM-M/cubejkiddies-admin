// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDEJgKXiNvQ3WeWiZnOxtBFjmI12URkTv0',
  authDomain: 'cubejempire-d3b66.firebaseapp.com',
  projectId: 'cubejempire-d3b66',
  storageBucket: 'cubejempire-d3b66.appspot.com',
  messagingSenderId: '800535357609',
  appId: '1:800535357609:web:ea762edf6389bf9e49e1b8',
  measurementId: 'G-PXLW61X650',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// connectAuthEmulator(auth, 'http://127.0.0.1:9099');
// const analytics = getAnalytics(app);
export default app;

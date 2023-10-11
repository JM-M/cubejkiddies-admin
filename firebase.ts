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
  apiKey: "AIzaSyATm84QvMD8f8CHAj23vvJCw1UfPaA-T_M",
  authDomain: "cubejempire-1.firebaseapp.com",
  projectId: "cubejempire-1",
  storageBucket: "cubejempire-1.appspot.com",
  messagingSenderId: "511166037146",
  appId: "1:511166037146:web:ed79c220c6b5fd7701b323",
  measurementId: "G-5MEJJ2249R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
// connectAuthEmulator(auth, 'http://127.0.0.1:9099');
// const analytics = getAnalytics(app);
export default app;

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCMkJwvNisr2OTLfg619o245QPQYZ4jqtA",
  authDomain: "scrapauth.firebaseapp.com",
  projectId: "scrapauth",
  storageBucket: "scrapauth.appspot.com",
  messagingSenderId: "195227893076",
  appId: "1:195227893076:web:3b9b4e268eaaf34c0a9cc1"
};

const app = initializeApp(firebaseConfig);
const scrapauth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { scrapauth, db, storage };


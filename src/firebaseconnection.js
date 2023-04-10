import {initializeApp} from 'firebase/app'
import { getFirestore, getAnalytics} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBDk_rhQA664XusmbfegZ9zXm3DVTlFtu8",
  authDomain: "curso-4b503.firebaseapp.com",
  projectId: "curso-4b503",
  storageBucket: "curso-4b503.appspot.com",
  messagingSenderId: "1015181324865",
  appId: "1:1015181324865:web:a16ec5ce2d43d318e18cc0",
  measurementId: "G-M90K1TCZ95"
};

  const firebaseApp = initializeApp(firebaseConfig);
  const db = getFirestore(firebaseApp);
  const auth = getAuth(firebaseApp)
  
  //const analytics = getAnalytics(firebaseApp);

  export {db, auth};
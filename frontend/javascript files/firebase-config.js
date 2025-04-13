
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  import {getAuth} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import {getFirestore} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  import { getStorage } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCb-mQaI5vcg0iffX1F6LsmgC4RiXq7JLU",
    authDomain: "care-companion-f7e7d.firebaseapp.com",
    databaseURL: "https://care-companion-f7e7d-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "care-companion-f7e7d",
    storageBucket: "care-companion-f7e7d.firebasestorage.app",
    messagingSenderId: "54688707598",
    appId: "1:54688707598:web:567e5d0502e4e552cdb85f",
    measurementId: "G-NJJHJQYND6"
  };

  // Initialize Firebase 
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  export const storage = getStorage(app);



// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBOuxrpscrMg8isyVnO7ZdGosK5dDh0SZA",
  authDomain: "rifa-admin-d3e70.firebaseapp.com",
  projectId: "rifa-admin-d3e70",
  storageBucket: "rifa-admin-d3e70.firebasestorage.app",
  messagingSenderId: "230038515235",
  appId: "1:230038515235:web:69e12af6126d5b53240b96"
};

const app = initializeApp(firebaseConfig);

// 🔐 autenticação
export const auth = getAuth(app);
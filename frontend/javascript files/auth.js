// Authentication and Authorisation

import {auth} from './firebase-config.js'
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'


// LOGIN
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error-message");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      errorMsg.textContent = error.message;
    }
  });
}

// SIGNUP
const signupBtn = document.getElementById("signupBtn");
if (signupBtn) {
  signupBtn.addEventListener("click", async () => {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const errorMsg = document.getElementById("signup-error-message");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      window.location.href = "pet-profile.html";
    } catch (error) {
      errorMsg.textContent = error.message;
    }
  });
}

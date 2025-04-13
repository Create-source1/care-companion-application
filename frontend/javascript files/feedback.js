import { auth, db } from "./firebase-config.js";
import {
  addDoc,
  collection,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// DOM Elements
const feedbackForm = document.getElementById("feedback-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

// Create feedback message element
const messageDiv = document.createElement("div");
messageDiv.id = "feedback-message";
messageDiv.style.marginTop = "15px";
messageDiv.style.fontWeight = "bold";
feedbackForm.appendChild(messageDiv);

function showMessage(text, color = "green") {
  messageDiv.textContent = text;
  messageDiv.style.color = color;
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    showMessage("Please log in to submit feedback.", "red");
    setTimeout(() => (window.location.href = "login.html"), 2000);
    return;
  }

  feedbackForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const senderName = nameInput.value.trim();
    const senderEmail = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!senderName || !senderEmail || !message) {
      showMessage("Please fill in all fields.", "red");
      return;
    }

    const feedbackData = {
      senderName,
      senderEmail,
      message,
      submittedAt: new Date(),
    };

    try {
      const feedbackRef = collection(db, "users", user.uid, "feedbacks");
      await addDoc(feedbackRef, feedbackData);
      showMessage("✅ Feedback submitted successfully!");
      feedbackForm.reset();
    } catch (err) {
      console.error("Error submitting feedback:", err);
      showMessage("❌ Failed to submit feedback. Please try again.", "red");
    }
  });
});

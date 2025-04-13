import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// DOM elements
const reminderCheckbox = document.getElementById("set-reminder");
const reminderTimeInput = document.getElementById("reminder-time");
const activityForm = document.getElementById("activity-form");
const activityList = document.getElementById("activity-list");
const activitySelect = document.getElementById("activity-type");
const filterSelect = document.getElementById("filter-type");
const timeInput = document.getElementById("activity-time");
const notesInput = document.getElementById("activity-notes");

const petId = localStorage.getItem("editPetId") || localStorage.getItem("activePetId");
console.log("petId:", petId); // Debugging line to check petId
let allActivities = [];

reminderCheckbox.addEventListener("change", () => {
  reminderTimeInput.style.display = reminderCheckbox.checked ? "block" : "none";
});

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (!petId) {
    alert("No pet selected.");
    window.location.href = "dashboard.html"; // Redirect to dashboard if no pet selected
    return;
  }

  const activitiesRef = collection(db, "users", user.uid, "pets", petId, "activities");
  const q = query(activitiesRef, orderBy("createdAt", "desc"));

  // Listen to changes in activity collection
  onSnapshot(q, (snapshot) => {
    console.log("Snapshot updated", snapshot.docs); // Debugging line
    allActivities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    renderActivities();
  });

  // Filter change listener
  filterSelect.addEventListener("change", () => {
    renderActivities();
  });

  // Add activity-------------------------------
  activityForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newActivity = {
      type: activitySelect.value,
      time: timeInput.value,
      notes: notesInput.value.trim(),
      createdAt: new Date(),
      reminder: reminderCheckbox.checked ? reminderTimeInput.value : null,
      reminderNotified: false
    };

    try {
      await addDoc(activitiesRef, newActivity);
      activityForm.reset();
      reminderTimeInput.style.display = "none";
    } catch (err) {
      console.error("Error logging activity:", err);
      alert("Failed to save activity.");
    }
  });

  // Render filtered activities
  function renderActivities() {
    const selectedFilter = filterSelect.value;
    activityList.innerHTML = ""; // Clear current activities
    
    const filtered = selectedFilter === "all"
      ? allActivities
      : allActivities.filter(a => a.type === selectedFilter);

    filtered.forEach(activity => {
      const formattedTime = new Date(activity.time).toLocaleString();
      const item = document.createElement("li");
      item.innerHTML = `
        <span>🕒 <strong>${activity.type}</strong> at ${formattedTime}${activity.notes ? " — " + activity.notes : ""}</span>
        <button class="delete-btn" data-id="${activity.id}">Delete</button>
      `;
      activityList.appendChild(item);
    });

    // Display reminders
    const now = new Date();
    const reminders = allActivities.filter(a => a.reminder && new Date(a.reminder) > now);

    const reminderList = document.getElementById("reminder-list");
    reminderList.innerHTML = ""; // Clear current reminders

    reminders.forEach(reminder => {
      const reminderTimeFormatted = new Date(reminder.reminder).toLocaleString();
      const reminderItem = document.createElement("li");
      reminderItem.textContent = `🔔 ${reminder.type} — ${reminderTimeFormatted}`;
      reminderList.appendChild(reminderItem);
    });
  }

  // Delete Button
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      if (confirm("Delete this activity?")) {
        try {
          const docRef = doc(db, "users", user.uid, "pets", petId, "activities", id);
          await deleteDoc(docRef);
          window.location.reload(); // Refresh view
        } catch (err) {
          console.error("Delete failed:", err);
          alert("Could not delete activity.");
        }
      }
    });
  });

  // ✅ Reminder Checker
  setInterval(async () => {
    const now = new Date();
    const snapshot = await getDocs(q);

    snapshot.forEach(async (docSnap) => {
      const activity = docSnap.data();

      if (activity.reminder && !activity.reminderNotified) {
        const reminderTime = new Date(activity.reminder);

        if (Math.abs(now - reminderTime) <= 60000) {
          alert(`⏰ Reminder: ${activity.type} - ${activity.notes || ''}`);

          const docRef = doc(db, "users", user.uid, "pets", petId, "activities", docSnap.id);
          await updateDoc(docRef, { reminderNotified: true });
        }
      }
    });
  }, 60000); // every 1 minute
});

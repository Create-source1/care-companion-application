import { auth, db, storage } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";
// import { Chart } from "https://cdn.jsdelivr.net/npm/chart.js";  // Importing Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, LineController } from 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.esm.min.js';

// Register all necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController // Registering LineController
);



const form = document.getElementById("health-journal-form");
const list = document.getElementById("health-journal-list");
const imageInput = document.getElementById("entry-image");
const filterSelect = document.getElementById("filter-type");

// Get selected petId from localStorage
const petId = localStorage.getItem("activePetId") || localStorage.getItem("editPetId");
console.log("petId:", petId); // Debugging line to check petId

let allEntries = []; // store fetched entries

onAuthStateChanged(auth, (user) => {
  if (!user || !petId) {
    alert("Please log in and select a pet.");
    window.location.href = "dashboard.html";
    return;
  }

  const journalRef = collection(db, "users", user.uid, "pets", petId, "healthJournal");
  const q = query(journalRef, orderBy("date", "desc"));

  // Fetch and store entries
  onSnapshot(q, (snapshot) => {
    console.log("Snapshot updated", snapshot.docs); // Debugging line
    allEntries = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    renderEntries(); // Initial or updated render
  });

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const entryType = document.getElementById("entry-type").value;
    const entryDate = document.getElementById("entry-date").value;
    const description = document.getElementById("entry-description").value.trim();
    const vetName = document.getElementById("vet-name").value.trim();
    const medications = document.getElementById("medications").value
      .split(",")
      .map(med => med.trim())
      .filter(Boolean);
    const nextVisit = document.getElementById("next-visit").value;
    const imageFile = imageInput.files[0];

    let imageUrl = "";

    if (imageFile) {
      const filePath = `healthImages/${Date.now()}_${imageFile.name}`;
      const imgRef = storageRef(storage, filePath);
      try {
        await uploadBytes(imgRef, imageFile);
        imageUrl = await getDownloadURL(imgRef);
      } catch (uploadErr) {
        console.error("Error uploading image:", uploadErr);
        alert("Image upload failed. Proceeding without image.");
      }
    }

    const newEntry = {
      type: entryType,
      date: entryDate,
      description,
      vetName,
      medications,
      nextVisit,
      imageUrl,
      timestamp: new Date()
    };

    try {
      await addDoc(journalRef, newEntry);
      form.reset();
    } catch (err) {
      console.error("Error adding entry:", err);
      alert("Failed to save health journal entry.");
    }
  });

  // Filtering logic
  if (filterSelect) {
    filterSelect.addEventListener("change", renderEntries);
  }

  // Re-render entries with optional filter
  function renderEntries() {
    const selectedType = filterSelect?.value || "";
    list.innerHTML = "";

    const filtered = selectedType
      ? allEntries.filter(entry => entry.type === selectedType)
      : allEntries;

    if (filtered.length === 0) {
      list.innerHTML = `<li style="text-align:center; color:#888;">No entries found.</li>`;
      return;
    }

    filtered.forEach((entry) => {
      const item = document.createElement("li");
      item.innerHTML = `
        <strong>${entry.date} - ${entry.type}</strong><br>
        ${entry.description}<br>
        ${entry.vetName ? `Vet: ${entry.vetName}<br>` : ""}
        ${entry.medications?.length ? `Meds: ${entry.medications.join(", ")}<br>` : ""}
        ${entry.nextVisit ? `Next Visit: ${entry.nextVisit}<br>` : ""}
        ${entry.imageUrl ? `<img src="${entry.imageUrl}" alt="Uploaded Image" style="max-width: 100%; margin-top: 10px; border-radius: 10px;">` : ""}
        <button class="delete-btn" data-id="${entry.id}">Delete</button>
      `;
      list.appendChild(item);
    });

    attachDeleteListeners(user);
  }

  function attachDeleteListeners(user) {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(btn => {
      btn.addEventListener("click", async () => {
        const docId = btn.getAttribute("data-id");
        const confirmDel = confirm("Are you sure you want to delete this entry?");
        if (!confirmDel) return;

        try {
          await deleteDoc(doc(db, "users", user.uid, "pets", petId, "healthJournal", docId));
        } catch (err) {
          console.error("Failed to delete entry:", err);
        }
      });
    });
  }
});

// WEIGHT TRACKER
// importing getDocs, Timestamp from firestore
const weightForm = document.getElementById("weight-form");
const weightInput = document.getElementById("pet-weight");
const weightDateInput = document.getElementById("weight-date");
const weightLogList = document.getElementById("weight-log-list");

// Function to load and display weight logs
async function loadWeightLogs(userId, petId) {
  const weightRef = collection(db, "users", userId, "pets", petId, "weights");
  const q = query(weightRef, orderBy("date", "desc"));
  const snapshot = await getDocs(q);

  weightLogList.innerHTML = ""; // Clear list

  const weightData = [];  // For chart data

  snapshot.forEach(docSnap => {
    const data = docSnap.data();
    const date = data.date.toDate().toLocaleDateString();
    weightLogList.innerHTML += `<li><strong>${date}</strong>: ${data.weight} kg</li>`;

    weightData.push({ date: date, weight: data.weight });
  });

  // Call function to update chart
  updateWeightChart(weightData);
}

// Function to update the weight trend chart
function updateWeightChart(weightData) {
  const labels = weightData.map(entry => entry.date);
  const data = weightData.map(entry => entry.weight);

  const ctx = document.getElementById("weight-chart").getContext("2d");

  const weightChart = new ChartJS(ctx, {
    type: "line", // Line chart
    data: {
      labels: labels,
      datasets: [{
        label: "Pet Weight (kg)",
        data: data,
        borderColor: "#ff6347",
        fill: false,
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Date"
          }
        },
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Weight (kg)"
          }
        }
      }
    }
  });
}

// Weight log submit event
if (weightForm && weightInput && weightDateInput && weightLogList) {
  weightForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const weight = parseFloat(weightInput.value);
    const date = new Date(weightDateInput.value);

    if (isNaN(weight) || !date) {
      alert("Please enter a valid weight and date.");
      return;
    }

    const weightEntry = {
      weight,
      date: Timestamp.fromDate(date)
    };

    try {
      const user = auth.currentUser;
      const weightRef = collection(db, "users", user.uid, "pets", petId, "weights");
      await addDoc(weightRef, weightEntry);
      await loadWeightLogs(user.uid, petId);
      weightForm.reset();
    } catch (err) {
      console.error("Error saving weight:", err);
      alert("Failed to log weight.");
    }
  });

  // On auth ready, load weight logs
  onAuthStateChanged(auth, (user) => {
    if (user && petId) {
      loadWeightLogs(user.uid, petId);
    }
  });
}

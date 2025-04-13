import { auth, db, storage } from "./firebase-config.js";
import {doc, getDoc, updateDoc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

const nameInput = document.getElementById("pet-name");
const breedInput = document.getElementById("pet-breed");
const ageInput = document.getElementById("pet-age");
const weightInput = document.getElementById("pet-weight");
const urlInput = document.getElementById("pet-photo-url");
const uploadInput = document.getElementById("pet-photo-upload");
const saveBtn = document.getElementById("savePetBtn");
const errorMsg = document.getElementById("error-message");

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const petId = localStorage.getItem("editPetId");
  if (!petId) {
    alert("No pet selected for editing.");
    window.location.href = "dashboard.html";
    return;
  }

  const petRef = doc(db, "users", user.uid, "pets", petId);

  try {
    const petSnap = await getDoc(petRef);
    if (!petSnap.exists()) {
      alert("Pet not found.");
      window.location.href = "dashboard.html";
      return;
    }

    const petData = petSnap.data();
    nameInput.value = petData.name || "";
    breedInput.value = petData.breed || "";
    ageInput.value = petData.age || "";
    weightInput.value = petData.weight || "";
    urlInput.value = petData.photoURL || "";
  } catch (err) {
    console.error("Failed to load pet data:", err);
    alert("Something went wrong. Please try again.");
  }

  saveBtn.addEventListener("click", async () => {
    const updatedData = {
      name: nameInput.value.trim(),
      breed: breedInput.value.trim(),
      age: parseInt(ageInput.value.trim(), 10),
      weight: weightInput.value.trim()
    };

    if (!updatedData.name || !updatedData.breed || isNaN(updatedData.age) || !updatedData.weight) {
      errorMsg.textContent = "Please fill in all required fields.";
      return;
    }
    
    errorMsg.textContent = "Updating...";

    try {
      if (uploadInput.files.length > 0) {
        const file = uploadInput.files[0];
        const storageRef = ref(storage, `petPhotos/${user.uid}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on("state_changed",
          null,
          (error) => {
            console.error("Upload failed:", error);
            alert("Failed to upload photo.");
            errorMsg.textContent = "";
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedData.photoURL = downloadURL;

            await updateDoc(petRef, updatedData);
            errorMsg.textContent = "Pet profile updated!";
            localStorage.removeItem("editPetId");
            setTimeout(() => window.location.href = "dashboard.html", 1000);
          }
        );
      } else if (urlInput.value.trim()) {
        updatedData.photoURL = urlInput.value.trim();
        await updateDoc(petRef, updatedData);
        errorMsg.textContent = "Pet profile updated!";
        localStorage.removeItem("editPetId");
        setTimeout(() => window.location.href = "dashboard.html", 1000);
      } else {
        await updateDoc(petRef, updatedData);
        errorMsg.textContent = "Pet profile updated!";
        localStorage.removeItem("editPetId");
        setTimeout(() => window.location.href = "dashboard.html", 1000);
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update pet profile.");
      errorMsg.textContent = "";
    }
  });
});

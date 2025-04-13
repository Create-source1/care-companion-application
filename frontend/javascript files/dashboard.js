import { auth,db } from "./firebase-config.js";
import {doc, getDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";


const loadingEl = document.getElementById("loading");
const dashboardEl = document.getElementById("dashboard-content");

window.editPet = function(petId) {
  // Storing petId in localStorage 
  localStorage.setItem("editPetId", petId);
  window.location.href = "edit-pet.html";
};

// Delete functionality
window.deletePet = async function(petId) {
  const confirmation = confirm("Are you sure you want to delete this pet profile?");
  if (!confirmation) return;

  const user = auth.currentUser;
  if (!user) return alert("You must be logged in to delete a pet.");

  try {
    await deleteDoc(doc(db, "users", user.uid, "pets", petId));
    alert("Pet deleted successfully.");
    window.location.reload();
  } catch (err) {
    console.error("Failed to delete pet:", err);
    alert("Failed to delete pet.");
  }
};


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {
    document.getElementById("greeting").textContent = `Hi, ${user.email.split('@')[0]}!`;
    localStorage.removeItem("editPetId"); // Clear leftover edit state


    const petsRef = collection(db, "users", user.uid, "pets");
    const q = query(petsRef, orderBy("createdAt", "desc"), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      alert("No pet profile found. Please create one.");
      window.location.href = "pet-profile.html";
      return;
    }
    
    const petDoc = snapshot.docs[0];
    const pet = petDoc.data();
    localStorage.setItem("activePetId", petDoc.id); // Set the default selected pet ID


    document.getElementById("pet-name").textContent = pet.name;
    document.getElementById("pet-details").textContent = `${pet.breed} · Age: ${pet.age} yrs · Weight: ${pet.weight} kg`;
    if (pet.photoURL) {
      document.getElementById("pet-photo").src = pet.photoURL;
    } 
    else {
      alert("No user data found. Please set up your profile.");
      window.location.href = "pet-profile.html"; // optional fallback
      return;
    }  
    
    // Carousel Logic (Display All Pets) ----------------------------------
    const fullSnapshot = await getDocs(petsRef);
    const petCardsContainer = document.getElementById("petCardsContainer");
    const petCarouselSection = document.querySelector(".pet-carousel-section");
    const createMorePetsBtn = document.getElementById("create-more-pets");

    const allPets = [];
    fullSnapshot.forEach(doc => allPets.push({ id: doc.id, ...doc.data() }));

    // if (allPets.length <= 1) {
    //   petCardsContainer.style.display = "none"; // Hide carousel only
    //   createMorePetsBtn.style.display = "block"; // Show button
    // } else {
    //   petCardsContainer.style.display = "flex"; 
    //   createMorePetsBtn.style.display = "none";
    
 
    petCardsContainer.innerHTML = "";
    petCardsContainer.style.display = "flex";
    createMorePetsBtn.style.display = "block";


      allPets.forEach(pet => {
        const card = document.createElement("div");
        card.classList.add("pet-card");

        card.innerHTML = `
          <img src="${pet.photoURL || ''}" alt="${pet.name}">
          <h4>${pet.name}</h4>
          <p>${pet.breed} · ${pet.age} yrs · ${pet.weight} kg</p>
          <button class="edit-btn" onclick="editPet('${pet.id}')">Edit</button>   
          <button class="delete-btn" onclick="deletePet('${pet.id}')">Delete</button>
        `; // Edit button which takes to edit-pet.html

        // Click to switch pets
        card.addEventListener("click", () => {
          localStorage.setItem("activePetId", pet.id); // Update the active pet
          document.getElementById("pet-name").textContent = pet.name;
          document.getElementById("pet-details").textContent = `${pet.breed} · Age: ${pet.age} · Weight: ${pet.weight}`;
          document.getElementById("pet-photo").src = pet.photoURL || "";
        });
        petCardsContainer.appendChild(card);
      });
  } catch (err) {
    alert("Failed to load pet profile.");
    console.error(err);
  } finally {
    loadingEl.style.display = "none";
    dashboardEl.style.display = "block";
  }
});

// Logout button
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    console.error('Logout button clicked');
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  });
}
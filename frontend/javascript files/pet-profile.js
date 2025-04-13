import { auth,db,storage } from "./firebase-config.js";
import {doc, setDoc, collection,addDoc} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";


// Form elements
const saveBtn = document.getElementById("savePetBtn");

saveBtn.addEventListener("click", async () => {
  console.log('Save Button clicked')
  const name = document.getElementById("pet-name").value.trim();
  const breed = document.getElementById("pet-breed").value.trim();
  const age = document.getElementById("pet-age").value.trim();
  const weight = document.getElementById("pet-weight").value.trim();
  const photoURLInput = document.getElementById("pet-photo-url").value.trim();
  const photoFile = document.getElementById("pet-photo-upload").files[0];

  const errorMsg = document.getElementById("error-message");
  errorMsg.textContent = "";

  if (!name || !breed || !age || !weight) {
    errorMsg.textContent = "Please fill in all required fields.";
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    errorMsg.textContent = "User not logged in.";
    return;
  }

  let photoURL = null;

  try {
    if (photoFile) {
      const storageRef = ref(storage, `petPhotos/${user.uid}/${Date.now()}_${photoFile.name}`);
      await uploadBytes(storageRef, photoFile);
      photoURL = await getDownloadURL(storageRef);
    } else if (photoURLInput) {
      photoURL = photoURLInput;
    }

    const petData = {
      name,
      breed,
      age,
      weight,
      photoURL,
      createdAt: new Date().toISOString(),
    };

    // Add to pets subcollection inside the user's document--------------------------------
    const userDocRef = doc(db, "users", user.uid);
    const petsCollectionRef = collection(userDocRef, "pets");
    // Custom ID pet doc creation
    const customPetId = `${name}_${Date.now()}`;
    const newPetDocRef = doc(petsCollectionRef, customPetId);
    await setDoc(newPetDocRef, petData);

    // await addDoc(petsCollectionRef, petData);    
    // await setDoc(doc(db, "users", user.uid), { pet: petData }, { merge: true });

    alert("Pet profile saved!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Error saving profile:", error);
    errorMsg.textContent = "Error saving profile. Try again.";
  }
});

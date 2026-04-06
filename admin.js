import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// DOM Elements
const authContainer = document.getElementById("auth-container");
const adminContainer = document.getElementById("admin-container");
const loginForm = document.getElementById("login-form");
const authError = document.getElementById("auth-error");
const logoutBtn = document.getElementById("logout-btn");

const addItemForm = document.getElementById("add-item-form");
const formMsg = document.getElementById("form-msg");
const tableBody = document.getElementById("menu-table-body");
const submitBtn = document.getElementById("submit-btn");

let editingId = null; // Track if we are editing

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in
        authContainer.classList.add("hidden");
        adminContainer.classList.remove("hidden");
        loadMenuItems();
    } else {
        // User is logged out
        authContainer.classList.remove("hidden");
        adminContainer.classList.add("hidden");
    }
});

// Handle Login
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    authError.innerText = "Giriş edilir...";

    try {
        await signInWithEmailAndPassword(auth, email, password);
        authError.innerText = "";
    } catch (error) {
        authError.innerText = "Giriş xətası: " + error.message;
    }
});

// Handle Logout
logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
});

// Load Menu Items
async function loadMenuItems() {
    tableBody.innerHTML = "<tr><td colspan='5'>Yüklənir...</td></tr>";
    try {
        const querySnapshot = await getDocs(collection(db, "menuItems"));
        tableBody.innerHTML = "";
        
        if(querySnapshot.empty) {
            tableBody.innerHTML = "<tr><td colspan='5'>Heç bir yemək tapılmadı.</td></tr>";
            return;
        }

        querySnapshot.forEach((document) => {
            const data = document.data();
            const row = `
                <tr>
                    <td><img src="${data.img}" alt="${data.name}" class="td-img"></td>
                    <td>${data.name}</td>
                    <td>${data.category}</td>
                    <td>${data.price}</td>
                    <td>
                        <button class="action-btn edit-btn" onclick="editItem('${document.id}', '${data.name}', '${data.category}', '${data.price}', '${data.desc}', '${data.img}')"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" onclick="deleteItem('${document.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        });
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan='5'>Xəta baş verdi: ${error.message}</td></tr>`;
    }
}

// Global functions for inline HTML event handlers (Edit, Delete)
window.deleteItem = async (id) => {
    if (confirm("Bu yeməyi silmək istədiyinizə əminsiniz?")) {
        try {
            await deleteDoc(doc(db, "menuItems", id));
            loadMenuItems();
        } catch (error) {
            alert("Silinmə xətası: " + error.message);
        }
    }
};

window.editItem = (id, name, category, price, desc, img) => {
    editingId = id;
    document.getElementById("item-name").value = name;
    document.getElementById("item-category").value = category;
    document.getElementById("item-price").value = price;
    document.getElementById("item-desc").value = desc;
    // We cannot set value of file input, but we know it's not required to re-upload image if editing
    document.getElementById("item-img").required = false; 
    
    submitBtn.innerText = "Yenilə";
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Handle Add / Edit form submit
addItemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerText = "Gözləyin...";
    formMsg.style.color = "var(--text)";
    formMsg.innerText = "Məlumat göndərilir...";

    try {
        const name = document.getElementById("item-name").value;
        const category = document.getElementById("item-category").value;
        const price = document.getElementById("item-price").value;
        const desc = document.getElementById("item-desc").value;
        const fileInput = document.getElementById("item-img");
        
        let imageUrl = "";

        // If a new file is uploaded
        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const storageRef = ref(storage, "images/" + Date.now() + "_" + file.name);
            const snapshot = await uploadBytes(storageRef, file);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        if (editingId) {
            // Update Existing Item
            const updateData = { name, category, price, desc };
            if (imageUrl) {
                updateData.img = imageUrl; // Only update image if new one was selected
            }
            await updateDoc(doc(db, "menuItems", editingId), updateData);
            formMsg.innerText = "Yemək uğurla yeniləndi!";
        } else {
            // Add New Item
            if (!imageUrl) throw new Error("Şəkil yükləmək məcburidir!");
            await addDoc(collection(db, "menuItems"), {
                name, category, price, desc, img: imageUrl
            });
            formMsg.innerText = "Yemək uğurla əlavə edildi!";
        }

        formMsg.style.color = "var(--success)";
        
        // Reset form
        addItemForm.reset();
        document.getElementById("item-img").required = true;
        editingId = null;
        submitBtn.innerText = "Əlavə Et";
        
        // Reload table
        loadMenuItems();

        setTimeout(() => { formMsg.innerText = ""; }, 3000);

    } catch (error) {
        formMsg.style.color = "var(--danger)";
        formMsg.innerText = "Xəta: " + error.message;
        
        if (editingId) {
            submitBtn.innerText = "Yenilə";
        } else {
            submitBtn.innerText = "Əlavə Et";
        }
    } finally {
        submitBtn.disabled = false;
    }
});

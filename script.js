import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let menuData = [];
const fallbackMenuData = [
    {
        id: 1,
        name: "Yarpaq Dolması",
        category: "Əsas",
        price: "12.00 ₼",
        desc: "Təzə üzüm yarpağında quzu əti, düyü və xüsusi ədviyyatlarla hazırlanmış ənənəvi dolma. Qatıq ilə təqdim olunur.",
        img: "https://images.unsplash.com/photo-1628294895950-9805252327bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Şah Plov",
        category: "Əsas",
        price: "25.00 ₼",
        desc: "Xırtıldayan lavaş içərisində uzun düyü, kənd çolpası, şabalıd, kişmiş və ərik qurusu.",
        img: "https://plus.unsplash.com/premium_photo-1694141253763-209b4c8f8ace?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        name: "Tikə Kabab",
        category: "Əsas",
        price: "14.00 ₼",
        desc: "Közdə qızardılmış təzə quzu əti, soğan və sumaqla birlikdə.",
        img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Düşbərə",
        category: "Şorba",
        price: "7.00 ₼",
        desc: "Xırda xəmirlərin içərisində ləziz quzu əti ilə hazırlanmış isti, nanəli milli şorba.",
        img: "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Mərci Şorbası",
        category: "Şorba",
        price: "5.00 ₼",
        desc: "Qırmızı mərci, kök, soğan və xüsusi ədviyyatlarla hazırlanmış süzmə şorba. Limon ilə təqdim edilir.",
        img: "https://images.unsplash.com/photo-1548943487-a2e4b43b4850?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Qutab Çeşidləri",
        category: "Qəlyanaltı",
        price: "3.00 ₼",
        desc: "Ət, göyərti, qabaq və ya pendir içlikli sacda bişmiş nazik xəmir. Sumaqla təqdim olunur.",
        img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        name: "Manqal Salatı",
        category: "Qəlyanaltı",
        price: "8.00 ₼",
        desc: "Közdə bişmiş badımcan, pomidor, bibər və qırmızı soğan. Zeytun yağı ilə.",
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 8,
        name: "Ev yapımı Ayran",
        category: "İçki",
        price: "3.00 ₼",
        desc: "Nanəli və köpüklü, sərinlədici təbii kənd ayranı.",
        img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 9,
        name: "Şəki Paxlavası",
        category: "Şirniyyat",
        price: "10.00 ₼",
        desc: "Düyü unu, qoz ləpəsi və bal şərbəti ilə hazırlanmış ənənəvi Şəki şirniyyatı.",
        img: "https://images.unsplash.com/photo-1587825027984-c4bf8bebedac?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

const categories = ["Bütün", "Əsas", "Şorba", "Qəlyanaltı", "Şirniyyat", "İçki"];

const filtersContainer = document.getElementById('filters');
const menuGrid = document.getElementById('menu-grid');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.getElementById('header');

// Generate Filters
function displayFilters() {
    filtersContainer.innerHTML = categories.map((cat, index) => {
        return `<button class="filter-btn ${index === 0 ? 'active' : ''}" data-filter="${cat}">${cat}</button>`;
    }).join('');

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            e.target.classList.add('active');
            
            const filterValue = e.target.getAttribute('data-filter');
            displayMenuItems(filterValue);
        });
    });
}

// Generate Menu Items
function displayMenuItems(filter = "Bütün") {
    let filteredMenu = menuData;
    
    if (filter !== "Bütün") {
        filteredMenu = menuData.filter(item => item.category === filter);
    }

    menuGrid.innerHTML = filteredMenu.map(item => {
        return `
            <div class="menu-card" onclick="openModal('${item.id}')" style="cursor: pointer;">
                <div class="price-tag">${item.price}</div>
                <div class="card-img">
                    <img src="${item.img}" alt="${item.name}" loading="lazy">
                </div>
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.desc}</p>
                    <span class="category-tag">${item.category}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Mobile Navbar Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Scroll Header Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if(firebaseConfig.apiKey !== "YOUR_API_KEY_HERE") {
            const querySnapshot = await getDocs(collection(db, "menuItems"));
            if (!querySnapshot.empty) {
                menuData = [];
                querySnapshot.forEach((doc) => {
                    menuData.push({ id: doc.id, ...doc.data() });
                });
            } else {
                menuData = fallbackMenuData;
            }
        } else {
            console.warn("Firebase is not configured. Displaying local fallback data.");
            menuData = fallbackMenuData;
        }
    } catch(err) {
        console.error("Error fetching data from Firebase:", err);
        menuData = fallbackMenuData;
    }

    displayFilters();
    displayMenuItems();
});

// Modal Logic
const modal = document.getElementById('food-modal');
const closeBtn = document.querySelector('.close-btn');

window.openModal = function(id) {
    const item = menuData.find(m => m.id.toString() === id.toString());
    if (!item) return;

    document.getElementById('modal-img').src = item.img;
    document.getElementById('modal-title').innerText = item.name;
    document.getElementById('modal-category').innerText = item.category;
    document.getElementById('modal-price').innerText = item.price;
    document.getElementById('modal-desc').innerText = item.desc;

    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // Restore scrolling
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

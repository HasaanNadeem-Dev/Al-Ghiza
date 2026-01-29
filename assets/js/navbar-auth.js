import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAqFB54Y-jLl3tntYsHPzfi26zMJF5lUdY",
    authDomain: "al-ghiza.firebaseapp.com",
    projectId: "al-ghiza",
    storageBucket: "al-ghiza.firebasestorage.app",
    messagingSenderId: "226309493007",
    appId: "1:226309493007:web:8dea0035f6b767d2062e7a",
    measurementId: "G-DEL5MFSD9L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Global NavBar Auth Logic
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, (user) => {
        const navProfileIcon = document.getElementById('nav-profile-icon');
        const accountLinks = document.querySelectorAll('a[href="account.html"], a[href="login.html"]'); // Dropdown links
        const logoutLinks = document.querySelectorAll('.logout-link');

        if (user) {
            // Check for saved avatar
            const savedAvatar = localStorage.getItem('userAvatar');

            // 1. Update Top-Level Navbar Icon (The Circle)
            if (navProfileIcon) {
                if (savedAvatar) {
                    // Simple Image - 40px Circle
                    navProfileIcon.innerHTML = `<img src="${savedAvatar}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; display: block; border: 1px solid #E0C097;">`;
                    navProfileIcon.href = 'account.html';
                } else {
                    // No avatar -> Default Icon
                    navProfileIcon.innerHTML = `<i class="fa-regular fa-user"></i>`;
                }
            }

            // 2. Update Dropdown Links (Text Links)
            accountLinks.forEach(link => {
                if (link.id !== 'nav-profile-icon') { // processing dropdown items
                    if (link.innerHTML.includes('Your Account') || link.innerHTML.includes('Login')) {
                        // USER REQUEST: Show "My Account" instead of Name
                        link.innerHTML = `<i class="fa-regular fa-circle-user"></i> My Account`;
                        link.href = 'account.html';
                    }
                }
            });

            logoutLinks.forEach(link => {
                link.style.display = 'block';
                link.onclick = async (e) => {
                    e.preventDefault();
                    await signOut(auth);
                    window.location.href = 'index.html';
                };
            });
        } else {
            // User is signed out
            accountLinks.forEach(link => {
                if (link.innerHTML.includes('My Dashboard')) {
                    link.innerHTML = '<i class="fa-regular fa-circle-user"></i> Your Account';
                }
            });

            logoutLinks.forEach(link => {
                link.style.display = 'none'; // Hide logout if not logged in
            });
        }
    });

    // Country Selector Logic
    const countrySelector = document.getElementById('country-selector');
    if (countrySelector) {
        // Load saved country
        const savedCountry = localStorage.getItem('selectedCountry');
        if (savedCountry) {
            countrySelector.value = savedCountry;
        }

        // Save on change
        countrySelector.addEventListener('change', (e) => {
            const selectedCountry = e.target.value;
            localStorage.setItem('selectedCountry', selectedCountry);
            // Optional: Reload page or update other UI elements if needed
            // location.reload(); 
        });
    }
});

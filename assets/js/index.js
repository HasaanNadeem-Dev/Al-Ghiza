
let slideIndex = 1;
showSlides(slideIndex);

// Auto slide every 5 seconds
let slideInterval = setInterval(function () {
    plusSlides(1);
}, 5000);

function plusSlides(n) {
    showSlides(slideIndex += n);
    resetTimer();
}

function currentSlide(n) {
    showSlides(slideIndex = n);
    resetTimer();
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("hero-slide");
    let dots = document.getElementsByClassName("h-dot");

    /* Safety check if slider elements exist */
    if (slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }

    for (i = 0; i < slides.length; i++) {
        // slides[i].style.display = "none"; // Using CSS opacity/visibility now
        slides[i].classList.remove("active");
    }

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    // slides[slideIndex - 1].style.display = "flex"; // Handled by class
    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].className += " active";
}

function resetTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(function () {
        plusSlides(1);
    }, 5000);
}

// Expose functions to global scope for HTML onclick attributes
window.moveSlide = function (n) {
    plusSlides(n);
}

// Global state for slider interactions
let isHovering = false;
let isPressed = false;

// Product Card Slider Logic
function initProductSlider(container) {
    const track = container.querySelector('.product-slider-track');
    // Get distinct cards currently in DOM (user might have manual duplicates, but we treat current set as the sequence)
    const originalCards = container.querySelectorAll('.cards');

    // Safety check
    if (!track || originalCards.length === 0) return;

    // Auto-duplicate for seamless infinite loop
    // We clone the entire set and append it to the end.
    // This handles any sequence the user creates and ensures the loop point matches the start.
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        // Mark clone to identify if needed, though not strictly necessary
        clone.classList.add('clone');
        track.appendChild(clone);
    });

    const allCards = container.querySelectorAll('.cards');
    const uniqueCardsCount = originalCards.length;

    let startX;
    let scrollLeft;
    let scrollInterval;
    let currentIndex = 0;

    // Dynamic Card Width Calculation
    function getCardWidth() {
        const firstCard = container.querySelector('.cards');
        if (!firstCard) return 300; // Fallback
        const trackStyle = window.getComputedStyle(track);
        const gap = parseFloat(trackStyle.gap) || 30;
        return firstCard.offsetWidth + gap;
    }

    let cardWidth = getCardWidth();

    // Update on resize
    window.addEventListener('resize', () => {
        cardWidth = getCardWidth();
        updatePosition(false); // Re-align without animation
    });

    function startAutoScroll() {
        stopAutoScroll();
        if (isHovering || isPressed) return;

        scrollInterval = setInterval(() => {
            currentIndex++;
            updatePosition(true);
        }, 5000);
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
    }

    function updatePosition(withTransition) {
        if (withTransition) {
            track.style.transition = 'transform 0.5s ease';
        } else {
            track.style.transition = 'none';
        }
        const newTransform = -(currentIndex * cardWidth);
        track.style.transform = `translateX(${newTransform}px)`;
    }

    function getTransformValue() {
        const style = window.getComputedStyle(track);
        const matrix = new WebKitCSSMatrix(style.transform);
        return matrix.m41;
    }

    function snapToNearestCard() {
        const currentX = getTransformValue();
        let newIndex = Math.round(-currentX / cardWidth);

        if (newIndex < 0) newIndex = 0;

        // Loop logic for drag end
        // If we dragged past the first set
        if (newIndex >= uniqueCardsCount * 2) {
            newIndex = 0;
        }

        currentIndex = newIndex;
        updatePosition(true);
        startAutoScroll();
    }

    // Events
    track.addEventListener('transitionend', () => {
        // If we have slid past the original set
        if (currentIndex >= uniqueCardsCount) {
            // Calculate equivalent index in the first set
            // usually currentIndex - uniqueCardsCount
            // But we specifically want the exact moment we hit the start of the clones to reset to the start of originals
            // However, setInterval increments by 1.
            // If we are at uniqueCardsCount (the first clone), it looks exactly like index 0.
            // So we swap INSTANTLY to index 0.

            // Note: If we drag way past, we might be at uniqueCardsCount + 2.
            // We should reset to (currentIndex % uniqueCardsCount).

            track.style.transition = 'none';
            currentIndex = currentIndex % uniqueCardsCount;
            updatePosition(false);
            void track.offsetWidth;
        }
    });

    // Hover on Cards (Attach to ALL cards including clones)
    allCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            isHovering = true;
            stopAutoScroll();
        });
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            if (!isPressed) startAutoScroll();
        });
    });

    // Container interactions
    container.addEventListener('mousedown', (e) => {
        isPressed = true;
        stopAutoScroll();
        track.style.transition = 'none';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = getTransformValue();
        container.style.cursor = "grabbing";
    });

    container.addEventListener('mouseleave', () => {
        if (isPressed) {
            isPressed = false;
            isHovering = false; // Force unhover if dragged out
            snapToNearestCard();
            container.style.cursor = "grab";
        }
    });

    container.addEventListener('mouseup', () => {
        if (!isPressed) return;
        isPressed = false;
        snapToNearestCard();
        container.style.cursor = "grab";
    });

    container.addEventListener('mousemove', (e) => {
        if (!isPressed) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        track.style.transform = `translateX(${scrollLeft + walk}px)`;
    });

    // Touch
    container.addEventListener('touchstart', (e) => {
        isHovering = true;
        isPressed = true;
        stopAutoScroll();
        track.style.transition = 'none';
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = getTransformValue();
    });

    container.addEventListener('touchend', () => {
        isPressed = false;
        isHovering = false;
        snapToNearestCard();
    });

    container.addEventListener('touchmove', (e) => {
        if (!isPressed) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        track.style.transform = `translateX(${scrollLeft + walk}px)`;
    });

    // Initialize
    startAutoScroll();
}

// Sidebar Menu Logic
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const sideMenu = document.getElementById('side-menu');
const menuOverlay = document.getElementById('menu-overlay');

function openMenu() {
    sideMenu.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeMenu() {
    sideMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openMenu);
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
}

if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
}

// Scroll to Top Logic
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    const header = document.querySelector('.site-header-container');

    // Toggle scrolled class for sticky effect
    if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        if (header) header.classList.add('scrolled');
    } else {
        if (header) header.classList.remove('scrolled');
    }

    // Back to top button
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        if (scrollTopBtn) scrollTopBtn.style.display = "flex";
    } else {
        if (scrollTopBtn) scrollTopBtn.style.display = "none";
    }
}

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    });
}

// Initialize Product Cards (Desktop logic + Cloning)
document.querySelectorAll('.product-slider-container').forEach(initProductSlider);

// Prepare Corporate Logos for Infinite Scroll (Mobile)
function initCorporateSlider() {
    const logoContainer = document.querySelector('.corporate-customers-section .logos');
    if (!logoContainer) return;

    // Clone logos to enable infinite check
    // We only want to do this once
    if (logoContainer.getAttribute('data-cloned') === 'true') return;

    const originals = Array.from(logoContainer.children);
    originals.forEach(logo => {
        const clone = logo.cloneNode(true);
        clone.classList.add('clone');
        logoContainer.appendChild(clone);
    });

    logoContainer.setAttribute('data-cloned', 'true');
}
initCorporateSlider();

// Native Auto Scroll for Mobile (Product Slider & Logos)
function initNativeAutoScroll() {
    // Select containers
    const sliders = [
        ...document.querySelectorAll('.product-slider-container'),
        document.querySelector('.corporate-customers-section .logos')
    ].filter(el => el);

    sliders.forEach(slider => {
        let isPaused = false;

        // Only run if overflow/content is sufficient
        if (slider.scrollWidth <= slider.clientWidth) return;

        setInterval(() => {
            if (isPaused) return;

            // Infinite Loop Logic:
            // Calculate precise loop point using the first clone
            const firstClone = slider.querySelector('.clone');
            let loopPoint = slider.scrollWidth / 2; // Fallback

            if (firstClone) {
                // The loop point is exactly where the clones start
                // We need to account for the container's own padding/offset possibly,
                // but offsetLeft is relative to the scroll parent usually.
                loopPoint = firstClone.offsetLeft;
            }

            // Check if we have scrolled past the loop point
            // Tolerance of 5px for safety
            if (slider.scrollLeft >= loopPoint - 5) {
                // Instant Reset: Jump back by the exact width of the original set
                // We don't set to 0, we subtract loopPoint.
                // This preserves any "extra" scroll we might have accumulated (though with discrete steps it should be clean).
                // Actually, simply setting to (current - loopPoint) is safest.
                slider.scrollLeft -= loopPoint;
            }

            // Now Calculate Scroll Step (Item Width)
            const firstItem = slider.querySelector('.cards') || slider.querySelector('img');
            let itemWidth = 0;
            if (firstItem) {
                // Calculate width + gap
                const style = window.getComputedStyle(firstItem);
                // We rely on the difference between two items to get the full step
                const next = firstItem.nextElementSibling;
                if (next) {
                    itemWidth = next.offsetLeft - firstItem.offsetLeft;
                } else {
                    itemWidth = firstItem.offsetWidth + 10; // Fallback
                }
            } else {
                itemWidth = slider.clientWidth / 2;
            }

            // Scroll Smoothly
            slider.scrollBy({ left: itemWidth, behavior: 'smooth' });

        }, 5000);

        // Pause interactions
        const pause = () => isPaused = true;
        const resume = () => isPaused = false;

        slider.addEventListener('touchstart', pause);
        slider.addEventListener('touchend', () => setTimeout(resume, 5000));
        slider.addEventListener('mousedown', pause);
        slider.addEventListener('mouseup', resume);
    });
}


// Call after a slight delay to ensure layout is applied
setTimeout(initNativeAutoScroll, 1000);

// --- Cart Functionality ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

const cartDrawer = document.getElementById('cart-drawer');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartSubtotalVal = document.getElementById('cart-subtotal-val');
const cartCountBadge = document.querySelector('.cart-count');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartLinks = document.querySelectorAll('.cart-link');

function toggleCart(show) {
    if (show) {
        if (cartDrawer) cartDrawer.classList.add('active');
        if (cartOverlay) cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        if (cartDrawer) cartDrawer.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function updateCartUI() {
    if (!cartItemsContainer) return;

    // Update Header
    const headerTitle = document.querySelector('.cart-drawer-header h3');
    let totalItems = 0;
    cart.forEach(item => totalItems += item.quantity);
    if (headerTitle) {
        headerTitle.innerHTML = `CART (${totalItems})`;
    }

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
        if (cartSubtotalVal) cartSubtotalVal.innerHTML = 'Rs. 0';
        if (cartCountBadge) cartCountBadge.innerText = '0';
        return;
    }

    // Add "Products" label
    const label = document.createElement('span');
    label.className = 'cart-section-label';
    label.innerText = 'Products';
    cartItemsContainer.appendChild(label);

    let subtotal = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        // Mockuo old price (estimate or use a field if available)
        const oldPrice = item.price * 1.2;

        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price-row">
                    <span class="cart-item-price">Rs. ${item.price.toLocaleString()}</span>
                    <span class="cart-item-old-price">Rs. ${Math.round(oldPrice).toLocaleString()}</span>
                </div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
                <span class="remove-item-text" onclick="deleteCartItem(${index})">REMOVE</span>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    if (cartSubtotalVal) {
        cartSubtotalVal.innerHTML = `Rs. ${subtotal.toLocaleString()} <small>PKR</small>`;
    }
    if (cartCountBadge) cartCountBadge.innerText = totalItems;
}

window.addToCart = function (product, openDrawer = false) {
    // Check if item already exists
    const existingItem = cart.find(item => item.title === product.title);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    if (openDrawer) {
        toggleCart(true);
    }
};

window.changeQuantity = function (index, delta) {
    if (cart[index]) {
        cart[index].quantity += delta;
        if (cart[index].quantity < 1) cart[index].quantity = 1;
        saveCart();
        updateCartUI();
    }
};

window.deleteCartItem = function (index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
};

// Event Listeners for Cart
if (cartLinks.length > 0) {
    cartLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart(true);
        });
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => toggleCart(false));
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', () => toggleCart(false));
}

// Redirect to product page on "+" click with category capture
document.addEventListener('click', function (e) {
    const addBtn = e.target.closest('.ribbon-add');
    if (addBtn) {
        const productCard = addBtn.closest('.date-card');
        if (productCard) {
            const titleEl = productCard.querySelector('.product-title');
            const priceEl = productCard.querySelector('.product-price');
            const imgEl = productCard.querySelector('.product-img img');

            if (titleEl && priceEl && imgEl) {
                const title = titleEl.innerText;
                const priceText = priceEl.innerText;
                const price = parseInt(priceText.replace(/[^0-9]/g, ''));
                const image = imgEl.src;

                // Handle Quick Add (direct add to cart without redirect/drawer)
                if (addBtn.classList.contains('quick-add')) {
                    e.preventDefault();
                    if (window.addToCart) {
                        window.addToCart({ title, price, image }, false);

                        // Visual feedback
                        const icon = addBtn.querySelector('i');
                        if (icon) {
                            const originalClass = icon.className;
                            icon.className = 'fa-solid fa-check';
                            setTimeout(() => {
                                icon.className = originalClass;
                            }, 1500);
                        }
                    }
                    return;
                }

                // Normal behavior: Capture category and redirect
                const container = productCard.closest('.container');
                let category = 'Dates'; // Default
                if (container) {
                    const header = container.querySelector('h2');
                    if (header) {
                        const text = header.innerText.toLowerCase();
                        if (text.includes('talbeena')) category = 'Talbeena';
                        else if (text.includes('honey')) category = 'Honey';
                        else if (text.includes('dates')) category = 'Dates';
                    }
                }

                // Store in localStorage including category
                localStorage.setItem('selectedProduct', JSON.stringify({ title, price, image, category }));

                // Redirect to static page if exists, otherwise dynamic
                if (title === 'Ajwa Dates') {
                    window.location.href = 'ajwa-dates.html';
                } else if (title === 'Ajwa Talbeena') {
                    window.location.href = 'ajwa-talbeena.html';
                } else if (title === 'Sidr Honey') {
                    window.location.href = 'sidr-honey.html';
                } else {
                    window.location.href = 'productpage.html';
                }
            }
        }
    }
});
// --- Search Functionality ---
const searchProducts = [
    // Dates
    { title: 'Ajwa Dates', category: 'Dates', price: 'Rs. 1,200', image: 'assets/img/cards/dates/AjwaDates-500g_600x.jpg', link: 'ajwa-dates.html' },
    { title: 'Sukri Dates', category: 'Dates', price: 'Rs. 800', image: 'assets/img/cards/dates/SukriDates-500g_39fce904-d553-455b-9008-490170e31c85_600x.jpg', link: 'sukri-dates.html' },
    { title: 'Irani Dates', category: 'Dates', price: 'Rs. 600', image: 'assets/img/cards/dates/IraniDates-500g_600x.jpg', link: 'irani-dates.html' },
    { title: 'Ajwa Jumbo Dates', category: 'Dates', price: 'Rs. 1,500', image: 'assets/img/cards/dates/Ajwa_Jumbo_Dates-500g_600x.jpg', link: 'ajwa-jumbo-dates.html' },
    { title: 'Kalmi Dates', category: 'Dates', price: 'Rs. 900', image: 'assets/img/cards/dates/KalmiDates-500g_a5f219b1-eed4-47d0-a016-f0eadc278cf9_600x.jpg', link: 'kalmi-dates.html' },
    { title: 'Amber Dates', category: 'Dates', price: 'Rs. 1,100', image: 'assets/img/cards/dates/AmberDates-500g_600x.jpg', link: 'amber-dates.html' },

    // Talbeena
    { title: 'Ajwa Talbeena', category: 'Talbeena', price: 'Rs. 950', image: 'assets/img/cards/talbeena/Ajwa_Talbeena.jpg', link: 'ajwa-talbeena.html' },
    { title: 'Pistachio Talbeena', category: 'Talbeena', price: 'Rs. 1,050', image: 'assets/img/cards/talbeena/Pistachio-Talbeena.jpg', link: 'pistachio-talbeena.html' },
    { title: 'Strawberry Talbeena', category: 'Talbeena', price: 'Rs. 850', image: 'assets/img/cards/talbeena/Strawberry_Talbeena.jpg', link: 'strawberry-talbeena.html' },
    { title: 'Almond Talbeena', category: 'Talbeena', price: 'Rs. 950', image: 'assets/img/cards/talbeena/Almond_with_Extra_Nuts_Talbeena.jpg', link: 'almond-talbeena.html' },
    { title: 'Sugar Free Talbeena', category: 'Talbeena', price: 'Rs. 900', image: 'assets/img/cards/talbeena/Talbeena_Sugar_free.jpg', link: 'sugar-free-talbeena.html' },
    { title: 'Qulfa Talbeena', category: 'Talbeena', price: 'Rs. 850', image: 'assets/img/cards/talbeena/qulfa_talbeena.jpg', link: 'qulfa-talbeena.html' },

    // Honey
    { title: 'Acacia Honey', category: 'Honey', price: 'Rs. 1,800', image: 'assets/img/cards/honey/Acacia Honey.png', link: 'acacia-honey.html' },
    { title: 'Sidr Honey', category: 'Honey', price: 'Rs. 2,500', image: 'assets/img/cards/honey/Sidr Beri Honey.png', link: 'sidr-honey.html' },
    { title: 'Olive Blossom Honey', category: 'Honey', price: 'Rs. 2,200', image: 'assets/img/cards/honey/Olive Blossom Honey.png', link: 'olive-blossom-honey.html' },

    // Nuts (referenced from images)
    { title: 'Premium Walnuts', category: 'Nuts', price: 'Rs. 1,400', image: 'assets/img/cards/Walnuts-icon.png', link: '#' },
    { title: 'Premium Almonds', category: 'Nuts', price: 'Rs. 1,200', image: 'assets/img/cards/badam-icon.png', link: '#' },
    { title: 'Premium Pistachios', category: 'Nuts', price: 'Rs. 1,600', image: 'assets/img/cards/Pistachios-icon.png', link: '#' }
];

const trendingKeywords = [
    'Ajwa Dates', 'Talbeena', 'Pure Honey', 'Almonds', 'Walnuts', 'Combo Deals', 'Kalmi Dates', 'Sidr Honey'
];

function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    // Show trending on focus/click if empty
    const showTrendingIfEmpty = () => {
        if (searchInput.value.trim() === '') {
            displayTrending();
        }
    };

    searchInput.addEventListener('focus', showTrendingIfEmpty);
    searchInput.addEventListener('click', showTrendingIfEmpty);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length === 0) {
            displayTrending();
            return;
        }

        // Filter and Sort for relevance
        const matches = searchProducts
            .filter(p => {
                const title = p.title.toLowerCase();
                const category = p.category.toLowerCase();

                // If query is 1 char, be strict: only show if a word STARTS with it
                if (query.length === 1) {
                    return title.startsWith(query) || title.split(' ').some(word => word.startsWith(query)) || category.startsWith(query);
                }

                // If query > 1 char, be inclusive: show if it contains the query anywhere
                return title.includes(query) || category.includes(query);
            })
            .sort((a, b) => {
                const aTitle = a.title.toLowerCase();
                const bTitle = b.title.toLowerCase();

                // Check if starts with query (higher priority)
                const aStarts = aTitle.startsWith(query) || aTitle.split(' ').some(word => word.startsWith(query));
                const bStarts = bTitle.startsWith(query) || bTitle.split(' ').some(word => word.startsWith(query));

                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;

                // Secondary: shorter titles first
                return a.title.length - b.title.length;
            });

        displaySearchResults(matches, query);
    });

    function displayTrending() {
        searchResults.innerHTML = `
            <div class="trending-searches">
                <span class="trending-title">Trending Searches</span>
                <div class="trending-tags">
                    ${trendingKeywords.map(kw => `<a href="#" class="trending-tag">${kw}</a>`).join('')}
                </div>
            </div>
        `;

        // Add click events to tags
        searchResults.querySelectorAll('.trending-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                e.preventDefault();
                searchInput.value = tag.innerText;
                // Trigger input event to show results
                searchInput.dispatchEvent(new Event('input'));
            });
        });

        searchResults.classList.add('active');
    }

    function displaySearchResults(matches, query) {
        searchResults.innerHTML = '';

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No products found.</div>';
        } else {
            // Header
            const header = document.createElement('div');
            header.className = 'search-popup-header';
            header.innerHTML = 'Products';
            searchResults.appendChild(header);

            // Results list
            const list = document.createElement('div');
            list.className = 'search-results-list';

            matches.slice(0, 5).forEach(product => {
                const item = document.createElement('a');
                item.href = product.link;
                item.className = 'search-result-item';
                item.innerHTML = `
                    <div class="search-result-img-container">
                        <img src="${product.image}" alt="${product.title}" class="search-result-img">
                    </div>
                    <div class="search-result-info">
                        <span class="search-result-title">${product.title}</span>
                        <span class="search-result-price">${product.price}</span>
                    </div>
                `;
                list.appendChild(item);
            });
            searchResults.appendChild(list);

            // Footer
            const footer = document.createElement('a');
            footer.href = '#'; // Could link to a full search results page
            footer.className = 'search-popup-footer';
            footer.innerHTML = `
                <span>Search for "${query}"</span>
                <i class="fa-solid fa-arrow-right"></i>
            `;
            searchResults.appendChild(footer);
        }
        searchResults.classList.add('active');
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }

        // Profile Dropdown Toggle/Close
        const profileDropdown = document.querySelector('.profile-dropdown');
        const profileMenu = document.querySelector('.profile-menu');
        if (profileDropdown && profileMenu) {
            if (profileDropdown.contains(e.target)) {
                // Toggle if clicking the icon link itself
                if (e.target.closest('.icon-link')) {
                    e.preventDefault();
                    profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
                }
            } else {
                profileMenu.style.display = 'none';
            }
        }
    });

    // Handle Enter key
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const activeResult = searchResults.querySelector('.search-result-item');
            if (activeResult) {
                window.location.href = activeResult.href;
            }
        }
    });
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    initSearch(); // Initialize search
});

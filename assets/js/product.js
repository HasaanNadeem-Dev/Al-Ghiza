/* --- Related Products Data --- */
const productsData = {
    'Dates': [
        { title: 'Irani Dates', price: 375, image: 'assets/img/cards/dates/IraniDates-500g_600x.jpg', link: 'irani-dates.html', rating: 'Be the first to review' },
        { title: 'Ajwa Dates', price: 1050, image: 'assets/img/cards/dates/AjwaDates-500g_600x.jpg', link: 'ajwa-dates.html', rating: 'Be the first to review' },
        { title: 'Ajwa Dates - Large', price: 1270, image: 'assets/img/cards/dates/Ajwa_Jumbo_Dates-500g_600x.jpg', link: 'ajwa-jumbo-dates.html', rating: 'Be the first to review' },
        { title: 'Sukri Dates', price: 850, image: 'assets/img/cards/dates/SukriDates-500g_39fce904-d553-455b-9008-490170e31c85_600x.jpg', link: 'sukri-dates.html', rating: 'Be the first to review' },
        { title: 'Kalmi Dates', price: 1040, image: 'assets/img/cards/dates/KalmiDates-500g_a5f219b1-eed4-47d0-a016-f0eadc278cf9_600x.jpg', link: 'kalmi-dates.html', rating: 'Be the first to review' },
        { title: 'Amber Dates', price: 1300, image: 'assets/img/cards/dates/AmberDates-500g_600x.jpg', link: 'amber-dates.html', rating: 'Be the first to review' }
    ],
    'Talbeena': [
        { title: 'Ajwa Talbeena', price: 1200, image: 'assets/img/cards/talbeena/Ajwa_Talbeena.jpg', link: 'ajwa-talbeena.html', rating: 'Be the first to review' },
        { title: 'Pistachio Talbeena', price: 1450, image: 'assets/img/cards/talbeena/Pistachio-Talbeena.jpg', link: 'pistachio-talbeena.html', rating: 'Be the first to review' },
        { title: 'Strawberry Talbeena', price: 1100, image: 'assets/img/cards/talbeena/Strawberry_Talbeena.jpg', link: 'strawberry-talbeena.html', rating: 'Be the first to review' },
        { title: 'Almond with Extra Nuts', price: 1550, image: 'assets/img/cards/talbeena/Talbeena_Almond_with_extra_nuts.jpg', link: 'almond-talbeena.html', rating: 'Be the first to review' },
        { title: 'Sugar Free Talbeena', price: 950, image: 'assets/img/cards/talbeena/Talbeena_Sugar_free.jpg', link: 'sugar-free-talbeena.html', rating: 'Be the first to review' },
        { title: 'Qulfa Talbeena', price: 1050, image: 'assets/img/cards/talbeena/qulfa_talbeena.jpg', link: 'qulfa-talbeena.html', rating: 'Be the first to review' }
    ],
    'Honey': [
        { title: 'Acacia Honey', price: 1500, image: 'assets/img/cards/honey/Acacia Honey.png', link: 'acacia-honey.html', rating: 'Be the first to review' },
        { title: 'Eucalyptus Honey', price: 1350, image: 'assets/img/cards/honey/Eucalyptus Honey.png', link: 'eucalyptus-honey.html', rating: 'Be the first to review' },
        { title: 'Olive Blossom Honey', price: 1800, image: 'assets/img/cards/honey/Olive Blossom Honey.png', link: 'olive-blossom-honey.html', rating: 'Be the first to review' },
        { title: 'Orange Blossom Honey', price: 1650, image: 'assets/img/cards/honey/Orange Blossom Honey.png', link: 'orange-blossom-honey.html', rating: 'Be the first to review' },
        { title: 'Robinia Honey', price: 1400, image: 'assets/img/cards/honey/Robinia Honey.png', link: 'robinia-honey.html', rating: 'Be the first to review' },
        { title: 'Sidr (Beri) Honey', price: 2500, image: 'assets/img/cards/honey/Sidr Beri Honey.png', link: 'sidr-beri-honey.html', rating: 'Be the first to review' }
    ]
};

// --- Gallery Image Switching ---
window.switchImage = function (thumb) {
    const mainImg = document.getElementById('main-product-img');
    if (mainImg) {
        mainImg.src = thumb.src;
        // Update active class
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    }
};

// --- Related Products Loader ---
function loadRelatedProducts() {
    const grid = document.getElementById('related-products-grid');
    const category = window.productCategory || 'Dates';

    if (!grid || !productsData[category]) return;

    // Add category-specific class for CSS targeting (e.g., talbeena-grid, honey-grid)
    if (category === 'Talbeena') grid.classList.add('talbeena-grid');
    if (category === 'Honey') grid.classList.add('honey-grid');

    grid.innerHTML = '';
    const products = productsData[category];

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'date-card';
        card.innerHTML = `
            <div class="badge-discount">Related Product</div>
            <div class="product-img">
                <a href="${product.link}"><img src="${product.image}" alt="${product.title}"></a>
            </div>
            <div class="product-info">
                <h3 class="product-title"><a href="${product.link}">${product.title}</a></h3>
                <div class="weight-options">
                    <span class="opt active">500g</span>
                    <span class="opt">1kg</span>
                </div>
                <div class="product-rating">
                    ${product.rating === 'Be the first to review' ? '' : '<i class="fa-solid fa-star"></i> '}${product.rating}
                </div>
                <div class="product-price">Rs.${product.price.toLocaleString()}</div>
            </div>
            <div class="product-footer">
                <a href="${product.link}" class="ribbon-add quick-add">
                    <i class="fa-solid fa-plus"></i>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// --- Add Current Product to Cart ---
window.addToCartCurrent = function () {
    const titleEl = document.querySelector('.product-main-title');
    const priceEl = document.querySelector('.price-large');
    const imageEl = document.getElementById('main-product-img');
    const btn = document.querySelector('.btn-add-bucket');

    if (!titleEl || !priceEl || !imageEl) {
        console.error('Product elements not found');
        return;
    }

    const title = titleEl.innerText;
    const priceText = priceEl.innerText;
    const price = parseInt(priceText.replace(/,/g, ''));
    const image = imageEl.src;

    if (window.addToCart) {
        window.addToCart({ title, price, image }, false);

        // Visual feedback
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Added!';
            btn.style.backgroundColor = '#3E2723';
            btn.style.color = '#fff';

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 2000);
        }
    } else {
        console.error('addToCart function not found in global scope');
    }
};

// --- Review System Logic ---
function initReviewSystem() {
    const starInputWrapper = document.querySelector('.rating-stars-input');
    const reviewForm = document.querySelector('.review-form');
    const reviewsList = document.querySelector('.reviews-list');
    const productTitle = document.querySelector('.product-main-title')?.innerText || 'default_product';
    const storageKey = `reviews_${productTitle.replace(/\s+/g, '_').toLowerCase()}`;

    let selectedRating = 0;
    let reviews = JSON.parse(localStorage.getItem(storageKey)) || [];
    let currentSort = 'recent';
    let currentFilter = 'all'; // New filter state

    // Initialize UI
    updateReviewUI();
    initSortDropdown();
    initFilterDropdown(); // Initialize filter dropdown

    if (starInputWrapper) {
        const stars = starInputWrapper.querySelectorAll('i');
        stars.forEach((star, index) => {
            star.addEventListener('mouseover', () => highlightStars(stars, index + 1));
            star.addEventListener('mouseout', () => highlightStars(stars, selectedRating));
            star.addEventListener('click', () => {
                selectedRating = index + 1;
                highlightStars(stars, selectedRating);
            });
        });
    }

    function highlightStars(stars, count) {
        stars.forEach((star, i) => {
            if (i < count) {
                star.classList.remove('fa-regular');
                star.classList.add('fa-solid', 'active');
            } else {
                star.classList.remove('fa-solid', 'active');
                star.classList.add('fa-regular');
            }
        });
    }

    function initSortDropdown() {
        const dropdownItems = document.querySelectorAll('.sort-dropdown .dropdown-item');
        const currentSortEl = document.querySelector('.sort-dropdown .current-sort');

        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                const sortType = item.getAttribute('data-sort');
                currentSort = sortType;

                // Update UI active state
                dropdownItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                if (currentSortEl) {
                    currentSortEl.innerText = item.innerText.split(':').pop().trim();
                }

                updateReviewUI();
            });
        });
    }

    function initFilterDropdown() {
        const dropdownItems = document.querySelectorAll('.filter-star-dropdown .dropdown-item');
        const currentFilterEl = document.querySelector('.filter-star-dropdown .current-filter');

        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                const filterVal = item.getAttribute('data-filter');
                currentFilter = filterVal;

                // Update UI active state
                dropdownItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                if (currentFilterEl) {
                    currentFilterEl.innerText = item.innerText.split(':').pop().trim();
                }

                updateReviewUI();
            });
        });
    }

    function updateReviewUI() {
        if (!reviewsList) return;

        // 1. Filter Reviews
        let filteredReviews = [...reviews];
        if (currentFilter !== 'all') {
            const starCount = parseInt(currentFilter);
            filteredReviews = filteredReviews.filter(r => r.rating === starCount);
        }

        // 2. Sort Reviews
        let sortedReviews = [...filteredReviews];
        if (currentSort === 'recent') {
            sortedReviews.sort((a, b) => b.timestamp - a.timestamp);
        } else if (currentSort === 'high') {
            sortedReviews.sort((a, b) => b.rating - a.rating);
        } else if (currentSort === 'low') {
            sortedReviews.sort((a, b) => a.rating - b.rating);
        } else if (currentSort === 'relevance') {
            // Keep original order or implement verified priority
            sortedReviews.reverse();
        }

        // 3. Update List (Show max 5)
        reviewsList.innerHTML = '';
        if (sortedReviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="no-reviews-msg" style="padding: 20px; color: #7E7E7E;">
                    ${currentFilter === 'all' ? 'No reviews yet. Be the first to review this product!' : 'No reviews found for this star rating.'}
                </div>`;
        } else {
            const displayReviews = sortedReviews.slice(0, 5);
            displayReviews.forEach(rev => {
                const item = document.createElement('div');
                item.className = 'review-item';
                item.setAttribute('data-id', rev.timestamp);

                const starsHtml = Array.from({ length: 5 }, (_, i) =>
                    `<i class="fa-solid fa-star${i < rev.rating ? '' : ' fa-regular'}" style="color: ${i < rev.rating ? '#FFB800' : '#DDD'}"></i>`
                ).join('');

                item.innerHTML = `
                    <div class="review-meta">
                        <div class="review-meta-top">
                            <div class="stars">${starsHtml}</div>
                            <span class="review-date">${rev.date}</span>
                        </div>
                        <div class="reviewer-info">
                            <span class="reviewer-name">${rev.name}</span>
                            <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified Purchase</span>
                        </div>
                    </div>
                    <p class="review-content">"${rev.content}"</p>
                    <div class="review-actions">
                        <div class="like-btn ${rev.liked ? 'liked' : ''}" onclick="toggleLike(${rev.timestamp})">
                            <i class="fa-${rev.liked ? 'solid' : 'regular'} fa-thumbs-up"></i>
                            <span class="like-count">${rev.likes || 0}</span>
                        </div>
                    </div>
                `;
                reviewsList.appendChild(item);
            });
        }

        // 4. Update Summary
        updateSummarySection();
    }

    // Like function globally accessible for onclick
    window.toggleLike = function (timestamp) {
        const reviewIndex = reviews.findIndex(r => r.timestamp === timestamp);
        if (reviewIndex !== -1) {
            const review = reviews[reviewIndex];
            if (review.liked) {
                review.likes = Math.max(0, (review.likes || 1) - 1);
                review.liked = false;
            } else {
                review.likes = (review.likes || 0) + 1;
                review.liked = true;
            }
            localStorage.setItem(storageKey, JSON.stringify(reviews));
            updateReviewUI();
        }
    };

    function updateSummarySection() {
        const totalRatingsEl = document.querySelector('.total-ratings-count');
        const totalSoldEl = document.querySelector('.total-sold-count');
        const ratingScoreEl = document.querySelector('.rating-score');
        const summaryStars = document.querySelectorAll('.overall-rating .stars i');
        const ratingBars = document.querySelectorAll('.rating-bar-item');

        const totalCount = reviews.length;
        if (totalRatingsEl) totalRatingsEl.innerText = `${totalCount} Ratings`;
        if (totalSoldEl) totalSoldEl.innerText = `${totalCount} Sold`;

        if (totalCount === 0) {
            if (ratingScoreEl) ratingScoreEl.innerHTML = `0.0<span>/5</span>`;
            summaryStars.forEach(s => s.className = 'fa-regular fa-star');
            ratingBars.forEach(bar => {
                bar.querySelector('.bar-count').innerText = '0';
                bar.querySelector('.progress-bar-fill').style.width = '0%';
            });
            return;
        }

        // Calculate distribution
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let totalScore = 0;
        reviews.forEach(r => {
            counts[r.rating]++;
            totalScore += r.rating;
        });

        const avgScore = (totalScore / totalCount).toFixed(1);
        if (ratingScoreEl) ratingScoreEl.innerHTML = `${avgScore}<span>/5</span>`;

        // Update Summary Stars
        summaryStars.forEach((star, i) => {
            star.className = (i < Math.round(avgScore)) ? 'fa-solid fa-star' : 'fa-regular fa-star';
        });

        // Update Bars
        ratingBars.forEach(bar => {
            const scoreLabel = parseInt(bar.querySelector('.star-label').innerText);
            const count = counts[scoreLabel];
            bar.querySelector('.bar-count').innerText = count;
            const percent = (count / totalCount) * 100;
            bar.querySelector('.progress-bar-fill').style.width = `${percent}%`;
        });

        // 3. Update top rating row (Product Info Section)
        const topStars = document.querySelectorAll('.product-info-section .rating-row .stars i');
        const topRatingText = document.querySelector('.product-info-section .rating-row .rating-text');

        if (topRatingText) {
            if (totalCount === 0) {
                topRatingText.innerText = 'Be the first to review';
            } else {
                topRatingText.innerText = `${avgScore} (${totalCount} reviews)`;
            }
        }
        if (topStars.length > 0) {
            topStars.forEach((star, i) => {
                if (totalCount === 0) {
                    star.className = 'fa-regular fa-star';
                } else {
                    star.className = (i < Math.round(avgScore)) ? 'fa-solid fa-star' : 'fa-regular fa-star';
                }
            });
        }
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (selectedRating === 0) {
                alert('Please select a rating');
                return;
            }

            const name = reviewForm.querySelector('input[placeholder="Enter your name"]').value;
            const content = reviewForm.querySelector('textarea').value;

            if (!name || !content) {
                alert('Please fill in your name and review details');
                return;
            }

            const newReview = {
                name,
                content,
                rating: selectedRating,
                date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
                timestamp: Date.now(),
                likes: 0,
                liked: false
            };

            // Save and re-render
            reviews.push(newReview);
            localStorage.setItem(storageKey, JSON.stringify(reviews));

            updateReviewUI();

            // Success feedback
            const submitBtn = reviewForm.querySelector('.btn-submit-review');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = 'Review Published!';
            submitBtn.style.backgroundColor = '#28a745';

            reviewForm.reset();
            selectedRating = 0;
            if (starInputWrapper) highlightStars(starInputWrapper.querySelectorAll('i'), 0);

            setTimeout(() => {
                submitBtn.innerText = originalText;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRelatedProducts();
    initReviewSystem();
});

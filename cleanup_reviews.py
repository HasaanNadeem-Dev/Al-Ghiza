import os
import re

directory = r'd:\web an app\html,css\2\AlGhiza'
files = [
    'acacia-honey.html', 'ajwa-dates.html', 'ajwa-jumbo-dates.html', 'ajwa-talbeena.html',
    'almond-talbeena.html', 'amber-dates.html', 'eucalyptus-honey.html', 'irani-dates.html',
    'kalmi-dates.html', 'olive-blossom-honey.html', 'orange-blossom-honey.html',
    'pistachio-talbeena.html', 'productpage.html', 'qulfa-talbeena.html', 'robinia-honey.html',
    'sidr-beri-honey.html', 'sidr-honey.html', 'strawberry-talbeena.html',
    'sugar-free-talbeena.html', 'sukri-dates.html'
]

summary_reset = """                <!-- Reviews Summary -->
                <div class="reviews-summary">
                    <div class="overall-rating">
                        <div class="rating-score">0.0<span>/5</span></div>
                        <div class="stars">
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                            <i class="fa-regular fa-star"></i>
                        </div>
                        <div class="total-ratings-count">0 Ratings</div>
                        <div class="total-sold-count">0 Sold</div>
                    </div>
                    <div class="rating-bars">
                        <div class="rating-bar-item">
                            <div class="star-label">5 <i class="fa-solid fa-star"></i></div>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 0%;"></div></div>
                            <div class="bar-count">0</div>
                        </div>
                        <div class="rating-bar-item">
                            <div class="star-label">4 <i class="fa-solid fa-star"></i></div>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 0%;"></div></div>
                            <div class="bar-count">0</div>
                        </div>
                        <div class="rating-bar-item">
                            <div class="star-label">3 <i class="fa-solid fa-star"></i></div>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 0%;"></div></div>
                            <div class="bar-count">0</div>
                        </div>
                        <div class="rating-bar-item">
                            <div class="star-label">2 <i class="fa-solid fa-star"></i></div>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 0%;"></div></div>
                            <div class="bar-count">0</div>
                        </div>
                        <div class="rating-bar-item">
                            <div class="star-label">1 <i class="fa-solid fa-star"></i></div>
                            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: 0%;"></div></div>
                            <div class="bar-count">0</div>
                        </div>
                    </div>
                </div>"""

list_reset = """                    <!-- Left: Reviews List -->
                    <div class="reviews-list">
                        <!-- No reviews yet -->
                        <div class="no-reviews-msg" style="padding: 20px; color: #7E7E7E;">
                            No reviews yet. Be the first to review this product!
                        </div>
                    </div>"""

def process_file(filename):
    path = os.path.join(directory, filename)
    if not os.path.exists(path):
        print(f"File not found: {filename}")
        return

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace summary
    content = re.sub(r'<!-- Reviews Summary -->.*?<div class="rating-bars">.*?</div>\s*</div>', summary_reset, content, flags=re.DOTALL)
    
    # Replace list
    content = re.sub(r'<!-- Left: Reviews List -->.*?<div class="reviews-list">.*?</div>\s*(?=<!-- Right: Review Form -->)', list_reset + '\n\n', content, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated: {filename}")

for f in files:
    process_file(f)

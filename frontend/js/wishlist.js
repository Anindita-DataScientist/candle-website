// Wishlist storage, actions, and favourites page rendering.
function getWishlist() {
  const wishlist = localStorage.getItem("candle_wishlist");
  return wishlist ? JSON.parse(wishlist) : [];
}

function saveWishlist(wishlist) {
  localStorage.setItem("candle_wishlist", JSON.stringify(wishlist));
  updateNavBadges();
}

function toggleWishlist(productId) {
  let wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  let added = false;

  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
    added = true;
  }

  saveWishlist(wishlist);
  showToast(added ? "Added to Favourites" : "Removed from Favourites");
  return added;
}

function isInWishlist(productId) {
  return getWishlist().includes(productId);
}

function loadWishlistPage() {
  const container = document.getElementById("wishlist-page-content-wrapper");
  if (!container) return;

  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card glass-card text-center">
        <i class="fa-regular fa-heart empty-icon"></i>
        <h2 class="font-serif">No Favourites Saved Yet</h2>
        <p class="muted-text">Curate your royal preferences by clicking the heart on any luxury candle.</p>
        <a href="products.html" class="btn btn-primary">Discover the Collection</a>
      </div>
    `;
    return;
  }

  const wishlistProducts = PRODUCTS.filter(p => wishlist.includes(p.id));

  container.innerHTML = `
    <h2 class="wishlist-section-title font-serif text-center">Your Curated Pleasures</h2>
    <div class="wishlist-grid">
      ${wishlistProducts.map(p => `
        <div class="wishlist-card glass-card">
          <div class="wishlist-info">
            <button class="wishlist-card-remove-btn" onclick="handleCardWishlistClick(event, '${p.id}')">
              &times;
            </button>
            <span class="wishlist-card-category">${p.category}</span>
            <h3 class="wishlist-card-title font-serif">
              <a href="product-detail.html?id=${p.id}">${p.name}</a>
            </h3>
            <div class="wishlist-card-price">Rs. ${p.price.toLocaleString("en-IN")}</div>

            <div class="wishlist-card-actions">
              <button class="btn btn-secondary" onclick="openQuickView('${p.id}')">Quick View</button>
              <button class="btn btn-primary" onclick="addToCart('${p.id}', 1)">Add to Bag</button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

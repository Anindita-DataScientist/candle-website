// Product cards, product listing, quick view, and product detail rendering.
let currentCategory = "All";
let currentSubcategory = "All";
let currentSort = "default";
let searchString = "";

function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const modal = document.createElement("div");
  modal.className = "luxury-modal";
  modal.id = `modal-${product.id}`;

  const isWish = isInWishlist(product.id);
  const heartClass = isWish ? "fa-solid fa-heart active" : "fa-regular fa-heart";

  modal.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-content glass-card">
      <button class="modal-close-btn" aria-label="Close Modal">&times;</button>
      <div class="modal-body-grid">
        <div class="modal-details-wrapper">
          <div class="modal-category">${product.category} &bull; ${product.subcategory}</div>
          <h2 class="modal-title font-serif">${product.name}</h2>
          <div class="modal-price">Rs. ${product.price.toLocaleString("en-IN")}</div>
          <p class="modal-description">${product.description}</p>

          <div class="modal-specs">
            <div><strong>Burn Time:</strong> ${product.burnTime}</div>
            <div><strong>Net Weight:</strong> ${product.size}</div>
          </div>

          <div class="modal-fragrance-notes">
            <h4 class="font-serif">Fragrance Notes</h4>
            <div class="notes-grid">
              <div class="note-item"><strong>Top:</strong> ${product.fragranceNotes.top}</div>
              <div class="note-item"><strong>Heart:</strong> ${product.fragranceNotes.heart}</div>
              <div class="note-item"><strong>Base:</strong> ${product.fragranceNotes.base}</div>
            </div>
          </div>

          <div class="modal-actions-container">
            <div class="quantity-controller">
              <button class="qty-btn qty-dec">-</button>
              <input type="number" class="qty-input" value="1" min="1" max="10" readonly>
              <button class="qty-btn qty-inc">+</button>
            </div>
            <button class="btn btn-primary add-to-bag-modal-btn">Add to Bag</button>
            <button class="wishlist-toggle-btn" aria-label="Wishlist">
              <i class="${heartClass}"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = "hidden";

  const closeBtn = modal.querySelector(".modal-close-btn");
  const backdrop = modal.querySelector(".modal-backdrop");

  const closeModal = () => {
    modal.classList.add("closing");
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = "";
    }, 300);
  };

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", closeModal);

  const decBtn = modal.querySelector(".qty-dec");
  const incBtn = modal.querySelector(".qty-inc");
  const qtyInput = modal.querySelector(".qty-input");

  decBtn.addEventListener("click", () => {
    let val = parseInt(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
  });

  incBtn.addEventListener("click", () => {
    let val = parseInt(qtyInput.value);
    if (val < 10) qtyInput.value = val + 1;
  });

  const addBtn = modal.querySelector(".add-to-bag-modal-btn");
  addBtn.addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);
    addToCart(product.id, qty);
    closeModal();
  });

  const wishBtn = modal.querySelector(".wishlist-toggle-btn");
  const wishIcon = wishBtn.querySelector("i");
  wishBtn.addEventListener("click", () => {
    const added = toggleWishlist(product.id);
    wishIcon.className = added ? "fa-solid fa-heart active" : "fa-regular fa-heart";
  });

  setTimeout(() => {
    modal.classList.add("is-visible");
  }, 10);
}

function createProductCard(product) {
  const isWish = isInWishlist(product.id);
  const heartClass = isWish ? "fa-solid fa-heart active" : "fa-regular fa-heart";

  return `
    <div class="product-card glass-card" data-id="${product.id}">
      <div class="product-card-actions">
        <button class="card-wishlist-btn" aria-label="Add to Wishlist" onclick="handleCardWishlistClick(event, '${product.id}')">
          <i class="${heartClass}"></i>
        </button>
        <button class="btn btn-secondary quick-view-btn" onclick="openQuickView('${product.id}')">Quick View</button>
      </div>
      <div class="product-card-info">
        <span class="product-card-category">${product.category}</span>
        <h3 class="product-card-title font-serif">
          <a href="product-detail.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card-bottom">
          <span class="product-card-price">Rs. ${product.price.toLocaleString("en-IN")}</span>
          <button class="btn-text-gold add-to-bag-card-btn" onclick="addToCart('${product.id}', 1)">
            Add to Bag <i class="fa-solid fa-arrow-right-long"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function handleCardWishlistClick(event, id) {
  event.preventDefault();
  event.stopPropagation();

  const icon = event.currentTarget.querySelector("i");
  const added = toggleWishlist(id);

  if (icon) {
    icon.className = added ? "fa-solid fa-heart active" : "fa-regular fa-heart";
  }

  if (window.location.pathname.includes("wishlist.html")) {
    loadWishlistPage();
  }
}

function loadHomePage() {
  const container = document.getElementById("featured-products-container");
  if (!container) return;

  const featured = PRODUCTS.filter(p => p.isFeatured);
  container.innerHTML = featured.map(p => createProductCard(p)).join("");
}

function loadProductsPage() {
  const container = document.getElementById("products-grid-container");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("category");
  const subParam = urlParams.get("subcategory");

  if (catParam) currentCategory = catParam;
  if (subParam) currentSubcategory = subParam;

  const searchInput = document.getElementById("product-search");
  const sortSelect = document.getElementById("product-sort");

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchString = e.target.value.toLowerCase().trim();
      renderFilteredProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      currentSort = e.target.value;
      renderFilteredProducts();
    });
  }

  const catButtons = document.querySelectorAll(".category-filter-btn");

  catButtons.forEach(btn => {
    if (btn.getAttribute("data-category") === currentCategory) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      catButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.getAttribute("data-category");
      currentSubcategory = "All";
      updateSubcategoryFilterUI();
      renderFilteredProducts();
    });
  });

  updateSubcategoryFilterUI();
  renderFilteredProducts();
}

function updateSubcategoryFilterUI() {
  const subcatWrapper = document.getElementById("subcategory-filters-wrapper");
  if (!subcatWrapper) return;

  subcatWrapper.innerHTML = "";

  let subcategories = ["All"];
  const filteredProducts = currentCategory === "All"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === currentCategory);

  filteredProducts.forEach(p => {
    if (!subcategories.includes(p.subcategory)) {
      subcategories.push(p.subcategory);
    }
  });

  subcategories.forEach(sub => {
    const btn = document.createElement("button");
    btn.className = `subcategory-filter-btn ${sub === currentSubcategory ? "active" : ""}`;
    btn.innerText = sub;
    btn.setAttribute("data-sub", sub);
    btn.addEventListener("click", () => {
      document.querySelectorAll(".subcategory-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentSubcategory = sub;
      renderFilteredProducts();
    });
    subcatWrapper.appendChild(btn);
  });
}

function renderFilteredProducts() {
  const container = document.getElementById("products-grid-container");
  if (!container) return;

  let list = [...PRODUCTS];

  if (currentCategory !== "All") {
    list = list.filter(p => p.category === currentCategory);
  }

  if (currentSubcategory !== "All") {
    list = list.filter(p => p.subcategory === currentSubcategory);
  }

  if (searchString !== "") {
    list = list.filter(p => p.name.toLowerCase().includes(searchString) ||
      p.subcategory.toLowerCase().includes(searchString) ||
      p.description.toLowerCase().includes(searchString));
  }

  if (currentSort === "price-low") {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === "price-high") {
    list.sort((a, b) => b.price - a.price);
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty-results-container text-center">
        <p class="font-serif">No products found fitting this description.</p>
        <span class="muted-text">Try resetting your filters or search criteria.</span>
      </div>
    `;
  } else {
    container.innerHTML = list.map(p => createProductCard(p)).join("");
  }
}

function loadProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const container = document.getElementById("product-detail-page-container");
  if (!container) return;

  const product = PRODUCTS.find(p => p.id === productId) || PRODUCTS[0];
  if (!product) return;

  const isWish = isInWishlist(product.id);
  const heartClass = isWish ? "fa-solid fa-heart active" : "fa-regular fa-heart";

  container.innerHTML = `
    <div class="detail-columns">
      <div class="detail-specs-wrapper">
        <nav class="breadcrumb-nav">
          <a href="index.html">Home</a> &rarr;
          <a href="products.html">Products</a> &rarr;
          <span class="active-crumb">${product.name}</span>
        </nav>
        <span class="detail-category-tag">${product.category}</span>
        <h1 class="detail-title font-serif">${product.name}</h1>
        <div class="detail-price">Rs. ${product.price.toLocaleString("en-IN")}</div>

        <p class="detail-description">${product.description}</p>

        <div class="product-stats-table">
          <div class="stat-row">
            <span>Burn Time</span>
            <span><strong>${product.burnTime}</strong></span>
          </div>
          <div class="stat-row">
            <span>Net Weight</span>
            <span><strong>${product.size}</strong></span>
          </div>
          <div class="stat-row">
            <span>Vessel Type</span>
            <span><strong>Handcrafted Vintage Brass</strong></span>
          </div>
        </div>

        <div class="fragrance-notes-card glass-card">
          <h3 class="font-serif">Aromatherapy Profile</h3>
          <div class="fragrance-notes-pyramid">
            <div class="pyramid-level">
              <span class="level-title">Top Notes</span>
              <span class="level-desc">${product.fragranceNotes.top}</span>
            </div>
            <div class="pyramid-level">
              <span class="level-title">Heart Notes</span>
              <span class="level-desc">${product.fragranceNotes.heart}</span>
            </div>
            <div class="pyramid-level">
              <span class="level-title">Base Notes</span>
              <span class="level-desc">${product.fragranceNotes.base}</span>
            </div>
          </div>
        </div>

        <div class="detail-actions-panel">
          <div class="quantity-controller">
            <button class="qty-btn" id="detail-dec">-</button>
            <input type="number" id="detail-qty" value="1" min="1" max="10" readonly>
            <button class="qty-btn" id="detail-inc">+</button>
          </div>
          <button class="btn btn-primary" id="detail-add-bag">Add to Bag</button>
          <button class="wishlist-toggle-btn" id="detail-wishlist" aria-label="Add to Wishlist">
            <i class="${heartClass}"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  const qtyInput = document.getElementById("detail-qty");
  const decBtn = document.getElementById("detail-dec");
  const incBtn = document.getElementById("detail-inc");
  const addBtn = document.getElementById("detail-add-bag");
  const wishBtn = document.getElementById("detail-wishlist");

  decBtn.addEventListener("click", () => {
    let val = parseInt(qtyInput.value);
    if (val > 1) qtyInput.value = val - 1;
  });

  incBtn.addEventListener("click", () => {
    let val = parseInt(qtyInput.value);
    if (val < 10) qtyInput.value = val + 1;
  });

  addBtn.addEventListener("click", () => {
    const qty = parseInt(qtyInput.value);
    addToCart(product.id, qty);
  });

  wishBtn.addEventListener("click", () => {
    const icon = wishBtn.querySelector("i");
    const added = toggleWishlist(product.id);
    icon.className = added ? "fa-solid fa-heart active" : "fa-regular fa-heart";
  });
}

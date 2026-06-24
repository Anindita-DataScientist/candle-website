// Cart storage, actions, and shopping bag page rendering.
function getCart() {
  const cart = localStorage.getItem("candle_cart");
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem("candle_cart", JSON.stringify(cart));
  updateNavBadges();
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({ id: productId, quantity: quantity });
  }

  saveCart(cart);
  showToast("Added to Shopping Bag");
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  showToast("Removed from Shopping Bag");
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
}

function loadCartPage() {
  const container = document.getElementById("cart-page-content-wrapper");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state-card glass-card text-center">
        <i class="fa-solid fa-bag-shopping empty-icon"></i>
        <h2 class="font-serif">Your Shopping Bag is Empty</h2>
        <p class="muted-text">Grace your chambers with the fragrance of hand-rolled vintage candles.</p>
        <a href="products.html" class="btn btn-primary">Discover the Collection</a>
      </div>
    `;
    return;
  }

  let subtotal = 0;
  const itemsHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return "";

    const itemTotal = product.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div class="cart-item glass-card" data-id="${product.id}">
        <div class="cart-item-details">
          <div class="cart-item-header">
            <div>
              <span class="cart-item-category">${product.category}</span>
              <h3 class="cart-item-title font-serif"><a href="product-detail.html?id=${product.id}">${product.name}</a></h3>
            </div>
            <button class="cart-item-remove-btn" aria-label="Remove item" onclick="handleRemoveCartItem('${product.id}')">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
          <div class="cart-item-footer">
            <div class="quantity-controller">
              <button class="qty-btn" onclick="handleCartQtyChange('${product.id}', -1)">-</button>
              <input type="number" class="qty-input" value="${item.quantity}" readonly>
              <button class="qty-btn" onclick="handleCartQtyChange('${product.id}', 1)">+</button>
            </div>
            <div class="cart-item-price-summary">
              <span class="cart-item-unit-price">Rs. ${product.price.toLocaleString("en-IN")} each</span>
              <span class="cart-item-total-price">Rs. ${itemTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  const shipping = subtotal > 5000 ? "Free" : "Rs. 250";
  const grandTotal = subtotal > 5000 ? subtotal : subtotal + 250;

  container.innerHTML = `
    <div class="cart-layout-grid">
      <div class="cart-items-column">
        <h2 class="cart-section-title font-serif">Selected Fragrances</h2>
        <div class="cart-items-list-container">
          ${itemsHTML}
        </div>
      </div>

      <div class="cart-summary-sidebar">
        <div class="summary-card glass-card">
          <h2 class="summary-title font-serif">Order Summary</h2>
          <div class="summary-rows">
            <div class="summary-row">
              <span>Bag Subtotal</span>
              <span>Rs. ${subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div class="summary-row">
              <span>Fragrance Courier</span>
              <span>${shipping}</span>
            </div>
            <div class="summary-row highlight-gold">
              <span>Invisibly Insured Taxes</span>
              <span>Complimentary</span>
            </div>
            <hr class="summary-divider">
            <div class="summary-row grand-total font-serif">
              <span>Total Estimate</span>
              <span>Rs. ${grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div class="promo-code-container">
            <input type="text" class="promo-input" placeholder="Chamber Access Code">
            <button class="btn btn-secondary promo-btn">Apply</button>
          </div>

          <button class="btn btn-primary btn-block checkout-btn" onclick="triggerCheckout()">
            Proceed to Secure Checkout
          </button>

          <div class="checkout-assurance">
            <i class="fa-solid fa-shield-halved"></i> Secured with ancient grace & high-grade encryption.
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleCartQtyChange(productId, change) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item) {
    const newQty = item.quantity + change;

    if (newQty <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, newQty);
    }

    loadCartPage();
  }
}

function handleRemoveCartItem(productId) {
  removeFromCart(productId);
  loadCartPage();
}

function triggerCheckout() {
  alert("Initiating luxurious checkout chambers. (Integration mock successful!)");
}

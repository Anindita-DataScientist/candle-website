// Shared UI helpers and page startup.
document.addEventListener("DOMContentLoaded", () => {
  setupNavbar();
  updateNavBadges();
  loadCurrentPage();
});

function loadCurrentPage() {
  const path = window.location.pathname;

  if (path.includes("products.html")) {
    loadProductsPage();
  } else if (path.includes("product-detail.html")) {
    loadProductDetailPage();
  } else if (path.includes("cart.html")) {
    loadCartPage();
  } else if (path.includes("wishlist.html")) {
    loadWishlistPage();
  } else if (path.includes("index.html") || path === "/" || path.endsWith("frontend/") || path.endsWith("frontend/html/")) {
    loadHomePage();
  } else {
    loadHomePage();
  }
}

function setupNavbar() {
  const burger = document.querySelector(".navbar-burger");
  const navMenu = document.querySelector(".navbar-menu");

  if (burger && navMenu) {
    burger.addEventListener("click", () => {
      burger.classList.toggle("is-active");
      navMenu.classList.toggle("is-active");
    });
  }

  const navbar = document.querySelector(".luxury-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }
}

function updateNavBadges() {
  const cartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = getWishlist().length;

  const cartBadges = document.querySelectorAll(".cart-badge");
  const wishlistBadges = document.querySelectorAll(".wishlist-badge");

  cartBadges.forEach(badge => {
    badge.innerText = cartCount;
    badge.style.display = cartCount > 0 ? "inline-flex" : "none";
  });

  wishlistBadges.forEach(badge => {
    badge.innerText = wishlistCount;
    badge.style.display = wishlistCount > 0 ? "inline-flex" : "none";
  });
}

function showToast(message) {
  const oldToast = document.querySelector(".luxury-toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.className = "luxury-toast";
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("visible");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

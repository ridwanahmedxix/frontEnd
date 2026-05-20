// ===========================
// PRODUCTS DATA
// ===========================

const productsData = [
  {
    id: 1,
    name: "Power Pro 1000VA",
    price: 299.99,
    description: "Compact 1000VA UPS with intelligent battery management.",
    category: "residential",
    rating: 4.5,
    image: "./img/ups1.jpg",
  },
  {
    id: 2,
    name: "Executive 2000VA",
    price: 449.99,
    description: "Advanced 2000VA UPS for medium-sized businesses.",
    category: "commercial",
    rating: 4.7,
    image: "./img/ups2.jpg",
  },
  {
    id: 3,
    name: "Home Guard 1500VA",
    price: 379.99,
    description: "Reliable 1500VA UPS for home and office use.",
    category: "residential",
    rating: 4.6,
    image: "./img/ups3.jpg",
  },
  {
    id: 4,
    name: "Industrial Max 3000VA",
    price: 699.99,
    description: "Heavy-duty 3000VA UPS for industrial applications.",
    category: "commercial",
    rating: 4.8,
    image: "./img/ups4.jpg",
  },
  {
    id: 5,
    name: "Smart Start 800VA",
    price: 249.99,
    description: "Lightweight 800VA UPS with smart monitoring.",
    category: "residential",
    rating: 4.4,
    image: "./img/ups5.jpg",
  },
  {
    id: 6,
    name: "Enterprise Boss 5000VA",
    price: 999.99,
    description: "Premium 5000VA UPS for enterprise-level power backup.",
    category: "commercial",
    rating: 4.9,
    image: "./img/ups6.jpg",
  },
];

// ===========================
// GLOBAL VARIABLES
// ===========================

let cart = [];
let currentFilter = "all";

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  renderProducts();
  setupEventListeners();
  updateCartCount();
});

// ===========================
// RENDER PRODUCTS
// ===========================

function renderProducts(filter = "all") {
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = "";

  const filteredProducts =
    filter === "all"
      ? productsData
      : productsData.filter((p) => p.category === filter);

  filteredProducts.forEach((product, index) => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);

    // Staggered fade-in animation
    setTimeout(() => {
      productCard.style.opacity = "1";
      productCard.style.transform = "translateY(0)";
    }, index * 50);
  });
}

// ===========================
// CREATE PRODUCT CARD
// ===========================

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.style.opacity = "0";
  card.style.transform = "translateY(20px)";
  card.style.transition = "opacity 0.5s ease, transform 0.5s ease";

  const starsHTML = createStarsHTML(product.rating);

  card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%230ea5e9%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2224%22 fill=%22white%22%3E${product.name}%3C/text%3E%3C/svg%3E'">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-rating">
                ${starsHTML}
                <span style="margin-left: 10px; color: #666;">${product.rating}</span>
            </div>
            <div class="product-footer">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

  card.querySelector(".add-to-cart").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCart(product);
  });

  return card;
}

// ===========================
// CREATE STARS RATING
// ===========================

function createStarsHTML(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star">★</span>';
  }

  if (hasHalfStar) {
    starsHTML += '<span class="star">☆</span>';
  }

  for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
    starsHTML += '<span class="star">☆</span>';
  }

  return starsHTML;
}

// ===========================
// ADD TO CART
// ===========================

function addToCart(product) {
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  updateCartCount();
  showNotification(`${product.name} added to cart!`);
}

// ===========================
// REMOVE FROM CART
// ===========================

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCart();
}

// ===========================
// UPDATE CART QUANTITY
// ===========================

function updateQuantity(productId, operation) {
  const item = cart.find((item) => item.id === productId);

  if (item) {
    if (operation === "increase") {
      item.quantity += 1;
    } else if (operation === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    } else if (operation === "decrease" && item.quantity === 1) {
      removeFromCart(productId);
      return;
    }
  }

  saveCart();
  updateCartCount();
  renderCart();
}

// ===========================
// RENDER CART
// ===========================

function renderCart() {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p class="empty-cart">Your cart is empty</p>';
    cartTotal.textContent = "0.00";
    return;
  }

  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
            <div class="cart-item-image">
                <span style="font-size: 14px;">${item.name.substring(0, 3)}</span>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 'decrease')">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 'increase')">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    cartItemsContainer.appendChild(cartItem);
  });

  cartTotal.textContent = total.toFixed(2);
}

// ===========================
// CART COUNT UPDATE
// ===========================

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = totalItems;
}

// ===========================
// LOCALSTORAGE FUNCTIONS
// ===========================

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const savedCart = localStorage.getItem("cart");
  cart = savedCart ? JSON.parse(savedCart) : [];
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// ===========================
// CART SIDEBAR FUNCTIONS
// ===========================

function toggleCartSidebar() {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");

  cartSidebar.classList.toggle("active");
  cartOverlay.classList.toggle("active");

  if (cartSidebar.classList.contains("active")) {
    renderCart();
  }
}

function closeCartSidebar() {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartOverlay = document.getElementById("cartOverlay");

  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
}

// ===========================
// FILTER FUNCTIONALITY
// ===========================

function filterProducts(category) {
  currentFilter = category;
  renderProducts(category);

  // Update active filter button
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("active");
    if (btn.dataset.filter === category) {
      btn.classList.add("active");
    }
  });
}

// ===========================
// SEARCH FUNCTIONALITY
// ===========================

function searchProducts(query) {
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = "";

  const filtered = productsData.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()),
  );

  if (filtered.length === 0) {
    productsGrid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No products found</p>';
    return;
  }

  filtered.forEach((product, index) => {
    const productCard = createProductCard(product);
    productsGrid.appendChild(productCard);

    setTimeout(() => {
      productCard.style.opacity = "1";
      productCard.style.transform = "translateY(0)";
    }, index * 50);
  });
}

// ===========================
// EVENT LISTENERS
// ===========================

function setupEventListeners() {
  // Cart icon click
  document
    .getElementById("cartIcon")
    .addEventListener("click", toggleCartSidebar);

  // Close cart button
  document
    .getElementById("closeCart")
    .addEventListener("click", closeCartSidebar);

  // Cart overlay click
  document
    .getElementById("cartOverlay")
    .addEventListener("click", closeCartSidebar);

  // Clear cart button
  document.getElementById("clearCartBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      cart = [];
      saveCart();
      updateCartCount();
      renderCart();
      showNotification("Cart cleared");
    }
  });

  // Checkout button
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
      showNotification("Your cart is empty!");
      return;
    }
    showNotification("Proceeding to checkout...");
    setTimeout(() => {
      closeCartSidebar();
    }, 2000);
  });

  // Filter buttons
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterProducts(btn.dataset.filter);
    });
  });

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      searchProducts(query);
    } else {
      renderProducts("all");
    }
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        searchProducts(query);
      } else {
        renderProducts("all");
      }
    }
  });

  // Newsletter subscription
  const emailInput = document.getElementById("emailInput");
  const newsletterBtn = document.querySelector(".newsletter-form button");

  if (newsletterBtn) {
    newsletterBtn.addEventListener("click", () => {
      const email = emailInput.value.trim();
      if (email && isValidEmail(email)) {
        showNotification("Successfully subscribed!");
        emailInput.value = "";
      } else {
        showNotification("Please enter a valid email address");
      }
    });
  }
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});

// Product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM elements
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

// sessionStorage key
const CART_STORAGE_KEY = "shoppingCart";

// --- Session Storage Utilities ---

function loadCart() {
  const cartData = sessionStorage.getItem(CART_STORAGE_KEY);
  try {
    return cartData ? JSON.parse(cartData) : [];
  } catch (e) {
    console.error("Error parsing cart data:", e);
    return [];
  }
}

function saveCart(cart) {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// --- DOM Rendering Functions ---

function renderProducts() {
  productList.innerHTML = ""; // clear in case of re-render
  products.forEach((product) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${product.name} - $${product.price.toFixed(2)}
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(li);
  });
}

function renderCart() {
  const cart = loadCart();
  cartList.innerHTML = "";

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} ($${item.price.toFixed(2)})`;
    cartList.appendChild(li);
  });
}

// --- Cart Management ---

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cart = loadCart();
  cart.push({ id: product.id, name: product.name, price: product.price });
  saveCart(cart);
  renderCart();
}

function clearCart() {
  saveCart([]);
  renderCart();
}

// --- Event Listeners ---

// Event delegation for Add to Cart buttons
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = parseInt(e.target.dataset.id);
    addToCart(productId);
  }
});

// Clear Cart button
clearCartBtn.addEventListener("click", clearCart);

// --- Initial Render ---
renderProducts();
renderCart();

// ----------------------------
//  Shopping Cart Application
// ----------------------------

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
const CART_KEY = "cart";

// --- Load Cart ---
function loadCart() {
  const data = sessionStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

// --- Save Cart ---
function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// --- Render Products ---
function renderProducts() {
  productList.innerHTML = "";
  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.name} - $${p.price}
      <button class="add-btn" data-id="${p.id}">Add to Cart</button>
    `;
    productList.appendChild(li);
  });
}

// --- Render Cart ---
function renderCart() {
  const cart = loadCart();
  cartList.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} ($${item.price})`;
    cartList.appendChild(li);
  });
}

// --- Add to Cart ---
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const cart = loadCart();
  cart.push(product);
  saveCart(cart);
  renderCart();
}

// --- Clear Cart ---
function clearCart() {
  saveCart([]);
  renderCart();
}

// --- Event Listeners ---
if (productList) {
  productList.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
      const id = parseInt(e.target.dataset.id);
      addToCart(id);
    }
  });
}

if (clearCartBtn) {
  clearCartBtn.addEventListener("click", clearCart);
}

// --- Initial Render ---
renderProducts();
renderCart();

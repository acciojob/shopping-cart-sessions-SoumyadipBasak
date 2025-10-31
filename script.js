// Product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM Elements
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

const CART_KEY = "cart";

// --- Session Storage Utilities ---
function loadCart() {
  const data = sessionStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// --- Render Functions ---
function renderProducts() {
  productList.innerHTML = "";
  products.forEach(product => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${product.name} - $${product.price}
      <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
    `;
    productList.appendChild(li);
  });
}

function renderCart() {
  const cart = loadCart();
  cartList.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} ($${item.price})`;
    cartList.appendChild(li);
  });
}

// --- Cart Management ---
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
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
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const id = parseInt(e.target.dataset.id);
    addToCart(id);
  }
});

clearCartBtn.addEventListener("click", clearCart);

// --- Initial Render ---
renderProducts();
renderCart();

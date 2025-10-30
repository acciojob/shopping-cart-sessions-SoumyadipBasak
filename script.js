// Product data (provided in the boilerplate)
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM elements
const productList = document.getElementById("product-list");
// Get the cart list and clear button elements
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

// Key for sessionStorage
const CART_STORAGE_KEY = 'shoppingCart';

// --- Session Storage Utilities ---

/**
 * Loads the cart data from sessionStorage.
 * @returns {Array} The cart items (array of product objects), or an empty array if none are found.
 */
function loadCart() {
  const cartData = sessionStorage.getItem(CART_STORAGE_KEY);
  try {
    // 5️⃣ Persistence: If data exists, parse and return it.
    return cartData ? JSON.parse(cartData) : [];
  } catch (e) {
    console.error("Error parsing cart data from sessionStorage:", e);
    return []; 
  }
}

/**
 * Saves the current cart data to sessionStorage.
 * @param {Array} cart - The current list of cart items.
 */
function saveCart(cart) {
  // 3️⃣ Session Storage: Store the array as a JSON string.
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// --- DOM Rendering Functions ---

// Render product list (1️⃣ Display Products)
function renderProducts() {
  products.forEach((product) => {
    const li = document.createElement("li");
    // Ensure price is formatted and the button has the necessary data-id
    li.innerHTML = `${product.name} - $${product.price.toFixed(2)} <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`;
    productList.appendChild(li);
  });
}

// Render cart list (2️⃣ Add Products to Cart / 5️⃣ Persistence)
function renderCart() {
  // Load the current state of the cart from storage
  const currentCart = loadCart(); 
  
  // Clear the existing cart list
  cartList.innerHTML = ''; 

  currentCart.forEach(item => {
    const listItem = document.createElement('li');
    // Display name and price (Example 2)
    listItem.textContent = `${item.name} ($${item.price.toFixed(2)})`; 
    cartList.appendChild(listItem);
  });
  
  // Note for 1️⃣ Checking Products: If cart is empty, cartList.innerHTML will be '' (no child elements).
}

// --- Cart Management Functions ---

// Add item to cart (2️⃣ Add Products to Cart / 3️⃣ Session Storage)
function addToCart(productId) {
  const productToAdd = products.find(p => p.id === productId);

  if (productToAdd) {
    let cart = loadCart();
    
    // Add the product object to the cart array
    // Note: The cart data in sessionStorage will now include the id, name, and price.
    cart.push({ id: productToAdd.id, name: productToAdd.name, price: productToAdd.price }); 
    
    // Save the updated cart to sessionStorage
    saveCart(cart); 
    
    // Update the cart display
    renderCart(); 
  }
}

// Remove item from cart (Not required, but left for completeness if the student wishes to implement it)
// function removeFromCart(productId) {}

// Clear cart (4️⃣ Clear Cart)
function clearCart() {
  // Update sessionStorage to an empty array
  saveCart([]); 
  
  // Update the cart display
  renderCart(); 
}

// --- Event Listeners ---

// Handle clicks on the product list (Event Delegation)
productList.addEventListener('click', (event) => {
  if (event.target.classList.contains('add-to-cart-btn')) {
    // Get the product ID from the data-id attribute
    const productId = parseInt(event.target.dataset.id);
    addToCart(productId);
  }
});

// Handle click on the "Clear Cart" button
clearCartBtn.addEventListener('click', clearCart);

// --- Initial Render ---

// 1️⃣ Display Products
renderProducts();
// 5️⃣ Persistence: Load and display the cart contents from sessionStorage on page load.
renderCart();
// Product data (provided in the boilerplate)
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM elements (using IDs from the HTML structure)
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn"); // Get the clear button

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
    // Return empty array on error
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

// Render product list (mostly provided in the boilerplate)
function renderProducts() {
  // 1️⃣ Checking Products: Ensure 5 products are displayed with buttons.
  products.forEach((product) => {
    const li = document.createElement("li");
    // data-id is crucial for identifying which product to add
    li.innerHTML = `${product.name} - $${product.price.toFixed(2)} <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>`;
    productList.appendChild(li);
  });
}

// Render cart list
function renderCart() {
  // Get the current state of the cart from storage
  const currentCart = loadCart(); 
  
  // Clear the existing cart list
  cartList.innerHTML = ''; 

  // 2️⃣ Add Product to Cart: Display each item as an <li> element.
  currentCart.forEach(item => {
    const listItem = document.createElement('li');
    // Display name and price for clarity
    listItem.textContent = `${item.name} ($${item.price.toFixed(2)})`; 
    cartList.appendChild(listItem);
  });
}

// --- Cart Management Functions ---

// Add item to cart
function addToCart(productId) {
  const productToAdd = products.find(p => p.id === productId);

  if (productToAdd) {
    let cart = loadCart();
    
    // Add the product object (id, name, price)
    cart.push({ ...productToAdd }); 
    
    // 3️⃣ Session Storage: Update sessionStorage
    saveCart(cart); 
    
    // 2️⃣ Add Product to Cart: Update the cart display
    renderCart(); 
  }
}

// Clear cart
function clearCart() {
  // 4️⃣ Clear Cart: Update sessionStorage to be empty
  saveCart([]); 
  
  // 4️⃣ Clear Cart: Update the cart display
  renderCart(); 
}

// --- Event Listeners ---

// Handle clicks on the product list (Event Delegation for "Add to Cart" buttons)
productList.addEventListener('click', (event) => {
  if (event.target.classList.contains('add-to-cart-btn')) {
    // Get the product ID from the custom data attribute
    const productId = parseInt(event.target.dataset.id);
    addToCart(productId);
  }
});

// Handle click on the "Clear Cart" button
clearCartBtn.addEventListener('click', clearCart);

// --- Initial Render ---

// Initial render
renderProducts();
// 5️⃣ Persistence: Load and display the cart contents from sessionStorage on load.
renderCart(); 

// Note: The boilerplate included a `removeFromCart(productId)` function, 
// but the requirements did not include removing single items. It has been omitted 
// to keep the code focused purely on the specified requirements.
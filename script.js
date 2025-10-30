// Initial product data
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// DOM Element references
const productListEl = document.getElementById('product-list');
const cartListEl = document.getElementById('cart-list');
const clearCartBtn = document.getElementById('clear-cart-btn');

// Key for sessionStorage
const CART_STORAGE_KEY = 'shoppingCart';

// --- Core Cart Management Functions ---

/**
 * Loads the cart data from sessionStorage.
 * @returns {Array} The cart items, or an empty array if none are found.
 */
function loadCart() {
  const cartData = sessionStorage.getItem(CART_STORAGE_KEY);
  // Returns an array of cart items or an empty array if storage is empty/invalid
  try {
    return cartData ? JSON.parse(cartData) : [];
  } catch (e) {
    console.error("Error parsing cart data from sessionStorage:", e);
    // Return empty array on error to prevent application crash
    return []; 
  }
}

/**
 * Saves the current cart data to sessionStorage.
 * @param {Array} cart - The current list of cart items.
 */
function saveCart(cart) {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

/**
 * Renders the products list onto the page.
 */
function renderProducts() {
  // Add the required H1 heading for the products section
  const heading = document.createElement('h1');
  heading.textContent = 'Products';
  // Insert the heading before the product list
  productListEl.parentNode.insertBefore(heading, productListEl); 

  products.forEach(product => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      ${product.name} - \$${product.price.toFixed(2)} 
      <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
    `;
    productListEl.appendChild(listItem);
  });
}

/**
 * Renders the current state of the cart to the ul#cart-list element.
 * @param {Array} cart - The current list of cart items.
 */
function renderCart(cart) {
  // Clear the existing cart list
  cartListEl.innerHTML = ''; 

  if (cart.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.textContent = 'Your cart is empty.';
    // Optional: cartListEl.appendChild(emptyMessage); 
  } else {
    cart.forEach(item => {
      const listItem = document.createElement('li');
      // Format: Product Name ($Price)
      listItem.textContent = `${item.name} (\$${item.price.toFixed(2)})`; 
      cartListEl.appendChild(listItem);
    });
  }
}

// --- Event Handlers ---

/**
 * Handles the click event for 'Add to Cart' buttons.
 * @param {Event} event - The click event object.
 */
function handleAddToCart(event) {
  // Check if the clicked element is an 'Add to Cart' button
  if (event.target.classList.contains('add-to-cart-btn')) {
    const productId = parseInt(event.target.dataset.productId);
    const productToAdd = products.find(p => p.id === productId);

    if (productToAdd) {
      // 1. Load the current cart state
      const cart = loadCart();
      
      // 2. Add the new product
      // We'll clone the product to avoid unexpected mutations, though not strictly necessary here.
      cart.push({ ...productToAdd }); 

      // 3. Save the updated cart to sessionStorage
      saveCart(cart); 
      
      // 4. Update the cart display
      renderCart(cart); 
      
      console.log(`Added ${productToAdd.name}. Cart length: ${cart.length}`);
    }
  }
}

/**
 * Handles the click event for the 'Clear Cart' button.
 */
function handleClearCart() {
  // 1. Update the cart in sessionStorage to an empty array
  saveCart([]); 
  
  // 2. Update the cart display
  renderCart([]); 
  
  console.log('Cart cleared.');
}

// --- Initialization ---

/**
 * Initializes the application on page load.
 */
function initializeApp() {
  // 1. Display products
  renderProducts();

  // 2. Load cart from sessionStorage (Persistence)
  const initialCart = loadCart(); 
  
  // 3. Display the cart contents
  renderCart(initialCart); 

  // 4. Attach Event Listeners
  // Event delegation for Add to Cart buttons (on the parent ul)
  productListEl.addEventListener('click', handleAddToCart); 
  
  // Event listener for Clear Cart button
  clearCartBtn.addEventListener('click', handleClearCart); 
  
  console.log(`App Initialized. Cart has ${initialCart.length} item(s) from previous session.`);
}

// Run the initialization function when the script loads
initializeApp();
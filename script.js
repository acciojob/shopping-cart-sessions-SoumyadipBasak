// --- Product Data ---
const products = [
  { id: 1, name: "Product 1", price: 10 },
  { id: 2, name: "Product 2", price: 20 },
  { id: 3, name: "Product 3", price: 30 },
  { id: 4, name: "Product 4", price: 40 },
  { id: 5, name: "Product 5", price: 50 },
];

// --- DOM Elements ---
const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart-list");
const clearCartBtn = document.getElementById("clear-cart-btn");

// --- sessionStorage Key ---
const CART_STORAGE_KEY = "cart";

// --- Session Storage Utilities ---
function loadCart() {
  const data = sessionStorage.getItem(CART_STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error parsing cart data:", e);
    return [];
  }
}

function saveCart(cart) {
  sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// --- Rendering Functions ---
function renderProducts() {
  productList.innerHTML = "";
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
productList.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart-btn")) {
    const productId = parseInt(e.target.dataset.id);
    addToCart(productId);
  }
});

clearCartBtn.addEventListener("click", clearCart);

// --- Initial Render ---
renderProducts();
renderCart();

// --- Cypress Tests (if Cypress is running) ---
if (window.Cypress) {
  describe("Embedded Session-Based Shopping Cart Tests", () => {
    beforeEach(() => {
      cy.visit("index.html");
      cy.window().then((win) => win.sessionStorage.clear());
    });

    it("Initial product display and cart empty", () => {
      cy.get("h1").contains("Products");
      cy.get("ul#product-list").children("li").should("have.length", 5);

      cy.get("h2").contains("Shopping Cart");
      cy.get("ul#cart-list").should("be.empty");

      cy.get("button#clear-cart-btn").contains("Clear Cart");
    });

    it("Add products to cart and check cart display", () => {
      cy.get("ul#product-list").children("li").first().children("button").click();
      cy.get("ul#cart-list").children("li").should("have.length", 1);

      cy.get("ul#product-list").children("li").last().children("button").click();
      cy.get("ul#cart-list").children("li").should("have.length", 2);
    });

    it("Check sessionStorage updates correctly", () => {
      cy.get("ul#product-list").children("li").first().children("button").click();
      cy.get("ul#product-list").children("li").last().children("button").click();
      cy.get("ul#product-list").children("li").first().children("button").click();

      cy.window().its("sessionStorage").invoke("getItem", "cart").then((cartData) => {
        const cart = JSON.parse(cartData);
        expect(cart).to.deep.eq([
          { id: 1, name: "Product 1", price: 10 },
          { id: 5, name: "Product 5", price: 50 },
          { id: 1, name: "Product 1", price: 10 },
        ]);
      });
    });

    it("Cart persists on reload", () => {
      cy.get("ul#product-list").children("li").eq(2).children("button").click();
      cy.get("ul#cart-list").children("li").should("have.length", 1);

      cy.reload();
      cy.get("ul#cart-list").children("li").should("have.length", 1);
      cy.get("ul#cart-list").children("li").first().contains("Product 3 ($30.00)");
    });

    it("Clear cart updates display and sessionStorage", () => {
      cy.get("ul#product-list").children("li").first().children("button").click();
      cy.get("ul#product-list").children("li").eq(1).children("button").click();
      cy.get("ul#cart-list").children("li").should("have.length", 2);

      cy.get("button#clear-cart-btn").click();
      cy.get("ul#cart-list").should("be.empty");
      cy.window().its("sessionStorage").invoke("getItem", "cart").should("eq", "[]");
    });
  });
}

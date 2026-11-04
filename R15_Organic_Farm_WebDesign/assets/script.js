(() => {
  "use strict";
  const CART_KEY = "r15OrganicFarmCart";
  const readCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch (error) { return {}; }
  };
  let cart = readCart();
  const money = value => "₹" + Number(value).toLocaleString("en-IN");
  const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const cartCount = () => Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

  function renderCart() {
    document.querySelectorAll("#cartCount").forEach(el => el.textContent = cartCount());
    const list = document.getElementById("cartItems");
    const totalEl = document.getElementById("cartTotal");
    if (!list || !totalEl) return;
    const entries = Object.entries(cart);
    if (!entries.length) {
      list.innerHTML = '<div class="empty-cart">Your basket is empty.<br>Visit Our Products to add farm-fresh items.</div>';
      totalEl.textContent = money(0);
      return;
    }
    let total = 0;
    list.innerHTML = entries.map(([id, item]) => {
      const subtotal = item.price * item.quantity; total += subtotal;
      return `<div class="cart-line"><div><b>${escapeHTML(item.name)}</b><small>${money(item.price)} each</small></div><div class="qty-controls"><button type="button" data-action="decrease" data-id="${id}" aria-label="Decrease ${escapeHTML(item.name)} quantity">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-id="${id}" aria-label="Increase ${escapeHTML(item.name)} quantity">+</button></div><b>${money(subtotal)}</b></div>`;
    }).join("");
    totalEl.textContent = money(total);
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  }
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
      const {id, name, price} = button.dataset;
      if (!cart[id]) cart[id] = {name, price: Number(price), quantity: 0};
      cart[id].quantity += 1; saveCart(); renderCart();
      const oldText = button.textContent; button.textContent = "Added ✓";
      setTimeout(() => button.textContent = oldText, 900);
    });
  });
  document.addEventListener("click", event => {
    const control = event.target.closest("[data-action]");
    if (!control) return;
    const {id, action} = control.dataset;
    if (!cart[id]) return;
    cart[id].quantity += action === "increase" ? 1 : -1;
    if (cart[id].quantity <= 0) delete cart[id];
    saveCart(); renderCart();
  });
  document.getElementById("clearCart")?.addEventListener("click", () => {
    cart = {}; saveCart(); renderCart();
  });
  const search = document.getElementById("productSearch");
  search?.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll("#productRows tr").forEach(row => {
      row.hidden = !row.textContent.toLowerCase().includes(query);
    });
  });
  const enquiryForm = document.getElementById("enquiryForm");
  enquiryForm?.addEventListener("submit", event => {
    event.preventDefault();
    const status = document.getElementById("formStatus");
    if (!enquiryForm.checkValidity()) {
      event.stopPropagation(); enquiryForm.classList.add("was-validated");
      status.textContent = "Please correct the highlighted fields and try again.";
      return;
    }
    enquiryForm.classList.add("was-validated");
    status.textContent = "Your details passed validation. This demonstration does not send data to a server.";
    enquiryForm.reset();
    enquiryForm.classList.remove("was-validated");
  });
  renderCart();
})();
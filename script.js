const products = [
  { nombre: "Tenis Running Hombre", precio: 179000, descripcion: "Tenis livianos y transpirables para correr.", categoria: "Zapatos", imagen:"imagenes/tenis-running-hombre.png" },
  { nombre: "Zapatillas Urbanas Mujer", precio: 145000, descripcion: "Estilo deportivo urbano para uso diario.", categoria: "Zapatos", imagen: "Imagenes/Zapatillas-Urbanas-Mujer.jpeg" },
  { nombre: "Camisa DryFit Hombre", precio: 45000, descripcion: "Tecnología DryFit ideal para entrenamientos.", categoria: "Camisas", imagen: "Imagenes/Camisa-DryFit-Hombre.jpg" },
  { nombre: "Camisa Crop Mujer", precio: 42000, descripcion: "Estilo corto y fresco, ideal para el gym.", categoria: "Camisas", imagen: "Imagenes/Camisa-Crop-Mujer.jpeg" },
  { nombre: "Bermuda Running Hombre", precio: 60000, descripcion: "Ligera y de secado rápido.", categoria: "Bermudas", imagen: "Imagenes/Bermuda-Running-Hombre.png" },
  { nombre: "Bermuda Ciclista Mujer", precio: 58000, descripcion: "Ajuste perfecto para actividades intensas.", categoria: "Bermudas", imagen: "Imagenes/Bermuda-Ciclista-Mujer.png" },
  { nombre: "Conjunto Deportivo Hombre", precio: 130000, descripcion: "Camiseta + pantalón, diseño moderno.", categoria: "Conjuntos", imagen: "Imagenes/Conjunto-Deportivo-Hombre.jpeg" },
  { nombre: "Set Deportivo Mujer", precio: 125000, descripcion: "Top + leggins, ideal para yoga o fitness.", categoria: "Conjuntos", imagen: "Imagenes/Set-Deportivo-Mujer.jpg" }
];

function getSizeOptions(categoria) {
  if (categoria === "Zapatos") {
    return Array.from({ length: 13 }, (_, i) => `<option value="${30 + i}">${30 + i}</option>`).join("");
  } else {
    return ["XS", "S", "M", "L", "XL", "XXL"].map(t => `<option value="${t}">${t}</option>`).join("");
  }
}

const productsContainer = document.getElementById("products");
const cartPanel = document.getElementById("cart-panel");
const cartIcon = document.getElementById("cart");
const closeCartBtn = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");

let cart = [];

function renderProducts(filter = "Todos") {
  if (!productsContainer) return;
  productsContainer.style.opacity = 0;
  setTimeout(() => {
    productsContainer.innerHTML = "";
    const filtered = filter === "Todos" ? products : products.filter(p => p.categoria === filter);
    filtered.forEach((p, i) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}" loading="lazy" />
        <h4>${p.nombre}</h4>
        <p>${p.descripcion}</p>
        <p><strong>${p.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</strong></p>
        <label for="size-${i}">Talla:</label>
        <select id="size-${i}">${getSizeOptions(p.categoria)}</select>
        <div class="quantity-selector">
          <button onclick="decreaseQuantity(${i})">-</button>
          <input id="qty-${i}" type="number" value="1" min="1">
          <button onclick="increaseQuantity(${i})">+</button>
        </div>
        <button onclick="addToCart(${i})" aria-label="Agregar ${p.nombre} al carrito">Agregar al carrito</button>
      `;
      productsContainer.appendChild(div);
    });
    productsContainer.style.opacity = 1;
  }, 200);
}

function increaseQuantity(i) {
  const input = document.getElementById(`qty-${i}`);
  input.value = parseInt(input.value) + 1;
}

function decreaseQuantity(i) {
  const input = document.getElementById(`qty-${i}`);
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
}

function addToCart(i) {
  const size = document.getElementById(`size-${i}`).value;
  const qty = parseInt(document.getElementById(`qty-${i}`).value);
  const base = products[i];
  cart.push({ ...base, talla: size, cantidad: qty });
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = "";
  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} (Talla: ${item.talla}, Cant: ${item.cantidad}) - ${item.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`;
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      cart.splice(index, 1);
      updateCart();
    };
    li.appendChild(btn);
    cartItems.appendChild(li);
  });
  cartCount.textContent = cart.length;
  localStorage.setItem("cartItems", JSON.stringify(cart.map(p => ({
    name: p.nombre,
    price: p.precio,
    image: p.imagen,
    talla: p.talla,
    cantidad: p.cantidad
  }))));
}

if (cartIcon) {
  cartIcon.onclick = () => {
    cartPanel.classList.toggle("open");
  };
}

if (closeCartBtn) {
  closeCartBtn.onclick = () => {
    cartPanel.classList.remove("open");
  };
}

if (hamburger) {
  hamburger.onclick = () => {
    menu.classList.toggle("active");
  };
}

function filterCategory(cat) {
  renderProducts(cat);
  if (menu.classList.contains("active")) {
    menu.classList.remove("active");
  }
}

if (window.location.pathname.includes("index.html") || window.location.pathname.endsWith("/")) {
  renderProducts();
}

if (window.location.pathname.includes("checkout.html")) {
  const container = document.getElementById("checkout-container");
  const btnConfirm = document.getElementById("btn-confirm");
  const btnBack = document.getElementById("btn-back");

  const cartItemsData = JSON.parse(localStorage.getItem("cartItems")) || [];

  function renderCart() {
    if (cartItemsData.length === 0) {
      container.innerHTML = "<p>Tu carrito está vacío.</p>";
      btnConfirm.disabled = true;
      return;
    }

    let total = 0;
    container.innerHTML = "";

    cartItemsData.forEach(item => {
      const subtotal = item.price * item.cantidad;
      total += subtotal;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");

      itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="item-info">
          <h3>${item.name}</h3>
          <p>Talla: ${item.talla}</p>
          <p>Cantidad: ${item.cantidad}</p>
          <p>Precio unitario: ${item.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>
        </div>
        <div class="price">${subtotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</div>
      `;

      container.appendChild(itemDiv);
    });

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("total");
    totalDiv.textContent = "Total: " + total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });
    container.appendChild(totalDiv);
  }

  renderCart();

  btnConfirm.addEventListener("click", () => {
    alert("¡Pago realizado con éxito! Gracias por tu compra en RopaNova360.");
    localStorage.removeItem("cartItems");
    window.location.href = "index.html";
  });

  btnBack.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}


// src/tienda/js/cart.ts
import { $, $$ } from './utils/dom';
import { CartItem, SessionUser, CheckoutRequest, Product } from './types';
import { CLP } from './utils/format';
import { API_URLS } from './config';
// import { showModal } from './utils/modal'; // Asumido

const CART_KEY = "cart";

// Helper para obtener el carrito tipado
function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// --- Añadir producto (necesita consultar la lista actual o el backend) ---
export async function addToCart(id: number): Promise<void> {
  let cart = getCart();
  
  // Para obtener datos del producto (nombre, precio) necesitamos la lista.
  // Podríamos hacer un fetch individual o usar la lista cacheada en products.ts si se exportara.
  // Por simplicidad, haremos fetch al endpoint individual de products si existiera, 
  // o traeremos todos. Aquí asumiré un fetch rápido:
  try {
    // NOTA: Lo ideal es tener un endpoint GET /products/{id} en ProductController
    // Como no lo vi explícito, usaremos el de todos y buscaremos (ineficiente pero funcional)
    const res = await fetch(API_URLS.PRODUCTS);
    const products: Product[] = await res.json();
    const prod = products.find(p => p.id === id);

    if (!prod) {
      alert("Producto no encontrado");
      return;
    }

    const item = cart.find((x) => x.id === id);
    if (item) {
      item.qty += 1;
    } else {
      cart.push({ id: prod.id, nombre: prod.nombre, precio: prod.precio, qty: 1, img: prod.img });
    }

    saveCart(cart);
    alert(`${prod.nombre} agregado al carrito`); // O usar showModal
  } catch (e) {
    console.error(e);
  }
}

// Renderizar Carrito (Igual, solo asegura tipos)
export function renderCart(): void {
  const cont = $<HTMLDivElement>("#cart-list");
  const totalEl = $<HTMLSpanElement>("#cart-total");
  if (!cont || !totalEl) return;

  // Listener delegado
  if (!cont.dataset.cartListener) {
    cont.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const removeBtn = target.closest<HTMLButtonElement>('.remove-btn');
      if (removeBtn) {
        const id = parseInt(removeBtn.dataset.id || "0");
        if (id) removeFromCart(id);
      }
    });
    cont.dataset.cartListener = 'true';
  }
  
  const cart = getCart();
  if (cart.length === 0) {
    cont.innerHTML = "<p>Carrito vacío</p>";
    totalEl.textContent = "Total: $0";
    return;
  }

  let total = 0;
  cont.innerHTML = cart.map((item) => {
    const subtotal = item.precio * item.qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <img src="../assets/${item.img || 'default.png'}" style="width:50px; height:50px; object-fit:cover; margin-right:10px;">
        <span>${item.nombre}</span>
        <span>${item.qty} x ${CLP(item.precio)}</span>
        <span>${CLP(subtotal)}</span>
        <button class="remove-btn" data-id="${item.id}" title="Eliminar">❌</button>
      </div>
    `;
  }).join("");

  totalEl.textContent = "Total: " + CLP(total);
}

export function removeFromCart(id: number): void {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== id);
  saveCart(cart);
  renderCart();
}

export function clearCart(): void {
  localStorage.removeItem(CART_KEY);
  renderCart();
}

// ----------------- Checkout (Conectado a Microservicio) -----------------
export async function checkout(): Promise<void> {
  const cart = getCart();
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const session = JSON.parse(localStorage.getItem("session_user") || "null") as SessionUser | null;
  
  if (!session || !session.email) {
    alert("Debes iniciar sesión para comprar");
    window.location.href = "login.html";
    return;
  }

  const total = cart.reduce((acc, item) => acc + (item.precio * item.qty), 0);

  // Construir el Request Body para CheckoutController
  const checkoutRequest: CheckoutRequest = {
    userEmail: session.email,
    totalAmount: total,
    items: cart.map(item => ({
      productId: item.id,
      // CORRECCIÓN: Usar las claves que espera Java
      qty: item.qty,         // Coincide con @JsonProperty("qty") en CartItemDto.java
      precio: item.precio,   // Coincide con el campo 'precio' en CartItemDto.java
      nombre: item.nombre,   // Es útil pasar el nombre para el historial
      tipo: "merch"          // Opcional: definir lógica si tienes items que no son productos físicos
    }))
  };

  try {
    const response = await fetch(API_URLS.CHECKOUT, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${session.token}` // Si implementas seguridad JWT en Checkout
      },
      body: JSON.stringify(checkoutRequest)
    });

    const result = await response.json();

    if (response.ok) {
      // Compra exitosa
      localStorage.removeItem(CART_KEY);
      renderCart();
      alert(`Compra realizada con éxito! ID Orden: ${result.orderId || 'N/A'}`);
      // Opcional: Redirigir a historial de ordenes
    } else {
      // Error (ej. stock insuficiente)
      alert("Error en la compra: " + (result.message || "Error desconocido"));
    }

  } catch (error) {
    console.error(error);
    alert("Error de conexión con el servicio de pagos.");
  }
}
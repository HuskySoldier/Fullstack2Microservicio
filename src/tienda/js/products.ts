// src/tienda/js/products.ts
import { $ } from './utils/dom';
import { Product } from './types';
import { addToCart } from './cart';
import { CLP } from './utils/format';
import { API_URLS } from './config';

// Variable global para almacenar productos una vez traídos del back
let fetchedProducts: Product[] = [];

/**
 * Función helper para cargar productos desde el backend
 */
async function fetchProductsFromBackend(): Promise<Product[]> {
  if (fetchedProducts.length > 0) return fetchedProducts;
  
  try {
    const res = await fetch(API_URLS.PRODUCTS);
    if (!res.ok) throw new Error("Error al cargar productos");
    fetchedProducts = await res.json();
    return fetchedProducts;
  } catch (e) {
    console.error(e);
    return [];
  }
}

// --- Renderizado de Planes en el Home ---
export async function renderHomePlans(): Promise<void> {
  const cont = $<HTMLDivElement>('#home-plans-container'); 
  if (!cont) return;

  const products = await fetchProductsFromBackend();
  // Filtramos por tipo 'plan' (asegúrate que en tu BD tengan este tipo o filtra por ID/Nombre)
  const planes = products.filter(p => p.tipo === 'plan' || p.nombre.toLowerCase().includes('plan'));

  if (planes.length === 0) {
    cont.innerHTML = "<p>Cargando planes...</p>";
    return;
  }

  cont.innerHTML = planes.map((plan) => `
    <article class="plan-card"> 
      <img src="assets/${plan.img || 'default.png'}" alt="${plan.nombre}">
      <h3>${plan.nombre}</h3>
      <p class="precio">${CLP(plan.precio)}</p>
      <a href="pages/detalle.html?id=${plan.id}" class="btn">Ver más</a>
    </article>
  `).join("");
}

// --- Renderizado de Página de Productos (Accesorios/Merch) ---
export async function renderProductsPage(): Promise<void> {
  const cont = $<HTMLDivElement>('#products-container'); 
  if (!cont) return;
  
  const products = await fetchProductsFromBackend();
  // Filtramos lo que NO sea plan (o filtra por tipo 'merch')
  const accesorios = products.filter(p => p.tipo !== 'plan');

  cont.innerHTML = accesorios.map((prod) => `
    <article class="card">
      <img src="../assets/${prod.img || 'default.png'}" alt="${prod.nombre}" class="prod-img">
      <h3>${prod.nombre}</h3>
      <p class="precio">${CLP(prod.precio)}</p>
      <p>Stock: ${prod.stock}</p>
      <button class="btn btn-add-cart" data-id="${prod.id}" ${prod.stock <= 0 ? 'disabled' : ''}>
        ${prod.stock > 0 ? 'Añadir al carrito' : 'Agotado'}
      </button>
    </article>
  `).join("");

  // Delegado de eventos (se mantiene igual, solo cambia el ID a number)
  if (!cont.dataset.cartListener) {
    cont.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest<HTMLButtonElement>('.btn-add-cart');
      if (btn && !btn.disabled) {
        const id = parseInt(btn.dataset.id || "0");
        if (id) addToCart(id);
      }
    });
    cont.dataset.cartListener = 'true';
  }
}

// --- Renderizado de Página de Detalle ---
export async function renderDetailPage(): Promise<void> {
  const cont = $<HTMLDivElement>('#detail-container'); 
  if (!cont) return;

  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  
  if (!idParam) return;

  const products = await fetchProductsFromBackend();
  const prod = products.find(x => x.id == parseInt(idParam));

  if (!prod) {
    cont.innerHTML = "<p>Producto no encontrado.</p>";
    return;
  }

  cont.innerHTML = `
    <div class="detalle-producto">
      <img src="../assets/${prod.img || 'default.png'}" alt="${prod.nombre}">
      <div class="detalle-info">
        <h2>${prod.nombre}</h2>
        <p class="precio">${CLP(prod.precio)}</p>
        <p>${prod.stock > 0 ? 'En Stock' : 'Agotado'}</p>
        <button class="btn btn-add-cart" data-id="${prod.id}" ${prod.stock <= 0 ? 'disabled' : ''}>Añadir al carrito</button>
      </div>
    </div>
  `;

  const btn = $<HTMLButtonElement>('.btn-add-cart', cont);
  if (btn) {
    btn.addEventListener('click', () => {
      addToCart(prod.id);
    });
  }
}
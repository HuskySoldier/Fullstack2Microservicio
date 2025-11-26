import { $ } from './utils/dom';
import { API_URLS } from './config';
import { Product } from './types';
import { addToCart } from './cart';
import { CLP } from './utils/format';

// Ya no usamos la lista hardcodeada, ahora hacemos fetch
export async function loadProducts(): Promise<void> {
  const container = $<HTMLDivElement>("#products-container");
  if (!container) return;

  container.innerHTML = "<p>Cargando productos...</p>";

  try {
    const response = await fetch(API_URLS.PRODUCTS); // GET localhost:8082/products
    if (!response.ok) throw new Error("Error cargando productos");
    
    const products: Product[] = await response.json();

    if (products.length === 0) {
        container.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    renderProductList(products, container);
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Error de conexión con el catálogo.</p>";
  }
}

function renderProductList(products: Product[], container: HTMLElement) {
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="../assets/${p.img || 'default.png'}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p class="price">${CLP(p.precio)}</p>
      <button class="add-btn" data-id="${p.id}">Añadir</button>
    </div>
  `).join("");

  // Re-asignar listeners a los botones nuevos
  container.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const id = parseInt((e.target as HTMLElement).dataset.id || "0");
          if(id) addToCart(id);
      });
  });
}
// src/tienda/js/products.ts

import { $ } from './utils/dom';
import { API_URLS } from './config';
import { Product } from './types';
import { addToCart } from './cart';
import { CLP } from './utils/format';

// --- 1. Catálogo de Productos ---

// Renombramos o creamos un alias para que coincida con lo que busca app.ts
export async function renderProductsPage(): Promise<void> {
  const container = $<HTMLDivElement>("#products-container");
  if (!container) return;

  container.innerHTML = "<p>Cargando productos...</p>";

  try {
    const response = await fetch(API_URLS.PRODUCTS); 
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

  // Asignar eventos a los botones
  container.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const id = parseInt((e.target as HTMLElement).dataset.id || "0");
          if(id) addToCart(id);
      });
  });
}

// --- 2. Detalle de Producto ---

export async function renderDetailPage(): Promise<void> {
    const container = $<HTMLDivElement>("#product-detail");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        container.innerHTML = "<p>Producto no especificado</p>";
        return;
    }

    try {
        // Asumimos que tu backend tiene un endpoint para obtener un producto por ID
        // Si no lo tiene, tendrás que filtrar la lista completa de productos.
        const response = await fetch(`${API_URLS.PRODUCTS}/${id}`);
        
        if (!response.ok) throw new Error("Producto no encontrado");

        const p: Product = await response.json();

        container.innerHTML = `
            <div class="detail-grid" style="display:flex; gap:20px; align-items:center;">
                <img src="../assets/${p.img || 'default.png'}" alt="${p.nombre}" style="max-width:300px; border-radius:8px;">
                <div class="info">
                    <h2>${p.nombre}</h2>
                    <h3 class="price" style="color:#e63946; margin:10px 0;">${CLP(p.precio)}</h3>
                    <br>
                    <button class="btn primary add-btn-detail" data-id="${p.id}">Agregar al Carrito</button>
                    <a href="productos.html" class="btn secondary">Volver</a>
                </div>
            </div>
        `;
        
        const btn = container.querySelector('.add-btn-detail');
        if(btn) {
            btn.addEventListener('click', () => {
                addToCart(p.id);
                alert("Producto agregado al carrito");
            });
        }

    } catch (error) {
        console.error(error);
        container.innerHTML = "<p>Error al cargar el detalle del producto.</p>";
    }
}

// --- 3. Planes del Home (Placeholder) ---

export function renderHomePlans(): void {
    // Si tienes lógica específica para el home, agrégala aquí.
    // Si no, déjala vacía para evitar el error de importación.
    const container = $("#plans-container");
    if(container) {
        // Lógica para renderizar planes si es necesario
    }
}
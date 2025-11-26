import { $ } from './utils/dom';
import { API_URLS } from './config';
import { Product } from './types';
import { addToCart } from './cart';
import { CLP } from './utils/format';

// --- 1. Catálogo de Productos ---

export async function renderProductsPage(): Promise<void> {
  const container = $<HTMLDivElement>("#products-container");
  if (!container) return; // Si no existe el contenedor, no hacemos nada (ej: estamos en otra página)

  container.innerHTML = '<div style="text-align:center; width:100%;">Cargando productos...</div>';

  try {
    console.log("Intentando conectar a:", API_URLS.PRODUCTS);
    
    const response = await fetch(API_URLS.PRODUCTS);
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }
    
    // Intentar parsear el JSON
    const products: Product[] = await response.json();

    if (!products || products.length === 0) {
        container.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
        return;
    }

    renderProductList(products, container);

  } catch (error) {
    console.error("Error en renderProductsPage:", error);
    
    // Mensaje de error amigable para el usuario
    container.innerHTML = `
      <div style="text-align:center; color: red; width: 100%;">
        <p><strong>Error de conexión con el catálogo.</strong></p>
        <p style="font-size: 0.9em; color: #666;">
          Asegúrate de que el microservicio de productos (puerto 8082) esté corriendo.
        </p>
      </div>
    `;
  }
}

function renderProductList(products: Product[], container: HTMLElement) {
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.img && p.img.startsWith('http') ? p.img : '../assets/default.png'}" 
           alt="${p.nombre}" 
           style="width:100%; height:200px; object-fit:cover; border-radius:8px;">
      
      <div class="product-info" style="padding: 10px;">
        <h3>${p.nombre}</h3>
        <p class="price" style="font-weight:bold; color:#e63946;">${CLP(p.precio)}</p>
        
        <div class="actions" style="display:flex; gap:10px; margin-top:10px;">
            <a href="detalle.html?id=${p.id}" class="btn secondary" style="flex:1; text-align:center;">Ver</a>
            <button class="btn primary add-btn" data-id="${p.id}" style="flex:1;">Añadir</button>
        </div>
      </div>
    </div>
  `).join("");

  // Asignar eventos a los botones
  container.querySelectorAll('.add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
          const id = parseInt((e.target as HTMLElement).dataset.id || "0");
          if(id) {
            addToCart(id);
            // Feedback visual simple
            const originalText = (e.target as HTMLElement).textContent;
            (e.target as HTMLElement).textContent = "¡Añadido!";
            setTimeout(() => (e.target as HTMLElement).textContent = originalText, 1000);
          }
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
        container.innerHTML = "<p>Producto no especificado.</p>";
        return;
    }

    try {
        const response = await fetch(`${API_URLS.PRODUCTS}/${id}`);
        
        if (!response.ok) throw new Error("Producto no encontrado");

        const p: Product = await response.json();

        container.innerHTML = `
            <div class="detail-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start;">
                <div class="image-col">
                   <img src="${p.img && p.img.startsWith('http') ? p.img : '../assets/default.png'}" 
                        alt="${p.nombre}" 
                        style="width:100%; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                </div>
                <div class="info-col">
                    <h1 style="font-size: 2rem; margin-bottom: 0.5rem;">${p.nombre}</h1>
                    <h2 class="price" style="color:#e63946; font-size: 1.8rem; margin-bottom: 1.5rem;">${CLP(p.precio)}</h2>
                    
                    <div class="description" style="line-height: 1.6; color: #555; margin-bottom: 2rem;">
                        <p>${p.descripcion || 'Sin descripción disponible.'}</p>
                        ${p.stock ? `<p><small>Stock disponible: ${p.stock}</small></p>` : ''}
                    </div>

                    <div class="actions" style="display: flex; gap: 15px;">
                        <button class="btn primary add-btn-detail" data-id="${p.id}" style="padding: 12px 30px;">Agregar al Carrito</button>
                        <a href="productos.html" class="btn secondary" style="padding: 12px 30px;">Volver</a>
                    </div>
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
        container.innerHTML = "<p>Error al cargar el detalle o producto no existe.</p>";
    }
}

// --- 3. Planes del Home (Placeholder) ---
export function renderHomePlans(): void {
    // Lógica para el home si es necesaria
}
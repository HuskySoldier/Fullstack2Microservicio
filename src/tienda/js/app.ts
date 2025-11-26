// src/tienda/js/app.ts

// --- 1. IMPORTAR TODO LO QUE SE USA ---
import { $, $$ } from './utils/dom'; 
import { SessionUser, Blog } from './types';

// Importar funciones de otros módulos
import { renderCart, clearCart, checkout } from './cart';

// (Asumo que estas funciones están en 'auth.ts' y 'data/blogs.ts')
// ¡Debes añadir 'export' a esas funciones y variables en sus archivos!
import { initAuth, logoutUser } from './auth'; 
import { BLOGS } from './data/blogs'; 

// (Asumo que estas vienes de 'products.ts' o un archivo similar)
// ¡También debes añadir 'export' a estas funciones en su archivo!
import { 
  renderHomePlans, 
  renderProductsPage, 
  renderDetailPage 
} from './products'; 


// --- 2. EL RESTO DE TU CÓDIGO ---

// ---- Header dinámico 
function updateHeader(): void {
  const nav = $<HTMLUListElement>('.header .nav'); 
  if (!nav) return;

  const inPages = location.pathname.includes('/tienda/pages/');
  const adminHref = inPages ? '../../admin/index.html' : '../admin/index.html';

  const session: SessionUser | null = JSON.parse(localStorage.getItem('session_user') || 'null');

  nav.querySelectorAll('[data-dyn]').forEach(el => el.remove());

  if (session) {
    const hello = document.createElement('span');
    hello.className = 'badge';
    hello.textContent = `Hola, ${session.nombre || 'Usuario'}`;
    hello.setAttribute('data-dyn', '1');
    nav.appendChild(hello);

    if (session.rol === 'Administrador' || session.rol === 'Vendedor') {
      const aAdmin = document.createElement('a');
      aAdmin.href = adminHref;
      aAdmin.textContent = 'Admin';
      aAdmin.setAttribute('data-dyn', '1');
      nav.appendChild(aAdmin);
    }

    const aOut = document.createElement('a');
    aOut.href = '#';
    aOut.textContent = 'Cerrar sesión';
    aOut.onclick = (e: MouseEvent) => { 
      e.preventDefault(); 
      logoutUser(); // <-- Ahora se llama a la función importada
    };
    aOut.setAttribute('data-dyn', '1');
    nav.appendChild(aOut);

    nav.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (/registro\.html|login\.html/i.test(href)) {
        a.style.display = 'none';
      }
    });
  }
}

// ----------------- Blogs -----------------
function renderBlogsList(): void {
  const cont = $('#blog-list');
  if (!cont) return;

  // Usamos la variable 'BLOGS' importada
  cont.innerHTML = BLOGS.map((b: Blog) => `
    <article class="card">
      <img src="${b.img}" alt="${b.titulo}" class="prod-img">
      <h3>${b.titulo}</h3>
      <p>${b.resumen}</p>
    </article>
  `).join("");
}

function renderBlogDetail(): void {
  const cont = $('#blog-detail');
  if (!cont) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const b = BLOGS.find((x: Blog) => x.id === id); 

  if (!b) { 
    cont.innerHTML = "<p>Artículo no encontrado</p>"; 
    return; 
  }

  cont.innerHTML = `
    <article>
      <h2>${b.titulo}</h2>
      <p><small>${b.fecha} | ${b.autor}</small></p>
      <p>${b.contenido}</p>
    </article>
  `;
}

// ---- 3. INICIALIZACIÓN (MÁS LIMPIA) ----
window.addEventListener('DOMContentLoaded', () => {
  const y = $('#year');
  if (y) {
    y.textContent = new Date().getFullYear().toString();
  }

  // Ya no necesitamos el 'call()', llamamos a las funciones importadas
  renderHomePlans();
  renderProductsPage();
  renderDetailPage();
  renderBlogsList();
  renderBlogDetail();
  renderCart(); 
  initAuth();

  // Conectar eventos del carrito (ahora importados)
  const btnClear = $<HTMLButtonElement>('#btn-clear-cart');
  const btnCheckout = $<HTMLButtonElement>('#btn-checkout');

  if (btnClear) {
    btnClear.addEventListener('click', clearCart);
  }
  if (btnCheckout) {
    btnCheckout.addEventListener('click', checkout);
  }

  // Actualiza el header al final
  updateHeader();
});

// (Ya no es necesario asignar a 'window' si todo es un módulo)
// (Tampoco necesitas ya el helper 'call')
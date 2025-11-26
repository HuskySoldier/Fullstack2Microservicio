

import { $ } from './utils/dom'; 
import { SessionUser, Blog } from './types';

// Importaciones de módulos funcionales
import { renderCart, clearCart, checkout } from './cart';
import { initAuth, logoutUser } from './auth'; 
import { BLOGS } from './data/blogs'; 
import { renderHomePlans, renderProductsPage, renderDetailPage } from './products';
import { loadTrainers } from './trainers'; // Agregado para mantener la funcionalidad de "Nosotros"

// ---- 1. Lógica de UI General (Header y Navegación) ----

function updateHeader(): void {
  const nav = $<HTMLDivElement>('.header .nav'); 
  if (!nav) return;

  // Determinar ruta para el link de Admin dependiendo de dónde estemos
  const inPages = location.pathname.includes('/tienda/pages/');
  const adminHref = inPages ? '../../admin/index.html' : '../admin/index.html';

  // Obtener sesión
  const session: SessionUser | null = JSON.parse(localStorage.getItem('session_user') || 'null');

  // Limpiar elementos dinámicos previos
  nav.querySelectorAll('[data-dyn]').forEach(el => el.remove());

  if (session) {
    // 1. Mensaje de bienvenida
    const hello = document.createElement('span');
    hello.className = 'badge';
    hello.textContent = `Hola, ${session.nombre || 'Usuario'}`;
    hello.style.marginRight = '10px';
    hello.setAttribute('data-dyn', '1');
    nav.appendChild(hello);

    // 2. Link Admin (Solo si corresponde)
    if (session.rol === 'Administrador' || session.rol === 'Vendedor') {
      const aAdmin = document.createElement('a');
      aAdmin.href = adminHref;
      aAdmin.textContent = 'Admin';
      aAdmin.setAttribute('data-dyn', '1');
      nav.appendChild(aAdmin);
    }

    // 3. Botón Logout
    const aOut = document.createElement('a');
    aOut.href = '#';
    aOut.textContent = 'Cerrar sesión';
    aOut.onclick = (e: MouseEvent) => { 
      e.preventDefault(); 
      logoutUser(); 
    };
    aOut.setAttribute('data-dyn', '1');
    nav.appendChild(aOut);

    // 4. Ocultar Login/Registro si ya está logueado
    nav.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (/registro\.html|login\.html/i.test(href)) {
        a.style.display = 'none';
      }
    });
  }
}

// ---- 2. Lógica de Blogs ----

function renderBlogsList(): void {
  const cont = $('#blog-list');
  if (!cont) return;

  cont.innerHTML = BLOGS.map((b: Blog) => `
    <article class="card">
      <img src="${b.img}" alt="${b.titulo}" class="prod-img" style="width:100%; height:150px; object-fit:cover;">
      <h3>${b.titulo}</h3>
      <p>${b.resumen}</p>
      <a href="blog-detalle.html?id=${b.id}" class="btn" style="margin-top:10px; display:inline-block;">Leer más</a>
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
      <img src="${b.img}" alt="${b.titulo}" style="max-width:100%; height:300px; object-fit:cover; border-radius:8px;">
      <h2 style="margin-top:20px;">${b.titulo}</h2>
      <p style="color:#666; font-style:italic;"><small>${b.fecha} | Por: ${b.autor}</small></p>
      <hr style="margin: 20px 0; border:0; border-top:1px solid #eee;">
      <div style="line-height:1.6;">${b.contenido}</div>
      <br>
      <a href="blogs.html" class="btn">Volver a Blogs</a>
    </article>
  `;
}

// ---- 3. Inicialización Principal ----

window.addEventListener('DOMContentLoaded', () => {
  // Footer año actual
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear().toString();

  // Inicializar Módulos
  renderHomePlans();    // Home
  renderProductsPage(); // Catálogo
  renderDetailPage();   // Detalle Producto
  renderBlogsList();    // Lista Blogs
  renderBlogDetail();   // Detalle Blog
  loadTrainers();       // Cargar entrenadores (Nosotros)
  
  renderCart();         // Renderizar estado inicial del carrito
  initAuth();           // Event listeners para Login/Registro

  // Event listeners del Carrito (Botones globales)
  const btnClear = $<HTMLButtonElement>('#btn-clear-cart');
  const btnCheckout = $<HTMLButtonElement>('#btn-checkout');

  if (btnClear) {
    btnClear.addEventListener('click', clearCart);
  }
  if (btnCheckout) {
    btnCheckout.addEventListener('click', checkout);
  }

  // Actualizar Header (Usuario logueado)
  updateHeader();
});
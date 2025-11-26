// src/tienda/js/trainers.ts
import { API_URLS } from './config';
import { Trainer } from './types';
import { $ } from './utils/dom'; // Asumiendo que tienes este helper

export async function loadTrainers(): Promise<void> {
  const container = $<HTMLDivElement>("#trainers-list");
  
  // Si no estamos en la página nosotros.html, el contenedor no existe, salimos.
  if (!container) return;

  container.innerHTML = "<p>Cargando equipo...</p>";

  try {
    const response = await fetch(API_URLS.TRAINERS);
    
    if (!response.ok) {
        throw new Error("Error al obtener entrenadores");
    }

    const trainers: Trainer[] = await response.json();

    if (trainers.length === 0) {
      container.innerHTML = "<p>No hay entrenadores registrados aún.</p>";
      return;
    }

    // Renderizar tarjetas
    container.innerHTML = trainers.map(t => `
      <article class="card">
        <img src="${t.photoUrl || '../assets/default-user.png'}" 
             alt="${t.nombre}" 
             style="width:100%; height:200px; object-fit:cover; border-radius:8px 8px 0 0; margin-bottom:10px;">
        <h4>${t.nombre}</h4>
        <p style="color: var(--primary); font-weight: bold;">${t.especialidad}</p>
        <p style="font-size: 0.9rem; color: #666;">${t.email}</p>
      </article>
    `).join("");

  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Hubo un error al cargar nuestro equipo.</p>";
  }
}
// src/tienda/js/data/products.ts

import { Product, SavedProduct } from '../types';

function getProducts(): Product[] {
  // 1. Recuperar datos del LocalStorage de manera segura
  const rawData = localStorage.getItem("PRODUCTS");
  const saved: SavedProduct[] = rawData ? JSON.parse(rawData) : [];

  // 2. Si no hay productos en localStorage, devolvemos la lista estática (HARDCODED)
  // IMPORTANTE: Cambié los IDs a 'number' para compatibilidad con el Backend Java
  if (saved.length === 0) {
    return [
      {
        id: 101, // Antes 'm1'. Usamos números para evitar errores con el backend.
        nombre: 'Plan Mensual',
        precio: 19990,
        features: ['Acceso 24/7','Clases básicas','App y progreso'],
        img: 'plan_mensual.png',
        descripcion: 'Plan de acceso completo mensual',
        stock: 999
      },
      {
        id: 102, // Antes 'm2'
        nombre: 'Plan Anual',
        precio: 199900,
        features: ['Ahorro del 20%','Congelamiento 30 días', 'Evaluación gratis'],
        img: 'plan_mensual.png', // Asegúrate de tener la imagen
        descripcion: 'Suscripción anual con beneficios',
        stock: 999
      },
      {
        id: 201, // Antes 'acc3'
        nombre: 'Bandas Elásticas',
        precio: 9990,
        features: ['3 niveles de resistencia','Antideslizantes'],
        img: 'bandas.png',
        descripcion: 'Set de bandas de resistencia',
        stock: 50
      }
    ];
  }

  // 3. Si hay datos en LocalStorage (del antiguo Admin), los transformamos
  return saved.map((p: SavedProduct): Product => {
    // Conversión segura de tipos
    const numericId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
    const numericPrice = typeof p.precio === 'string' ? parseFloat(p.precio) : p.precio;

    return {
      id: numericId || 0, // Fallback a 0 si falla
      nombre: p.nombre,
      precio: numericPrice,
      img: (p.img && p.img.trim()) ? p.img : 'default.png',
      // Adaptamos 'desc' (string) a 'features' (array de strings)
      features: p.desc ? [p.desc] : ["Producto general"],
      descripcion: p.desc || '',
      stock: 10 // Stock dummy para productos locales
    };
  });
}

// Exportamos la constante para usarla en otros archivos
export const PRODUCTS = getProducts();
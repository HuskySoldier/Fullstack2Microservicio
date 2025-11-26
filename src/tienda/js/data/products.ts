// src/tienda/js/data/products.ts

import { Product, SavedProduct } from '../types';

function getProducts(): Product[] {
  const saved: SavedProduct[] = JSON.parse(localStorage.getItem("PRODUCTS") || "[]");

  if (saved.length === 0) {
    return [
      {
        id:'m1',
        nombre:'Mensual',
        precio:19990,
        features:['Acceso 24/7','Clases básicas','App y progreso'],
        img:'plan_mensual.png'
      },
      // ... (el resto de tus productos) ...
      {
        id:'acc3',
        nombre:'Bandas Elásticas',
        precio:9990,
        features:['3 niveles de resistencia','Antideslizantes'],
        img:'bandas.png'
      }
    ];
  }

  return saved.map((p: SavedProduct): Product => ({
    id: p.codigo || p.id,
    nombre: p.nombre,
    precio: parseFloat(p.precio),
    img: p.img && p.img.trim() ? p.img : 'logo.svg',
    features: p.desc ? [p.desc] : ["Plan personalizado"]
  }));
}

// ¡¡ESTA ES LA LÍNEA QUE FALTABA!!
export const PRODUCTS = getProducts();
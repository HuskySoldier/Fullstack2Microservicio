// src/tienda/js/types.ts

// Interfaz de Usuario (Coincide con User.java)
export interface User {
  id?: number;
  run?: string;
  nombre: string;
  apellidos?: string;
  email: string;
  pass?: string; // Opcional: no siempre viaja desde el back
  fnac?: string;
  rol?: 'Administrador' | 'Vendedor' | 'Cliente';
  region?: string;
  comuna?: string;
  dir?: string;
  telefono?: string;
}

// Interfaz de Producto (Coincide con Product.java)
export interface Product {
  id: number;      // Long en Java -> number en TS
  nombre: string;
  precio: number;  // Integer/Double en Java -> number en TS
  stock: number;
  img: string;
  descripcion?: string; // Agregado: Usado en detalles
  tipo?: string;   // "Producto", "Plan", etc.
  features?: string[]; // Opcional: Para listas de características en el front
}

// Interfaz para Blogs (Frontend)
export interface Blog {
  id: string;
  titulo: string;
  autor: string;
  fecha: string;
  resumen: string;
  contenido: string;
  img: string;
}

// --- DTOs para Comunicación con Microservicios ---

// Respuesta del LoginService
export interface LoginResponse {
  success: boolean; 
  message: string;
  token?: string;
  user?: User;
}

// Item del carrito para enviar al CheckoutService
export interface CartItemDto {
  productId: number;
  qty: number;       // @JsonProperty("qty") en Java
  precio: number;    // Backend espera 'precio'
  nombre: string;    // Útil para el historial o recibo
  tipo: string;      // "Producto" o "Plan"
}

// Request principal al CheckoutService
export interface CheckoutRequest {
  userEmail: string; // IMPORTANTE: Java espera 'userEmail', no 'email'
  items: CartItemDto[];
  totalAmount: number;
}

// --- Tipos Internos del Frontend ---

// Estructura del ítem en el carrito local (localStorage)
export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  qty: number;
  img?: string;
  tipo?: string;
}

// Usuario guardado en Session (localStorage)
export interface SessionUser {
  nombre: string;
  email: string;
  rol: string;
  token?: string;
}

// Interfaz auxiliar para productos guardados en el localStorage antiguo (Admin viejo)
// Esto evita errores en data/products.ts
export interface SavedProduct {
    id: string | number;
    nombre: string;
    precio: string | number;
    img: string;
    desc?: string;
    codigo?: string;
}

// --- Entrenadores y Reservas (Trainers & Bookings) ---

export interface Trainer {
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  photoUrl?: string; // Coincide con 'photoUrl' en Java
}

export interface Booking {
  id?: number;
  userEmail: string;
  trainerId: number;
  dateTime: string; // ISO Date string
  status?: string;
}

// --- Asistencia (Attendance) ---

export interface AttendanceRecord {
  id?: number;
  userEmail: string;
  checkInTime: string;
  sedeId: number;
}
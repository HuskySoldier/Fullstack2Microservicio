// src/tienda/js/types.ts

export interface User {
  run?: string;
  nombre: string;
  apellidos?: string;
  email: string;
  pass?: string; // Opcional porque no siempre la recibimos del back
  fnac?: string;
  rol?: 'Administrador' | 'Vendedor' | 'Cliente';
  region?: string;
  comuna?: string;
  dir?: string;
}

export interface Product {
  id: number; // El backend usa Integer, no string
  nombre: string;
  precio: number;
  stock: number;
  img: string;
  tipo?: string;
  features?: string[]; // Asegúrate que el backend envíe esto o manéjalo opcional
}

export interface Blog {
  id: string;
  titulo: string;
  autor: string;
  fecha: string;
  resumen: string;
  contenido: string;
  img: string;
}

// DTO para respuesta del LoginService
export interface LoginResponse {
  success: boolean; // Tu backend devuelve un mapa
  message: string;
  token?: string;
  user?: User;
}

// DTO para request al CheckoutService
export interface CheckoutRequest {
  userEmail: string; // <--- CAMBIO: Antes era 'email', ahora debe ser 'userEmail' para coincidir con Java
  items: CartItemDto[];
  totalAmount: number;
}

export interface CartItemDto {
  productId: number;
  qty: number;      // Cambiado de 'quantity' a 'qty' (Backend usa @JsonProperty("qty"))
  precio: number;   // Cambiado de 'price' a 'precio' (Backend espera 'precio')
  nombre: string;   // Aseguramos que también se envíe si el backend lo usa
  tipo: string;     // Aseguramos el tipo (plan/merch)
}

// Tipos del Frontend
export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  qty: number;
  img?: string;
}

export interface SessionUser {
  nombre: string;
  email: string;
  rol: string;
  token?: string;
}



export interface Trainer {
  id: number;
  nombre: string;
  especialidad: string;
  email: string;
  photoUrl?: string; // En Java lo llamaste 'photoUrl'
}

export interface Booking {
  id?: number;
  userEmail: string;
  trainerId: number;
  dateTime: string; // ISO Date string
  status?: string;
}

export interface AttendanceRecord {
  id?: number;
  userEmail: string;
  checkInTime: string;
  sedeId: number;
}
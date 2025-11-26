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

// DTO para respuesta del LoginService
export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string; // Si usas JWT
  user?: User;
}

// DTO para request al CheckoutService
export interface CheckoutRequest {
  email: string;
  items: CartItemDto[];
  totalAmount: number;
}

export interface CartItemDto {
  productId: number;
  quantity: number;
  price: number;
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
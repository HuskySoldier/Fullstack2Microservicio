import { $ } from './utils/dom';
import { SessionUser, LoginResponse } from './types';
import { API_URLS } from './config'; 
import { validateLogin, validateRegistro } from './validators'; 

console.log("Cargando módulo de autenticación..."); // <--- VERIFICA ESTO EN LA CONSOLA

export function initAuth(): void {
  console.log("Inicializando Auth...");

  // LOGIN
  const fLog = $<HTMLFormElement>("#form-login");
  if (fLog) {
    console.log("Formulario Login encontrado");
    
    fLog.addEventListener("submit", (e: SubmitEvent) => {
      console.log("Intento de envío de Login...");
      e.preventDefault(); // <--- ESTO EVITA QUE LA URL CAMBIE A ?email=...
      
      if (validateLogin(fLog)) {
        console.log("Validación correcta, llamando al backend...");
        loginUser();        
      } else {
        console.log("Validación fallida");
      }
    });
  }

  // REGISTRO
  const fReg = $<HTMLFormElement>("#form-registro");
  if (fReg) {
    fReg.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      if (validateRegistro(fReg)) {
        registerUser();
      }
    });
  }
}

export function logoutUser(): void {
  localStorage.removeItem('session_user');
  location.href = resolveTiendaIndex();
}

function resolveTiendaIndex(): string {
  const p = location.pathname.replace(/\\/g,'/');
  if (p.includes('/tienda/pages/')) return '../index.html';
  if (p.includes('/tienda/')) return 'index.html';
  return '/tienda/index.html';
}

async function loginUser(): Promise<void> {
  const emailInput = $<HTMLInputElement>("#log-email");
  const passInput = $<HTMLInputElement>("#log-pass");
  
  if (!emailInput || !passInput) return;

  const requestBody = {
    email: emailInput.value.trim(),
    password: passInput.value.trim()
  };

  try {
    const response = await fetch(API_URLS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    // Verificar si la respuesta es JSON antes de parsear
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("El servidor no devolvió JSON. Posible error 404 o 500.");
    }

    const data: LoginResponse = await response.json();

    if (response.ok && (data.success || data.user)) { // Ajuste por si tu backend no envía 'success'
      const sessionUser: SessionUser = {
        nombre: data.user?.nombre || "Usuario",
        email: data.user?.email || requestBody.email,
        rol: data.user?.rol || "Cliente",
        token: data.token 
      };

      localStorage.setItem("session_user", JSON.stringify(sessionUser));
      alert(`Bienvenido ${sessionUser.nombre}`);
      window.location.href = resolveTiendaIndex(); 
    } else {
      alert(data.message || "Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error de conexión. Verifica que el puerto 8083 esté corriendo.");
  }
}

// (Puedes mantener registerUser igual que antes)
async function registerUser(): Promise<void> {
    // ... tu lógica de registro ...
}
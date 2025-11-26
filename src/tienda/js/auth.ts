import { $ } from './utils/dom';
import { SessionUser, LoginResponse } from './types';
import { API_URLS } from './config'; 

// --- Función Principal (Exportada) ---
export function initAuth(): void {
  // Conectar formulario de Registro
  const fReg = $<HTMLFormElement>("#form-registro");
  if (fReg) {
    fReg.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      registerUser();
    });
  }

  // Conectar formulario de Login
  const fLog = $<HTMLFormElement>("#form-login");
  if (fLog) {
    fLog.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault(); // Esto es lo que evita que salga ?email=... en la URL
      loginUser();        
    });
  }
}

export function logoutUser(): void {
  localStorage.removeItem('session_user');
  location.href = resolveTiendaIndex();
}

// --- Funciones Internas ---

function resolveTiendaIndex(): string {
  const p = location.pathname.replace(/\\/g,'/');
  if (p.includes('/tienda/pages/')) return '../index.html';
  if (p.includes('/tienda/')) return 'index.html';
  return '/tienda/index.html';
}

// 1. REGISTRO
async function registerUser(): Promise<void> {
  const nombreInput = $<HTMLInputElement>("#reg-nombre");
  const emailInput = $<HTMLInputElement>("#reg-email");
  const passInput = $<HTMLInputElement>("#reg-pass");

  if (!nombreInput || !emailInput || !passInput) return;

  const requestBody = {
    nombre: nombreInput.value.trim(),
    email: emailInput.value.trim(),
    password: passInput.value.trim(),
    rol: "Cliente"
  };

  try {
    const response = await fetch(API_URLS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      window.location.href = "login.html";
    } else {
      const data = await response.json();
      alert("Error: " + (data.message || "No se pudo registrar"));
    }
  } catch (error) {
    console.error(error);
    alert("Error de conexión con el servidor.");
  }
}

// 2. LOGIN
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

    const data: LoginResponse = await response.json();

    if (response.ok && data.success) {
      const sessionUser: SessionUser = {
        nombre: data.user?.nombre || "Usuario",
        email: data.user?.email || requestBody.email,
        rol: data.user?.rol || "Cliente",
        token: data.token 
      };

      localStorage.setItem("session_user", JSON.stringify(sessionUser));

      alert(`Bienvenido ${sessionUser.nombre}`);
      
      // Redirección corregida usando la función auxiliar
      window.location.href = resolveTiendaIndex(); 
    } else {
      alert(data.message || "Credenciales incorrectas");
    }
  } catch (error) {
    console.error("Error en login:", error);
    alert("Error de conexión. Asegúrate de que el servicio de Login (puerto 8083) esté corriendo.");
  }
}
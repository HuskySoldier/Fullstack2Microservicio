// src/tienda/js/auth.ts
import { $ } from './utils/dom';
import { API_URLS } from './config';
import { LoginResponse, SessionUser } from './types';

// ... (imports y initAuth se mantienen igual) ...
export function initAuth(): void {
  const fReg = $<HTMLFormElement>("#form-registro");
  if (fReg) {
    fReg.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      registerUser();   
    });
  }

  const fLog = $<HTMLFormElement>("#form-login");
  if (fLog) {
    fLog.addEventListener("submit", (e: SubmitEvent) => {
      e.preventDefault();
      loginUser();
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

// ----------------- Registro (Conectado a Microservicio) -----------------
async function registerUser(): Promise<void> {
  const nombreInput = $<HTMLInputElement>("#reg-nombre");
  const emailInput = $<HTMLInputElement>("#reg-email");
  const passInput = $<HTMLInputElement>("#reg-pass");

  if (!nombreInput || !emailInput || !passInput) return;

  const requestBody = {
    nombre: nombreInput.value.trim(),
    email: emailInput.value.trim(),
    password: passInput.value.trim(),
    rol: "Cliente" // Valor por defecto
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
      const errorData = await response.json();
      alert("Error en registro: " + (errorData.message || "Datos inválidos"));
    }
  } catch (error) {
    console.error(error);
    alert("Error de conexión con el servidor de registro.");
  }
}

// ----------------- Login (Conectado a Microservicio) -----------------
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

    if (response.ok && data.success && data.user) {
      // Guardar sesión
      const session: SessionUser = {
        nombre: data.user.nombre,
        email: data.user.email,
        rol: data.user.rol || 'Cliente',
        token: data.token // Guardar token JWT si existe
      };
      
      localStorage.setItem("session_user", JSON.stringify(session));
      alert(`Bienvenido ${session.nombre}`);
      window.location.href = "../index.html"; 
    } else {
      alert(data.message || "Credenciales incorrectas");
    }
  } catch (error) {
    console.error(error);
    alert("Error de conexión con el servidor de login.");
  }
}

// (Eliminada la función seedAdmin ya que los usuarios ahora están en BD)
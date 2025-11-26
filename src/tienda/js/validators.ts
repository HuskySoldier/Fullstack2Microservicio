// src/tienda/js/validators.ts

// Expresión regular para correos permitidos
export const EMAIL_OK = /.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

// Función auxiliar para mostrar errores en el HTML
export function setError(input: HTMLInputElement, msg: string): void {
  const parent = input.parentElement;
  if (parent) {
    // Busca la etiqueta <small> para poner el mensaje
    let small = parent.querySelector('small.error');
    
    // Si no existe, la creamos dinámicamente (opcional, depende de tu HTML)
    if (!small) {
      small = document.createElement('small');
      small.className = 'error';
      small.setAttribute('style', 'color: red; display: block; margin-top: 5px; font-size: 0.8em;');
      parent.appendChild(small);
    }
    
    small.textContent = msg || '';
  }
  // Marca el input como inválido visualmente si hay CSS para ello
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (msg) {
      input.style.borderColor = 'red';
  } else {
      input.style.borderColor = ''; // Restaurar color original
  }
}

// --- Validador de Registro ---
export function validateRegistro(form: HTMLFormElement): boolean {
  const nombre = form.querySelector('#reg-nombre') as HTMLInputElement;
  const email  = form.querySelector('#reg-email') as HTMLInputElement;
  const pass   = form.querySelector('#reg-pass') as HTMLInputElement;
  
  let ok = true;

  // Nombre: Mínimo 3 caracteres
  if (!nombre || !nombre.value.trim() || nombre.value.trim().length < 3) {
    setError(nombre, 'Mínimo 3 caracteres');
    ok = false;
  } else {
    setError(nombre, '');
  }

  // Email: Formato Duoc o Gmail
  if (!email || !EMAIL_OK.test(email.value.trim())) {
    setError(email, 'Solo @duoc.cl, @profesor.duoc.cl o @gmail.com');
    ok = false;
  } else {
    setError(email, '');
  }

  // Contraseña: 4 a 10 caracteres
  if (!pass || pass.value.trim().length < 4 || pass.value.trim().length > 10) {
    setError(pass, '4 a 10 caracteres');
    ok = false;
  } else {
    setError(pass, '');
  }

  return ok;
}

// --- Validador de Login ---
export function validateLogin(form: HTMLFormElement): boolean {
  const email = form.querySelector('#log-email') as HTMLInputElement;
  const pass  = form.querySelector('#log-pass') as HTMLInputElement;
  
  let ok = true;

  // Validación simple de email
  if (!email || !EMAIL_OK.test(email.value.trim())) {
    setError(email, 'Correo no válido o no permitido');
    ok = false;
  } else {
    setError(email, '');
  }

  // Validación simple de contraseña (longitud)
  if (!pass || pass.value.trim().length < 4 || pass.value.trim().length > 10) {
    setError(pass, 'La contraseña debe tener entre 4 y 10 caracteres');
    ok = false;
  } else {
    setError(pass, '');
  }

  return ok;
}
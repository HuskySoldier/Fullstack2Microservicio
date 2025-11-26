// ---------- Validators centralizados ----------
const EMAIL_OK = /.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

function setError(input, msg){
  const small = input.parentElement.querySelector('small.error');
  if(small){ small.textContent = msg || ''; }
  input.setAttribute('aria-invalid', msg ? 'true':'false');
}

function validateRegistro(form){
  const nombre = form.querySelector('#reg-nombre');
  const email  = form.querySelector('#reg-email');
  const pass   = form.querySelector('#reg-pass');
  let ok = true;

  if(!nombre.value.trim() || nombre.value.trim().length<3){ setError(nombre,'Mínimo 3 caracteres'); ok=false; } else setError(nombre,'');
  if(!EMAIL_OK.test(email.value.trim())){ setError(email,'Solo @duoc.cl, @profesor.duoc.cl o @gmail.com'); ok=false; } else setError(email,'');
  if(pass.value.trim().length<4 || pass.value.trim().length>10){ setError(pass,'4 a 10 caracteres'); ok=false; } else setError(pass,'');

  return ok;
}

function validateLogin(form){
  const email = form.querySelector('#log-email');
  const pass  = form.querySelector('#log-pass');
  let ok = true;

  if(!EMAIL_OK.test(email.value.trim())){ setError(email,'Correo no permitido'); ok=false; } else setError(email,'');
  if(pass.value.trim().length<4 || pass.value.trim().length>10){ setError(pass,'4 a 10 caracteres'); ok=false; } else setError(pass,'');

  return ok;
}

function validateContacto(form){
  const n = form.querySelector('#con-nombre');
  const e = form.querySelector('#con-email');
  const c = form.querySelector('#con-coment');
  let ok = true;

  if(n.value.trim().length<1 || n.value.trim().length>100){ setError(n,'1 a 100 caracteres'); ok=false; } else setError(n,'');
  if(!EMAIL_OK.test(e.value.trim())){ setError(e,'Correo no permitido'); ok=false; } else setError(e,'');
  if(c.value.trim().length<1 || c.value.trim().length>500){ setError(c,'1 a 500 caracteres'); ok=false; } else setError(c,'');

  return ok;
}

// Enlazar validación en tiempo real
document.addEventListener('DOMContentLoaded', ()=>{
  const fr = document.getElementById('form-registro');
  if(fr){
    fr.addEventListener('input', ()=> validateRegistro(fr));
    fr.addEventListener('submit',(e)=>{ if(!validateRegistro(fr)) e.preventDefault(); });
  }
  const fl = document.getElementById('form-login');
  if(fl){
    fl.addEventListener('input', ()=> validateLogin(fl));
    fl.addEventListener('submit',(e)=>{ if(!validateLogin(fl)) e.preventDefault(); });
  }
  const fc = document.getElementById('form-contacto');
  if(fc){
    fc.addEventListener('input', ()=> validateContacto(fc));
    fc.addEventListener('submit',(e)=>{ if(!validateContacto(fc)) e.preventDefault(); });
  }
});



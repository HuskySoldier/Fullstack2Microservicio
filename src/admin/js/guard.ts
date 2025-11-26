(function(){
  const u = JSON.parse(localStorage.getItem('session_user')||'null');

  // Ruta del login de Tienda (depende de la profundidad)
  const toLogin = location.pathname.includes('/admin/pages/') ? '../../tienda/pages/login.html' : '../tienda/pages/login.html';

  if(!u){ alert('Debes iniciar sesión'); location.href = toLogin; return; }

  const path = location.pathname;

  // Usuarios: solo Administrador
  if(path.endsWith('/usuarios.html') && u.rol !== 'Administrador'){
    alert('Acceso solo para Administrador');
    location.href = toLogin;
    return;
  }

  // Productos y Dashboard: Admin o Vendedor
  if((path.endsWith('/productos.html') || path.endsWith('/index.html') || path.endsWith('/admin/')) &&
     !(u.rol === 'Administrador' || u.rol === 'Vendedor')){
    alert('Acceso solo para Administrador/Vendedor');
    location.href = toLogin;
  }
})();

// ----------------- Storage wrapper -----------------
const STORE = {
  get(k){ return JSON.parse(localStorage.getItem(k)||'[]'); },
  set(k,v){ localStorage.setItem(k, JSON.stringify(v)); },
};

// Usamos la misma clave que la Tienda
const K = { PRODS:'PRODUCTS', USERS:'users' };

// ----------------- Dashboard -----------------
function initDashboard(){
  const kpip = document.getElementById('kpi-prod');
  const kpiu = document.getElementById('kpi-users');
  if(kpip) kpip.textContent = STORE.get(K.PRODS).length + ' productos';
  if(kpiu) kpiu.textContent = STORE.get(K.USERS).length + ' usuarios';
}

// ----------------- Productos -----------------
function renderProductos(){
  const tb = document.querySelector('#tbl-productos tbody');
  if(!tb) return;
  const productos = STORE.get(K.PRODS);

  tb.innerHTML = productos.map(p => {
    const id        = p.id || 'N/A';
    const nombre    = p.nombre || 'Sin nombre';
    const precio    = p.precio || 0;
    const stock     = (p.stock !== undefined) ? p.stock : '-';
    const categoria = p.categoria || (p.features ? 'plan' : '-');

    return `
      <tr>
        <td>${id}</td>
        <td>${nombre}</td>
        <td>${CLP(precio)}</td>
        <td>${stock}</td>
        <td>${categoria}</td>
        <td>
          <button class="btn" data-edit="${id}">Editar</button>
          <button class="btn subtle" data-del="${id}">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');

  tb.querySelectorAll('[data-edit]').forEach(b => b.onclick = ()=> loadProd(b.dataset.edit));
  tb.querySelectorAll('[data-del]').forEach(b => b.onclick = ()=> delProd(b.dataset.del));
}

function loadProd(id){
  const f = document.getElementById('frm-producto'); if(!f) return;
  const p = STORE.get(K.PRODS).find(x=> (x.id||x.codigo)===id);
  if(!p) return;

  f['p-codigo'].value = p.id || p.codigo;
  f['p-nombre'].value = p.nombre || '';
  f['p-desc'].value   = (p.features && p.features[0]) || p.desc || '';
  f['p-precio'].value = p.precio || 0;
  f['p-stock'].value  = p.stock || 0;
  f['p-cat'].value    = p.categoria || (p.features ? 'plan' : '');
  f['p-img'].value    = p.img || '';
}

function delProd(id){
  if(!confirm('¿Eliminar producto?')) return;
  let arr = STORE.get(K.PRODS).filter(x=> (x.id||x.codigo)!==id);
  STORE.set(K.PRODS, arr);
  renderProductos();
  initDashboard();
}

function bindProdForm(){
  const f = document.getElementById('frm-producto'); if(!f) return;
  const clear = document.getElementById('btn-limpiar');

  f.onsubmit = (e)=>{
    e.preventDefault();
    const codigo    = f['p-codigo'].value.trim();
    const nombre    = f['p-nombre'].value.trim();
    const precio    = parseFloat(f['p-precio'].value);
    const stock     = parseInt(f['p-stock'].value);
    const categoria = f['p-cat'].value;

    if(codigo.length<3 || !nombre || nombre.length>100 || isNaN(precio) || precio<0 || isNaN(stock) || stock<0 || !categoria){
      alert('Revisa los campos.'); return;
    }

    let arr = STORE.get(K.PRODS);
    const idx = arr.findIndex(x=>(x.id||x.codigo)===codigo);

    const obj = { 
      id: codigo,
      nombre, 
      precio, 
      stock, 
      categoria, 
      img: f['p-img'].value.trim(),
      features: [f['p-desc'].value.trim() || "Plan personalizado"]
    };

    if(idx>=0) arr[idx]=obj; else arr.push(obj);
    STORE.set(K.PRODS, arr);
    renderProductos();
    initDashboard();
    f.reset();
  };

  if(clear) clear.onclick = ()=> f.reset();
}

// ----------------- Usuarios (sin cambios grandes) -----------------
function renderRegiones(){
  const r = document.getElementById('u-region'); const c = document.getElementById('u-comuna');
  if(!r || !c || !window.REGIONES) return;
  r.innerHTML = '<option value="">Seleccionar</option>' + Object.keys(REGIONES).map(k=>`<option>${k}</option>`).join('');
  r.onchange = ()=>{
    const sel = r.value; const list = REGIONES[sel] || [];
    c.innerHTML = '<option value="">Seleccionar</option>' + list.map(x=>`<option>${x}</option>`).join('');
  };
}

function renderUsuarios(){
  const tb = document.querySelector('#tbl-usuarios tbody'); if(!tb) return;
  const arr = STORE.get(K.USERS);
  tb.innerHTML = arr.map(u => `<tr>
    <td>${u.run}</td><td>${u.nombre}</td><td>${u.apellidos}</td><td>${u.email}</td><td>${u.rol}</td><td>${u.region}/${u.comuna}</td>
    <td>
      <button class="btn" data-edit="${u.run}">Editar</button>
      <button class="btn subtle" data-del="${u.run}">Eliminar</button>
    </td>
  </tr>`).join('');
  tb.querySelectorAll('[data-edit]').forEach(b => b.onclick = ()=> loadUser(b.dataset.edit));
  tb.querySelectorAll('[data-del]').forEach(b => b.onclick = ()=> delUser(b.dataset.del));
}

function loadUser(run){
  const f = document.getElementById('frm-usuario'); if(!f) return;
  const u = STORE.get(K.USERS).find(x=>x.run===run); if(!u) return;
  f['u-run'].value=u.run;
  f['u-nombre'].value=u.nombre;
  f['u-apellidos'].value=u.apellidos;
  f['u-email'].value=u.email;
  f['u-fnac'].value=u.fnac||'';
  f['u-rol'].value=u.rol;
  f['u-region'].value=u.region;
  f['u-region'].dispatchEvent(new Event('change'));
  f['u-comuna'].value=u.comuna;
  f['u-dir'].value=u.dir;
}

function delUser(run){
  if(!confirm('¿Eliminar usuario?')) return;
  let arr = STORE.get(K.USERS).filter(x=>x.run!==run);
  STORE.set(K.USERS, arr);
  renderUsuarios();
  initDashboard();
}

function bindUserForm(){
  const f = document.getElementById('frm-usuario'); if(!f) return;
  const clear = document.getElementById('btn-limpiar-u');
  f.onsubmit = (e)=>{
    e.preventDefault();
    const run = f['u-run'].value.trim().toUpperCase();
    const nombre = f['u-nombre'].value.trim();
    const apellidos = f['u-apellidos'].value.trim();
    const email = f['u-email'].value.trim();
    const rol = f['u-rol'].value;
    const region = f['u-region'].value;
    const comuna = f['u-comuna'].value;
    const dir = f['u-dir'].value.trim();
    if(!validarRUN(run)){ alert('RUN inválido.'); return; }
    if(!nombre || nombre.length>50){ alert('Nombre inválido'); return; }
    if(!apellidos || apellidos.length>100){ alert('Apellidos inválidos'); return; }
    if(!EMAIL_OK.test(email)){ alert('Correo inválido'); return; }
    if(!rol || !region || !comuna || !dir || dir.length>300){ alert('Completa todos los campos'); return; }
    let arr = STORE.get(K.USERS);
    const idx = arr.findIndex(x=>x.run===run);
    const obj = { run, nombre, apellidos, email, fnac:f['u-fnac'].value || '', rol, region, comuna, dir };
    if(idx>=0) arr[idx]=obj; else arr.push(obj);
    STORE.set(K.USERS, arr);
    renderUsuarios();
    initDashboard();
    f.reset();
  };
  if(clear) clear.onclick = ()=> f.reset();
}

// ----------------- Init -----------------
window.addEventListener('DOMContentLoaded', ()=>{
  initDashboard();
  renderProductos(); bindProdForm();
  renderRegiones(); renderUsuarios(); bindUserForm();
});

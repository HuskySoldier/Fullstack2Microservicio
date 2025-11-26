const USER_KEY = "users";

function getUsers(){
  return JSON.parse(localStorage.getItem(USER_KEY) || "[]");
}

function saveUsers(users){
  localStorage.setItem(USER_KEY, JSON.stringify(users));
}

function renderUsers(){
  const tbody = document.querySelector("#tbl-usuarios tbody");
  if(!tbody) return;

  let users = getUsers();
  if(users.length === 0){
    tbody.innerHTML = `<tr><td colspan="7">No hay usuarios registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = users.map((u,i)=>`
    <tr>
      <td>${u.run || "—"}</td>
      <td>${u.nombre || "—"}</td>
      <td>${u.apellidos || "—"}</td>
      <td>${u.email || "—"}</td>
      <td>${u.rol || "Cliente"}</td>
      <td>${(u.region || "—")} / ${(u.comuna || "—")}</td>
      <td>
        <button onclick="editUser(${i})">✏️</button>
        <button onclick="deleteUser(${i})">🗑️</button>
      </td>
    </tr>
  `).join("");
}

function saveUserForm(){
  const index    = document.getElementById("u-index").value;
  const run      = document.getElementById("u-run").value.trim();
  const nombre   = document.getElementById("u-nombre").value.trim();
  const apellidos= document.getElementById("u-apellidos").value.trim();
  const email    = document.getElementById("u-email").value.trim();
  const fnac     = document.getElementById("u-fnac").value.trim();
  const rol      = document.getElementById("u-rol").value || "Cliente";
  const region   = document.getElementById("u-region").value.trim();
  const comuna   = document.getElementById("u-comuna").value.trim();
  const dir      = document.getElementById("u-dir").value.trim();

  // Validaciones básicas
  if(nombre.length < 3){ alert("Nombre inválido"); return false; }
  if(!/.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/.test(email)){ 
    alert("Correo inválido"); return false; 
  }

  let users = getUsers();

  if(index !== ""){
    // Editar
    users[index] = {...users[index], run, nombre, apellidos, email, fnac, rol, region, comuna, dir};
  } else {
    // Crear nuevo
    users.push({ run, nombre, apellidos, email, pass:"", fnac, rol, region, comuna, dir });
  }

  saveUsers(users);
  renderUsers();
  document.getElementById("frm-usuario").reset();
  document.getElementById("u-index").value = "";
  return false;
}

function editUser(index){
  const u = getUsers()[index];
  document.getElementById("u-index").value     = index;
  document.getElementById("u-run").value       = u.run || "";
  document.getElementById("u-nombre").value    = u.nombre || "";
  document.getElementById("u-apellidos").value = u.apellidos || "";
  document.getElementById("u-email").value     = u.email || "";
  document.getElementById("u-fnac").value      = u.fnac || "";
  document.getElementById("u-rol").value       = u.rol || "Cliente";
  document.getElementById("u-region").value    = u.region || "";
  document.getElementById("u-comuna").value    = u.comuna || "";
  document.getElementById("u-dir").value       = u.dir || "";
}

function deleteUser(index){
  if(!confirm("¿Eliminar este usuario?")) return;
  let users = getUsers();
  users.splice(index,1);
  saveUsers(users);
  renderUsers();
}


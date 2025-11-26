(function(){
  // Leer datos del storage
  const users  = JSON.parse(localStorage.getItem('users')    || '[]');
  const prods  = JSON.parse(localStorage.getItem('PRODUCTS') || '[]');
  const orders = JSON.parse(localStorage.getItem('orders')   || '[]');

  // Helper para asignar valores a KPIs
  const el = id => document.getElementById(id);
  if(el('kpi-users'))  el('kpi-users').textContent  = users.length;
  if(el('kpi-prod'))   el('kpi-prod').textContent   = prods.length;
  if(el('kpi-orders')) el('kpi-orders').textContent = orders.length;

  // Calcular revenue total
  const total = orders.reduce((s,o)=> s + (Number(o.total)||0), 0);
  if(el('kpi-rev')){
    el('kpi-rev').textContent = total.toLocaleString('es-CL',{
      style:'currency', currency:'CLP'
    });
  }

  // Agrupar ventas por día
  const byDay = {};
  orders.forEach(o=>{
    if(!o.date) return;
    const d = o.date.slice(0,10); // YYYY-MM-DD
    const monto = Number(o.total) || 0;
    byDay[d] = (byDay[d]||0) + monto;
  });

  const labels = Object.keys(byDay).sort();
  const data   = labels.map(k => byDay[k]);

  // Renderizar gráfico si hay datos
  const ctx = document.getElementById('chart-sales');
  if(ctx && labels.length){
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Ventas (CLP)',
          data,
          tension: .2,
          fill: false,
          borderWidth: 2
        }]
      },
      options:{
        plugins:{ legend:{ display:true }},
        scales:{
          y:{ ticks:{ callback:v=> v.toLocaleString('es-CL') } }
        }
      }
    });
  }
})();

// Admin validators (email, RUN, product fields)
const EMAIL_OK = /.+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

function rutDV(num){
  let s = 1; let m = 0;
  for(; num; num = Math.floor(num/10)) s = (s + num%10 * (9 - m++%6)) % 11;
  return s ? String(s-1) : 'K';
}
function validarRUN(run){
  // sin puntos ni guion, con DV al final
  const clean = run.trim().toUpperCase();
  if(clean.length < 7 || clean.length > 9) return false;
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  if(!/^\d+$/.test(cuerpo)) return false;
  const dvCalc = rutDV(parseInt(cuerpo,10));
  return String(dvCalc) === dv;
}

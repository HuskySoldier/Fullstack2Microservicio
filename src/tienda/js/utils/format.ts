// src/tienda/js/utils/format.ts

// Creamos un formateador de moneda para Peso Chileno (CLP)
const CLP_FORMATTER = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP"
});

/**
 * Formatea un número como moneda CLP.
 * @param value El número a formatear.
 * @returns El string formateado (ej: "$19.990").
 */
export function CLP(value: number): string {
  return CLP_FORMATTER.format(value);


  
}

// Si tienes otras funciones de formato, puedes añadirlas aquí.
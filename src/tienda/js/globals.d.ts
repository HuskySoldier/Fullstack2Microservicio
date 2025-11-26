// src/tienda/js/globals.d.ts
// ¡Este archivo está casi vacío!

// Opciones para el modal (ÚNICA DEPENDENCIA GLOBAL RESTANTE)
interface ModalOptions {
  title: string;
  body: string;
  actions?: {
    label: string;
    primary?: boolean;
    handler?: () => void;
  }[];
}

declare global {
  // Asumo que showModal viene de utils/modal.ts y aún no se ha migrado
  // ¡Migra ese archivo, impórtalo en cart.ts y podrás borrar este globals.d.ts!
  function showModal(options: ModalOptions): void;
}

// Es necesario un export vacío
export {};
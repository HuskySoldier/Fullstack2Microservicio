
// Tipado para que $ y $$ infieran el tipo de elemento
// Añadimos 'export' para poder importarlos

export const $ = <T extends Element = HTMLElement>(
  selector: string, 
  scope: Document | Element = document
): T | null => scope.querySelector<T>(selector);

export const $$ = <T extends Element = HTMLElement>(
  selector: string, 
  scope: Document | Element = document
): NodeListOf<T> => scope.querySelectorAll<T>(selector);
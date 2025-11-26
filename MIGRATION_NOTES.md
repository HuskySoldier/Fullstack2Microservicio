# Migración automática a TypeScript (resultado parcial)

He realizado los siguientes cambios automáticamente:

- Renombrado archivos `.jsx` → `.tsx` y `.js` → `.ts` (heurístico).
- Actualizado importaciones que referenciaban explícitamente `.js`/`.jsx` para apuntar a `.ts`/`.tsx`.
- Añadido `tsconfig.json` y `vite-env.d.ts`.
- Generado `vite.config.ts` (si existía `vite.config.js`, fue reemplazado).
- Actualizado (o creado) `package.json` con dependencias de desarrollo indicativas (no instaladas).

Qué falta y pasos recomendados:

1. Ejecutar `npm install` o `pnpm install` para instalar las nuevas dependencias.
2. Revisar cada componente y añadir tipos explícitos (Props, estados, retornos de funciones, etc.).
3. Corregir errores del compilador TypeScript que aparecerán en `npm run dev`.
4. Si usas librerías con tipos, instala `@types/...` adicionales según sea necesario.

Si quieres, puedo:

- Añadir anotaciones de tipos a componentes concretos (pega aquí algunos archivos).
- Ejecutar una pasadita más profunda para convertir hooks y contextos (me lo indicas).

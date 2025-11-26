import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // CORRECCIÓN 1: Apuntar directamente a la carpeta 'tienda' relativa a este archivo
  root: resolve(__dirname, 'tienda'), 
  
  build: {
    // La salida sube un nivel (..) para no quedar dentro de 'tienda/dist'
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true, // Limpia la carpeta dist antes de construir
    rollupOptions: {
      input: {
        // CORRECCIÓN 2: Rutas simplificadas para las páginas
        main: resolve(__dirname, 'tienda/index.html'),
        productos: resolve(__dirname, 'tienda/pages/productos.html'),
        login: resolve(__dirname, 'tienda/pages/login.html'),
        registro: resolve(__dirname, 'tienda/pages/registro.html'),
        carrito: resolve(__dirname, 'tienda/pages/carrito.html'),
        detalle: resolve(__dirname, 'tienda/pages/detalle.html'),
        blogs: resolve(__dirname, 'tienda/pages/blogs.html'),
        contacto: resolve(__dirname, 'tienda/pages/contacto.html'),
        nosotros: resolve(__dirname, 'tienda/pages/nosotros.html')
      }
    }
  },
  server: { 
    fs: {
      // Permite importar archivos fuera de la carpeta 'tienda' (como node_modules o src)
      allow: ['..'] 
    }
  }
})
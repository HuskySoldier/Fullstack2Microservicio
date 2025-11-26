import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  
  // 1. La raíz del servidor web sigue siendo 'tienda' (donde está tu index.html)
  root: resolve(__dirname, 'tienda'), 
  
  // 2. CORRECCIÓN CLAVE: Mapear la ruta '/src' a la carpeta real del sistema
  resolve: {
    alias: {
      '/src': resolve(__dirname, 'src')
    }
  },

  build: {
    // La salida se genera en la carpeta 'dist' del proyecto principal
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        // Declarar todas tus páginas HTML aquí
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
      // Permitir servir archivos que están fuera de 'tienda' (como src y node_modules)
      allow: ['..'] 
    }
  }
})
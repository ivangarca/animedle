import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Rutas relativas: asi funciona igual en Vercel, Cloudflare Pages
  // o GitHub Pages sin tener que cambiar nada.
  base: './',
  test: {
    environment: 'node',
  },
})

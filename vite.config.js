import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: { port: Number(process.env.VITE_PORT) || 5173 },
  plugins: [react(),tailwindcss()],
})

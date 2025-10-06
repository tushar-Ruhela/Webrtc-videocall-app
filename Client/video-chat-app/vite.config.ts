import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import dotenv from 'dotenv'
dotenv.config()

// https://vite.dev/config/
export default defineConfig({
  
  plugins: [react(),tailwindcss()],
  server:{
     host: true,
    port: process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) :5173,
  }
})

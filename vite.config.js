import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  root: './src/frontend',
  publicDir: '../../public',
  cacheDir: 'C:/Users/Vishw/.vite-cache/task-manager',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'react-router-dom', '@mui/material', '@mui/icons-material', 'cookie'],
  },
})

// require('@tailwindcss/line-clamp'),
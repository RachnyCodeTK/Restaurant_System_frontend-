import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000 // បង្កើនពី 500KB ទៅ 1000KB (ឬតាមការកំណត់របស់អ្នក)
  }
})
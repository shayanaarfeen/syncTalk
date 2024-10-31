import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  //serverConfig
  // server: {
  //   proxy: {
  //     '/api': 'back-end-point',
  //     // '/api': 'http://localhost:8000', // replace with your server's API endpoint
  //   },
  // },
  
  // pluginConfig
  plugins: [react()],
})

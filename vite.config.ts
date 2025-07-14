import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
   base: "/dashboard/",
   plugins: [
      react(),
      VitePWA({
         registerType: 'autoUpdate',
         devOptions: {
            enabled: true
         },
         includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
          manifest: {
              id: '/dashboard/',
              name: 'Dashboard del Clima - Proyecto 04',
              short_name: 'Dashboard del Clima',
              description: 'Proyecto 04 - dashboard del clima desarrollado con React y MUI',
              theme_color: '#D3D1D1',
              icons: [
                {
                    src: 'pwa-192x192.png',
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: 'pwa-512x512.png',
                    sizes: '512x512',
                    type: 'image/png',
                },
                {
                    src: "pwa-maskable-192x192.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "maskable"
                },
                {
                    src: "pwa-maskable-512x512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable"
                },
              ]
          }
      })
   ]
})
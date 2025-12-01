import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    // --- Tambahan PWA ---
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "family.png",
      ],
      manifest: {
        name: "Family Plan",
        short_name: "Family Plan",
        description: "Family Plan",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        start_url: "/",
        display: "standalone",
        icons: [
          {
            src: "family.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "family.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "family.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      }
    })
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    // Naikkan limit warning chunk
    chunkSizeWarningLimit: 2000, // KB

    rollupOptions: {
      output: {
        // Pisahkan dependencies besar ke chunk vendor
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
})

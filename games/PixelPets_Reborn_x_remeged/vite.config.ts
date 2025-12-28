import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export default defineConfig({
  plugins: [
    react(),
    // Only enable PWA plugin in production to avoid service worker interfering with HMR
    ...(isDevelopment
      ? []
      : [
          VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
              enabled: false, // Disable service worker in development to allow HMR WebSocket to work
            },
      includeAssets: ['logo.png', 'icons/*.png'],
      manifest: {
        name: 'Pixel Pets Reborn x Remeged',
        short_name: 'Remeged',
        description: 'AI-Generative Monster Battler - Complete Redesign',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      // Handle missing icons gracefully in development
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:11434\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'ollama-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
            },
          },
        ],
          },
        }),
      ]),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/application': path.resolve(__dirname, './src/application'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@workspace-content': path.resolve(__dirname, '../../src/content'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    open: true,
    // Let Vite auto-detect HMR settings for better Chrome compatibility
    hmr: isDevelopment
      ? {
          protocol: 'ws',
          host: 'localhost',
          // Don't specify port explicitly - let Vite auto-detect
        }
      : undefined,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'utils': ['zustand'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
















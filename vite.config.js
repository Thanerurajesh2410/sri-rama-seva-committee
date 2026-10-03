import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spawn } from 'child_process';

let serverProcess = null;

function expressServerPlugin() {
  return {
    name: 'express-server-plugin',
    configureServer(server) {
      if (!serverProcess) {
        console.log('🚀 Auto-starting Express Razorpay API Server on http://localhost:5000...');
        serverProcess = spawn('node', ['server/server.js'], {
          stdio: 'inherit',
          shell: true
        });
      }
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), expressServerPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});

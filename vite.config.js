import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx",
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    // Source files use JSX in .js files; the dependency scanner needs to know.
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  build: {
    // firebase.json (hosting) and capacitor.config.json (webDir) both serve from "build".
    outDir: 'build',
  },
  server: {
    port: 3000, // Optional: specify a port
    open: true    // Optional: automatically open browser
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      '@': path.resolve(__dirname, '.'),
      '@react-navigation/native': path.resolve(__dirname, 'web-shims/navigation-native.tsx'),
      '@react-navigation/stack': path.resolve(__dirname, 'web-shims/navigation-stack.tsx'),
      '@react-navigation/bottom-tabs': path.resolve(__dirname, 'web-shims/navigation-bottom-tabs.tsx'),
    },
  },
  optimizeDeps: {
    // Avoid esbuild parsing Flow syntax from react-native package.
    exclude: ['react-native'],
  },
  server: {
    port: 5173,
    open: true,
  },
});


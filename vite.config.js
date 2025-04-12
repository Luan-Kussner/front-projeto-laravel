import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import autoprefixer from 'autoprefixer';
import tailwindcss from '@tailwindcss/postcss7-compat';

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        autoprefixer,
        tailwindcss,  // Alterado para o novo pacote
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env': {}, // <-- Evita o erro
  },
});

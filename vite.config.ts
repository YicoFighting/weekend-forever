import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const { default: Unocss } = await import('unocss/vite');
  return {
    plugins: [uni(), Unocss()],
  };
});

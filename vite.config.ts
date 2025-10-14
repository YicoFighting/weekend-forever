import { defineConfig } from 'vite';
import Uni from '@uni-helper/plugin-uni';
import UnoCSS from 'unocss/vite';
export default defineConfig(async () => {
  return {
    plugins: [UnoCSS(), Uni()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});

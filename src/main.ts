import { createSSRApp } from 'vue';
import App from './App.vue';

import 'virtual:uno.css';
import pinia from '@/stores';

export function createApp() {
  const app = createSSRApp(App);

  app.use(pinia);

  return {
    app,
  };
}

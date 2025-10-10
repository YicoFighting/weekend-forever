import { createSSRApp } from 'vue';
import App from './App.vue';
import './uni.scss';
import 'virtual:uno.css';
import pinia from '@/stores';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 设置 dayjs 中文
dayjs.locale('zh-cn');

export function createApp() {
  const app = createSSRApp(App);

  app.use(pinia);

  return {
    app,
  };
}

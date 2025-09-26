// uno.config.ts
import { defineConfig, presetUno } from 'unocss';
import { presetIcons } from '@unocss/preset-icons';
import { presetUni } from '@uni-helper/unocss-preset-uni';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({ scale: 1, warn: true }),
    presetUni(), // 专为 UniApp 打造的预设
  ],
  // 可选：自定义规则
  rules: [
    ['bg-primary', { 'background-color': '#007AFF' }], // 自定义主背景色
  ],
  // 主题配置
  theme: {
    colors: {
      primary: '#007AFF',
      secondary: '#6C757D',
    },
  },
});

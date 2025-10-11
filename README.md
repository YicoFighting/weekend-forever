electron/react-native/flutter/taro

phone/wx 授权手机号登录

https://gitcode.com/dcloud/uni-app/blob/dev/dist/uni.webview.1.5.6.js

## web-view

- 在 Vue 项目的 `index.html` 进行引入

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>hybird</title>
  </head>
  <body>
    <!-- 一定要放在 body 下 -->
    <script src="https://gitcode.com/dcloud/uni-app/blob/dev/dist/uni.webview.1.5.6.js"></script>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- 在页面进行连接

```vue
<template>
  <div class="container">
    <p>是否是 plus 环境: {{ isPlus ? '是' : '否' }}</p>
    <p>Token 状态: {{ token ? '已获取' : '未获取' }}</p>
    <p v-if="token">Token: {{ token }}</p>
    <button v-else @click="getToken">获取 Token</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const token = ref(localStorage.getItem('token'));
const isPlus = ref(false);

const getToken = () => {
  window.__bridge.getToken();
};

onMounted(() => {
  document.addEventListener('UniAppJSBridgeReady', () => {
    uni.getEnv((res) => {
      isPlus.value = !!res.plus;
    });
  });
  window.__bridge = {
    getToken() {
      uni.postMessage({
        data: {
          action: 'getToken',
        },
      });
    },
    setToken(payload) {
      token.value = payload.token;
      localStorage.setItem('token', payload.token);
    },
  };
});
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  padding-top: 100px;
}
</style>
```

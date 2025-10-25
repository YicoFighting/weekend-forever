electron/react-native/flutter/taro

phone/wx 授权手机号登录

https://gitcode.com/dcloud/uni-app/blob/dev/dist/uni.webview.1.5.6.js

app 可以监听侧滑返回；小程序和 h5 没有办法

分享还得考虑实时修改的问题

引入 RAG 分析值班，以及其他

    <!-- 新增/编辑/删除

    字段
    标题
    类型：值班、其他
    日期：日历选择 => 日历选择器（可多选）
    时间：时间选择
    提醒：时间选择
    描述 与 备注一致
    人员
    附件：图片、视频、文档

    点击：查看详情
    新增：放在历史记录左边，打开时跳转新增页面，默认选中今天日期、值班、时间为 9:00 - 17:00
    同步：放在历史记录右边，点击时弹出同步弹框，点击确定后同步到日历
    编辑：放在事项列表每一个事项的右侧，点击时跳转编辑页面（编辑过默认就是换班）
    删除：放在事项列表每一个事项的右侧，点击要出现二次确认弹框，点击确定才能删除 弹框二次确认
    弹框: 这些弹框希望弄得稍微好看一些 -->

    <!-- 批量删除：在历史记录里长按触发 -->
    <!-- 编辑表单：编辑过就是换班 -->

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

## unocss 编译问题

- https://github.com/uni-helper/unocss-preset-uni
- https://github.com/unibest-tech/unibest/issues/199

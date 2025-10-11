<template>
  <view class="page">
    <view>AI</view>
    <web-view :src="h5Url" @message="handleMessage" @onPostMessage="handleMessage" />
    <!-- <xl-tabber /> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { H5Message, WebViewMessageEvent } from '@/types/hybrid';

const h5Url = ref('http://192.168.51.79:3000');
const token = ref('this is a token');

// 接受 webview 消息
const handleMessage = (event: any) => {
  const typed = event as WebViewMessageEvent<H5Message>;
  const messageData = typed.detail.data[0];
  if (messageData?.action === 'getToken') {
    sendTokenToH5();
  }
};

// 调用 webview 上的函数
const sendTokenToH5 = () => {
  // #ifdef APP-PLUS
  const currentPage = getCurrentPages()[getCurrentPages().length - 1] as unknown as {
    $getAppWebview(): {
      children(): Array<{ evalJS(script: string): void }>;
    };
  };
  const appWebview = currentPage.$getAppWebview();
  const wv = appWebview.children()[0];
  const data = { command: 'update', value: '数据来自App', token: token.value };
  wv.evalJS(`window.__bridge.setToken(${JSON.stringify(data)})`);
  // #endif
};
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: calc(env(safe-area-inset-bottom) + 88px);
}
</style>

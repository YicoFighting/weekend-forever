<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getWindowInfo();
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
    <slot />
  </view>
</template>

<style lang="scss" scoped></style>

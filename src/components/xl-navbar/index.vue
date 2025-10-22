<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getWindowInfo();
let navigationBarHeight = '64rpx';
// #ifdef MP-WEIXIN
const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
navigationBarHeight = (menuButtonInfo.top - safeAreaInsets.top) * 2 + menuButtonInfo.height + 'px';
// #endif

const props = withDefaults(
  defineProps<{
    title: string;
    showBack: boolean;
    safeAreaInsetBottom: boolean;
    navBarStyle: CSSProperties;
  }>(),
  {
    title: '',
    showBack: false,
    safeAreaInsetBottom: false,
    navBarStyle: () => ({}),
  },
);

const showCapsule = computed(() => {
  return props.title || props.showBack;
});

const onBack = () => {
  uni.navigateBack();
};
</script>

<template>
  <view
    class="navbar w-[100vw] h-[100vh] overflow-hidden"
    :style="{
      paddingTop: safeAreaInsets!.top + 'px',
      paddingBottom: props.safeAreaInsetBottom ? safeAreaInsets!.bottom + 'px' : '0',
    }"
  >
    <!-- 展示标题与返回 -->
    <view
      v-if="showCapsule"
      class="navbar-capsule w-full flex items-center text-[32rpx] p-[7px]"
      :style="{ height: navigationBarHeight, ...navBarStyle }"
    >
      <view class="back-btn w-[22px] h-full flex items-center" v-if="props.showBack">
        <wd-icon name="chevron-left" size="22px" @tap="onBack"></wd-icon>
      </view>
      <view class="title h-full flex justify-center items-center" v-if="props.title">
        {{ props.title }}
      </view>
      <view class="right-btn w-[22px] h-full" v-if="props.showBack"></view>
    </view>
    <!-- 内容区域 -->
    <view class="container">
      <slot></slot>
    </view>
  </view>
</template>

<style lang="scss">
.navbar {
  box-sizing: border-box;
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;

  .container {
    flex: 1 0 0;
    overflow: hidden;
  }

  .title {
    flex: 1 0 0;
  }
}
</style>

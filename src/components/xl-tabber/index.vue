<template>
  <view class="xl-tabber-bar">
    <!-- 三项：左右常规 + 中间凸起 -->
    <template v-if="visibleItems.length === 3">
      <view class="xl-tabber-item" @tap="onTabTap(visibleItems[0])">
        <text :class="['label', activeKey === visibleItems[0].key ? 'active' : '']">{{
          visibleItems[0].text
        }}</text>
      </view>

      <view class="xl-tabber-center" @tap="onTabTap(visibleItems[1])">
        <view class="center-btn" :class="{ active: activeKey === visibleItems[1].key }">
          <text class="center-text">{{ visibleItems[1].text }}</text>
        </view>
      </view>

      <view class="xl-tabber-item" @tap="onTabTap(visibleItems[2])">
        <text :class="['label', activeKey === visibleItems[2].key ? 'active' : '']">{{
          visibleItems[2].text
        }}</text>
      </view>
    </template>

    <!-- 两项：常规布局 -->
    <template v-else>
      <view
        v-for="item in visibleItems"
        :key="item.key"
        class="xl-tabber-item"
        @tap="onTabTap(item)"
      >
        <text :class="['label', activeKey === item.key ? 'active' : '']">{{ item.text }}</text>
      </view>
    </template>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores';

type TabItem = {
  key: 'home' | 'ai' | 'my';
  text: string;
  pagePath: string;
  requiresAI?: boolean;
};

const userStore = useUserStore();

const allItems = computed<TabItem[]>(() => [
  { key: 'home', text: '首页', pagePath: '/pages/home/index' },
  { key: 'ai', text: 'AI', pagePath: '/pages/ai/index', requiresAI: true },
  { key: 'my', text: '我的', pagePath: '/pages/my/index' },
]);

// 若无权限字段，默认允许显示 AI，方便开发/调试；可在登录后将 user.canUseAI 置为 false 隐藏。
const canUseAI = computed<boolean>(() => {
  const raw = (userStore as any)?.user?.canUseAI;
  return raw === undefined ? true : Boolean(raw);
});

const visibleItems = computed<TabItem[]>(() =>
  allItems.value.filter((i) => !i.requiresAI || canUseAI.value),
);

const currentPath = computed<string>(() => {
  const pages = getCurrentPages();
  const route = pages[pages.length - 1]?.route || '';
  return route.startsWith('/') ? route : `/${route}`;
});

const activeKey = computed<TabItem['key']>(() => {
  const match = visibleItems.value.find((i) => i.pagePath === currentPath.value);
  return (match?.key ?? visibleItems.value[0]?.key ?? 'home') as TabItem['key'];
});

function onTabTap(item: TabItem) {
  if (item.key === activeKey.value) return;
  // tabBar 页面间切换使用 switchTab，避免整页重载
  // uni.switchTab({ url: item.pagePath });
  uni.navigateTo({ url: item.pagePath });
}
</script>

<style lang="scss" scoped>
.xl-tabber-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 56px;
  padding-bottom: env(safe-area-inset-bottom);
  background: #ffffff;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;
}

.xl-tabber-item {
  flex: 1;
  text-align: center;
}

.label {
  font-size: 12px;
  color: #999;
}
.label.active {
  color: #000;
}

.xl-tabber-center {
  width: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center-btn {
  width: 58px;
  height: 58px;
  margin-top: -22px; // 凸起
  border-radius: 50%;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  justify-content: center;
  align-items: center;
}
.center-btn.active {
  border-color: #000;
}
.center-text {
  font-size: 12px;
  color: #000;
}
</style>

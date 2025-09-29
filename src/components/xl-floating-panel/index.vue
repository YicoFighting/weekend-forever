<template>
  <view class="panel">
    <view
      class="xl-floating-panel"
      :style="{ height: height + 'px' }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @touchcancel="handleTouchCancel"
    >
      <slot />
    </view>
    <view class="xl-floating-panel__header">
      <view class="xl-floating-panel__header-bar"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    height: number;
    anchors: number[];
  }>(),
  {
    height: 0,
    anchors: () => [],
  },
);

const emit = defineEmits<{
  (e: 'update:height', value: number): void;
  (e: 'heightChange', value: { height: number; index: number }): void;
}>();

// 锚点
const sortedAnchors = computed(() =>
  Array.from(new Set((props.anchors || []).slice().sort((a, b) => a - b))),
);
// 最近锚点索引
const currentHeightIndex = computed(() => {
  const anchors = sortedAnchors.value;
  if (!anchors.length) return -1;
  const h = props.height ?? 0;
  let nearestIdx = 0;
  let best = Math.abs(h - anchors[0]);
  for (let i = 1; i < anchors.length; i++) {
    const diff = Math.abs(h - anchors[i]);
    if (diff < best) {
      best = diff;
      nearestIdx = i;
    }
  }
  return nearestIdx;
});

let touchStartY = 0;
let lastMoveY = 0;
const handleTouchStart = (e: any) => {
  const t = e.touches?.[0] || e.changedTouches?.[0];
  touchStartY = t?.clientY ?? 0;
  lastMoveY = touchStartY;
};
const handleTouchMove = (e: any) => {
  const t = e.touches?.[0] || e.changedTouches?.[0];
  lastMoveY = t?.clientY ?? lastMoveY;
};
// 以相邻锚点 "中点" 为门槛，且只在纵向主导时响应
const snapByMidpoint = (deltaY: number) => {
  const anchors = sortedAnchors.value;
  const idx = currentHeightIndex.value;
  if (!anchors.length || idx < 0) return;
  if (deltaY > 0 && idx < anchors.length - 1) {
    const mid = (anchors[idx] + anchors[idx + 1]) / 2;
    const endHeight = anchors[idx] + deltaY;
    const index = endHeight >= mid ? idx + 1 : idx;
    const height = anchors[index];
    emit('update:height', height);
    emit('heightChange', { height, index });
  } else if (deltaY < 0 && idx > 0) {
    const mid = (anchors[idx - 1] + anchors[idx]) / 2;
    const endHeight = anchors[idx] + deltaY;
    const index = endHeight <= mid ? idx - 1 : idx;
    const height = anchors[index];
    emit('update:height', height);
    emit('heightChange', { height, index });
  }
};
const handleTouchEnd = (e: any) => {
  const t = e.changedTouches?.[0] || e.touches?.[0];
  const endY = t?.clientY ?? lastMoveY;
  const deltaY = endY - touchStartY;
  snapByMidpoint(deltaY);
};
const handleTouchCancel = (e: any) => {
  handleTouchEnd(e);
};
</script>

<style lang="scss" scoped>
.panel {
  background-color: #fff;
  border-radius: 0 0 5px 5px;
}
.xl-floating-panel {
  width: 100%;

  touch-action: none;
  will-change: height;
  transition: height 300ms cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.xl-floating-panel__header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  cursor: grab;
  user-select: none;
  &-bar {
    width: 20px;
    height: 3px;
    border-radius: 4px;
    background-color: #c8c9cc;
  }
}
</style>

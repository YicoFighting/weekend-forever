<template>
  <view class="panel">
    <!-- <xl-floating-panel
      v-model:height="height"
      :anchors="anchors"
      @heightChange="handleHeightChange"
    >
      <view class="inner-content">自定义锚点 {{ anchors }} - {{ height.toFixed(0) }}</view>
    </xl-floating-panel> -->
  </view>
</template>

<!-- <script lang="ts" setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const height = ref<number>(0);
const windowHeight = ref<number>(0);
const anchors = ref<number[]>([]);

const handleHeightChange = ({ height }: { height: number }) => {
  console.log(height);
};

onLoad(() => {
  windowHeight.value = uni.getWindowInfo().windowHeight;
  anchors.value = [100, Math.round(0.4 * windowHeight.value), Math.round(0.7 * windowHeight.value)];
  height.value = anchors.value[1];
});
</script>

<style lang="scss" scoped></style> -->

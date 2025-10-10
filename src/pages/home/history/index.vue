<template>
  <view class="history p-[10px]">
    <wd-steps vertical dot :active="10">
      <wd-step v-for="value in 5" :key="value">
        <template #title> 2025-09-29 {{ value }}:00:00 </template>
        <template #description>
          <!-- 先添加换班历史，然后再添加值班 -->
          <ul class="flex flex-col gap-2">
            <li
              class="flex flex-col border border-solid border-gray-300 rounded-md p-2 cursor-pointer"
              @tap="handleVisible"
            >
              <h4 class="text-base">标题</h4>
              <text class="text-sm">内容</text>
            </li>
          </ul>
        </template>
      </wd-step>
    </wd-steps>

    <xl-item-card v-model="visible"></xl-item-card>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const visible = ref(false);

const handleVisible = () => {
  visible.value = true;
};
</script>

<style lang="scss" scoped>
.history {
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.05);
}
.item-left,
.item-right {
  flex: 1 0 0;
  text-align: left;
  background-color: #fff;
  height: 200rpx;
  border-radius: 10rpx;
}
</style>

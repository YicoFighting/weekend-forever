<template>
  <view class="history p-[10px]">
    <wd-steps vertical dot :active="10">
      <wd-step v-for="value in 10" :key="value">
        <template #title> 2025-09-29 {{ value }}:00:00 </template>
        <template #description>
          <view class="w-full list flex flex-col gap-4">
            <view class="item flex justify-between items-center">
              <view class="item-left"> 值班 </view>
              <view class="item-split mx-[10px]">
                <wd-icon name="arrow-right1" size="22px"></wd-icon>
              </view>
              <view class="item-right"> 值班 </view>
            </view>
            <view class="item flex justify-between items-center ]">
              <view class="item-left"> 值班 </view>
              <view class="item-split mx-[10px]">
                <wd-icon name="arrow-right1" size="22px"></wd-icon>
              </view>
              <view class="item-right"> 值班 </view>
            </view>
          </view>
        </template>
      </wd-step>
    </wd-steps>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.history {
  height: 100%;
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

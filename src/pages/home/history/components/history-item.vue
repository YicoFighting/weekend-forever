<template>
  <view class="history-card">
    <view class="main">
      <view class="flex justify-between items-center mb-[8px]">
        <view
          class="badge"
          :style="{ backgroundColor: typeColor[type].bgColor, color: typeColor[type].color }"
        >
          {{ typeColor[type].label }}
        </view>
        <text class="time">{{ time }}</text>
      </view>
      <view class="title"> {{ title }}</view>
      <text class="desc"> {{ desc }}</text>
      <!-- <view class="participants">
        person 图标 style="color: rgb(102, 102, 102); font-size: 14px;"
        <text> 王护士、患者家属 </text>
      </view> -->
      <view class="attachments"></view>
    </view>
    <view class="indicator" :style="{ backgroundColor: typeColor[type].indicator }"></view>
  </view>
</template>

<script setup lang="ts">
import { typeColor } from '@/constants/colors';

const props = defineProps<{
  type: 'duty' | 'change' | 'other';
  time: string;
  title: string;
  desc: string;
  participants?: string[];
  attachments?: string[];
}>();
</script>

<style lang="scss" scoped>
.history-card {
  position: relative;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  .main {
    padding: 32rpx;
    cursor: pointer;
    .badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
    }
    .time {
      font-size: 12px;
      color: #666;
    }
    .title {
      color: #333;
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 6px;
    }
    .desc {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .participants {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 8px;
      font-size: 12px;
      color: #666;
    }
  }
  .indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 8rpx;
  }
}
</style>

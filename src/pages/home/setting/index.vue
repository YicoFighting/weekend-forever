<template>
  <xl-navbar title="配置中心" showBack>
    <view class="setting h-full bg-[#f5f5f5] relative">
      <wd-form ref="form" :model="model" class="form">
        <!-- 默认值班时间 -->
        <wd-card>
          <wd-cell title="时间段">
            <view @tap="showTimePicker = true">
              <text class="mr-[16rpx]">{{ model.startTime }} 至 {{ model.endTime }}</text>
              <wd-icon name="arrow-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
            </view>
          </wd-cell>
        </wd-card>

        <!-- 默认提醒时间 -->
        <wd-card>
          <wd-cell title="提醒">
            <view @tap="show = true">
              <text class="mr-[16rpx]">{{ remindText }}</text>
              <wd-icon name="arrow-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
            </view>
          </wd-cell>
        </wd-card>

        <!-- 同步数据范围：当天、本周、本月、全年、所有 -->
        <wd-card>
          <wd-cell title="同步范围">
            <wd-picker :columns="SYNC_SCOPE" v-model="model.syncScope" use-default-slot>
              <text class="mr-[16rpx]">{{ syncText }}</text>
              <wd-icon name="arrow-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
            </wd-picker>
          </wd-cell>
        </wd-card>

        <!-- 开启手机推送通知 -->
        <wd-card>
          <wd-cell title="推送">
            <wd-switch v-model="model.push" size="22px" disabled />
          </wd-cell>
        </wd-card>

        <!-- 开启公众号通知 -->
        <wd-card>
          <wd-cell title="公众号">
            <wd-switch v-model="model.wechat" size="22px" disabled />
          </wd-cell>
        </wd-card>
      </wd-form>

      <view class="footer w-full flex items-center">
        <wd-button class="w-full" type="primary" @tap="handleSubmit"> 提交 </wd-button>
      </view>
    </view>

    <!-- 时间段 -->
    <time-item
      v-model="showTimePicker"
      :start-time="model.startTime"
      :end-time="model.endTime"
      @confirm="handleTimeConfirm"
    />

    <!-- 提醒 -->
    <remind-item v-model="show" :remind="model.remind" @confirm="handleConfirm" />
  </xl-navbar>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import RemindItem from '../components/remind-item.vue';
import TimeItem from '../components/time-item.vue';
import { NO_REMIND_VALUE, REMIND_OPTIONS } from '@/constants/reminds';
import { SYNC_SCOPE, SYNC_SCOPE_MONTHLY_VALUE } from '@/constants/sync-scope';

const model = ref({
  startTime: '09:00',
  endTime: '18:00',
  remind: NO_REMIND_VALUE,
  syncScope: SYNC_SCOPE_MONTHLY_VALUE,
  push: false,
  wechat: false,
});

// 时间段
const showTimePicker = ref(false);
const handleTimeConfirm = (val: { startTime: string; endTime: string }) => {
  model.value.startTime = val.startTime;
  model.value.endTime = val.endTime;
};

// 提醒
const show = ref(false);
const remindText = computed(() => {
  const remind = REMIND_OPTIONS.find((item) => item.value === model.value.remind);
  return remind?.label || model.value.remind + '分钟前';
});
const handleConfirm = ({ value }: { value: number }) => {
  model.value.remind = Number(value);
};

// 同步范围
const syncText = computed(() => {
  const sync = SYNC_SCOPE.find((item) => item.value === model.value.syncScope);
  return sync?.label || model.value.syncScope;
});

const handleSubmit = () => {};
</script>

<style lang="scss" scoped>
.setting {
  box-sizing: border-box;
  padding: 24rpx 0 0 0;

  display: flex;
  flex-direction: column;

  :deep(.wd-card) {
    margin: 0 0 16rpx 0;
    border-radius: 12rpx;

    .wd-cell {
      padding: 0;
      .wd-cell__wrapper {
        height: 92rpx;
        padding: 0;
        display: flex;
        align-items: center;
      }

      .wd-cell__value {
        text-align: right;
        margin-right: 16rpx;
        color: #666;
      }
    }

    .wd-cell.is-hover {
      background: unset;
    }

    .wd-picker-view-column__item {
      color: #666;
    }
  }

  .form {
    flex: 1 0 0;
    overflow-y: auto;
    padding: 0 32rpx;
  }

  .footer {
    box-sizing: border-box;
    flex-shrink: 0;
    padding: 32rpx;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    .wd-button.is-primary {
      height: 96rpx;
      border-radius: 12rpx;
    }
  }

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

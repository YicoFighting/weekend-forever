<template>
  <xl-navbar title="创建日程" showBack>
    <view class="add h-full bg-[#f5f5f5] relative">
      <wd-form ref="form" :model="model" class="form">
        <!-- 标题 -->
        <wd-card>
          <wd-input
            class="h-[92rpx] title"
            prop="title"
            v-model="model.title"
            placeholder="请输入日程标题"
          />
        </wd-card>

        <!-- 类型 -->
        <wd-card>
          <wd-cell title="类型">
            <view class="type flex w-full justify-end gap-[10rpx]">
              <view
                class="type-duty"
                :class="{ active: model.type === 'duty' }"
                @tap="model.type = 'duty'"
              >
                值班
              </view>
              <view
                class="type-other"
                :class="{ active: model.type === 'other' }"
                @tap="model.type = 'other'"
              >
                其他
              </view>
            </view>
          </wd-cell>
        </wd-card>

        <!-- 日期 -->
        <wd-card>
          <wd-cell title="日期">
            <wd-calendar type="dates" v-model="model.dates" />
          </wd-cell>
        </wd-card>

        <!-- 时间段 -->
        <wd-card>
          <wd-cell title="时间段">
            <view @tap="showTimePicker = true">
              <text class="mr-[16rpx]">{{ model.startTime }} 至 {{ model.endTime }}</text>
              <wd-icon name="arrow-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
            </view>
          </wd-cell>
        </wd-card>

        <!-- 提醒 -->
        <wd-card>
          <wd-cell title="提醒">
            <view @tap="show = true">
              <text class="mr-[16rpx]">{{ remindText }}</text>
              <wd-icon name="arrow-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
            </view>
          </wd-cell>
        </wd-card>

        <!-- 备注 -->
        <wd-card>
          <wd-textarea prop="remark" v-model="model.remark" placeholder="请输入备注" />
        </wd-card>

        <!-- 附件 -->
        <wd-card>
          <view class="pt-[6rpx] mb-[6rpx]">附件</view>
          <wd-upload
            accept="all"
            :limit="3"
            :auto-upload="false"
            multiple
            :file-list="fileList"
          ></wd-upload>
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
import dayjs from 'dayjs';
import { computed, reactive, ref } from 'vue';
import { onLoad, onBackPress } from '@dcloudio/uni-app';
import type { FormInstance } from 'wot-design-uni/components/wd-form/types';
import type { itemFormType, itemType } from '@/types/item';
import { useGoBack } from '@/composables/useGoBack';
import { NO_REMIND, NO_REMIND_VALUE, REMIND_OPTIONS } from '@/constants/reminds';
import RemindItem from '../components/remind-item.vue';
import TimeItem from '../components/time-item.vue';

const form = ref<FormInstance>();
const fileList = ref<any[]>([]);
const model = reactive<itemFormType>({
  type: 'duty',
  title: '',
  allDay: false,
  dates: [dayjs().startOf('day').valueOf()],
  startTime: '09:00',
  endTime: '18:00',
  remind: NO_REMIND_VALUE,
  remark: '',
});

// 时间段
const showTimePicker = ref(false);
const handleTimeConfirm = (val: { startTime: string; endTime: string }) => {
  model.startTime = val.startTime;
  model.endTime = val.endTime;
};

// 提醒
const show = ref(false);
const remindText = computed(() => {
  const remind = REMIND_OPTIONS.find((item) => item.value === model.remind);
  return remind?.label || model.remind + '分钟前';
});
const handleConfirm = ({ value }: { value: number }) => {
  model.remind = Number(value);
};

const handleSubmit = () => {
  console.log(model, 'model');
  useGoBack();
};

onLoad((options: any) => {
  model.title = options?.title || '';
  model.remark = options?.remark || '';
});

// Android 返回键 & 手势返回优先关闭弹框
onBackPress(() => {
  if (show.value) {
    show.value = false;
    return true; // 阻止默认返回上一页
  }
  return false; // 交给系统处理（返回上一页）
});
</script>

<style lang="scss" scoped>
.add {
  box-sizing: border-box;
  padding: 24rpx 0 0 0;

  display: flex;
  flex-direction: column;

  :deep(.wd-card) {
    margin: 0 0 16rpx 0;
    border-radius: 12rpx;

    .title {
      .wd-input__inner {
        height: 92rpx;
      }
    }

    .type-duty,
    .type-other {
      color: #666;
      font-size: 24rpx;
      padding: 0 20rpx;
      border-radius: 16rpx;
      border: 2rpx solid #e8e8e8;
      background-color: #fff;
      transition: all 0.3s ease;
    }

    .active {
      color: #fff;
    }

    .type-duty.active {
      background-color: #4caf50;
    }
    .type-other.active {
      background-color: #2196f3;
    }

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

    .wd-textarea {
      padding: 6rpx 0;
    }

    .wd-upload__evoke {
      border: 2rpx dashed #e0e0e0;
      border-radius: 8px;
    }

    .wd-upload__mask {
      display: none;
    }
    .wd-upload__status-content {
      border: 2rpx dashed #e0e0e0;
      border-radius: 16rpx;
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

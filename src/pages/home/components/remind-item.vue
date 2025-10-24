<template>
  <wd-action-sheet v-model="show!" @opened="handleOpen" @closed="handleClose">
    <!-- 头部标题 -->
    <view class="header h-[90rpx] flex justify-between items-center px-[14px]">
      <text class="color-[#666] text-[16px]" @tap="handleCancel">取消</text>
      <text class="color-[#333] text-[16px]">选择提醒</text>
      <text class="color-[#007aff] text-[16px]" @tap="handleConfirm">确定</text>
    </view>
    <!-- 内容 -->
    <scroll-view
      id="remind-content"
      :scroll-top="scrollTop"
      :scroll-with-animation="scrollWithAnimation"
      @scroll="handleScroll"
      scroll-y
      class="remind-content px-[32rpx] h-[600rpx] overflow-hidden"
    >
      <view
        class="remind-item py-[32rpx]"
        :class="model.remind === item.value ? 'bg-[#f8f9ff]' : ''"
        v-for="item in REMIND_OPTIONS"
        :key="item.value"
        @tap="handleSelect(item.value)"
      >
        <text>{{ item.label }}</text>
        <wd-icon
          v-if="model.remind === item.value"
          name="check1"
          size="18px"
          color="#4a90e2"
        ></wd-icon>
      </view>
      <view v-if="model.remind === CUSTOM_REMIND_VALUE" class="remind-item py-[32rpx]">
        <wd-input v-model="model.value" placeholder="输入数字" type="number" inputmode="numeric" />
        <view class="suffix">分钟前</view>
      </view>
    </scroll-view>
  </wd-action-sheet>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick, ref } from 'vue';
import { CUSTOM_REMIND_VALUE, NO_REMIND_VALUE, REMIND_OPTIONS } from '@/constants/reminds';

const props = defineProps<{
  remind: number;
}>();
const show = defineModel<boolean>('modelValue');
const emit = defineEmits<{
  (e: 'confirm', model: { value: number }): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

// 自定义是抛 value；非自定义是抛 remind
const model = ref({
  remind: NO_REMIND_VALUE,
  value: 0,
});

// 定义 scrollTop 响应式变量
const scrollTop = ref(0);
const instance = getCurrentInstance();
const scrollWithAnimation = ref(false);
const handleScroll = (e: any) => {
  scrollTop.value = e.detail.scrollTop;
};

const scrollToBottom = async () => {
  await nextTick();
  const query = uni.createSelectorQuery().in(instance!.proxy);
  query
    .select('#remind-content')
    .boundingClientRect((data: any) => {
      scrollWithAnimation.value = true;
      scrollTop.value = data.top;
    })
    .exec();
};

const handleSelect = (value: number) => {
  model.value.remind = value;
  if (value === CUSTOM_REMIND_VALUE) {
    scrollToBottom();
  }
};

const handleOpen = () => {
  const remind = REMIND_OPTIONS.find((item) => item.value === props.remind);
  // 非自定义
  if (remind) {
    model.value.remind = remind.value;
  } else {
    model.value.remind = CUSTOM_REMIND_VALUE;
    model.value.value = props.remind;
  }
  scrollWithAnimation.value = false;
  scrollTop.value = 0;
};

const handleClose = () => {
  model.value = {
    remind: NO_REMIND_VALUE,
    value: 0,
  };
};

const handleCancel = () => {
  show.value = false;
};

const handleConfirm = () => {
  const value = model.value.remind === CUSTOM_REMIND_VALUE ? model.value.value : model.value.remind;
  emit('confirm', { value });
  handleCancel();
};
</script>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid #f0f0f0;
}

.remind-content {
  box-sizing: border-box;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  .remind-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #333;
    font-size: 16px;
    border-bottom: 1px solid #f0f0f0;
    :deep(.wd-input) {
      width: 100%;
      height: 80rpx;
      border: 1px solid #f0f0f0;
      &::after {
        display: none;
      }
      input {
        height: 80rpx;
        line-height: 80rpx;
        padding: 0 16rpx;
      }
    }
    .suffix {
      color: #333;
      font-size: 32rpx;
      margin-left: 10rpx;
      flex-shrink: 0;
    }
  }
}
</style>

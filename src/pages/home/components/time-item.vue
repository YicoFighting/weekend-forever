<template>
  <wd-action-sheet v-model="show!" @opened="handleOpen" @closed="handleClose">
    <!-- 头部标题 -->
    <view class="header h-[90rpx] flex justify-between items-center px-[14px]">
      <text class="color-[#666] text-[16px]" @tap="handleCancel">取消</text>
      <text class="color-[#333] text-[16px]">选择时间</text>
      <text class="color-[#007aff] text-[16px]" @tap="handleConfirm">确定</text>
    </view>
    <!-- 内容 -->
    <view class="remind-content p-[32rpx]">
      <text class="text-[16px] color-[#333]">开始时间</text>
      <wd-datetime-picker-view
        key="startTime"
        type="time"
        v-model="model.startTime"
        label="时分"
        :columns-height="105"
      />
      <text class="text-[16px] color-[#333]">结束时间</text>
      <wd-datetime-picker-view
        key="endTime"
        type="time"
        v-model="model.endTime"
        label="时分"
        :columns-height="105"
      />
    </view>
  </wd-action-sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  startTime: string;
  endTime: string;
}>();
const show = defineModel<boolean>('modelValue');
const emit = defineEmits<{
  (e: 'confirm', model: { startTime: string; endTime: string }): void;
  (e: 'update:modelValue', value: boolean): void;
}>();

const model = ref({
  startTime: '09:00',
  endTime: '17:00',
});

const handleOpen = () => {
  model.value = {
    startTime: props.startTime || '09:00',
    endTime: props.endTime || '17:00',
  };
};

const handleClose = () => {
  model.value = {
    startTime: '09:00',
    endTime: '17:00',
  };
};

const handleCancel = () => {
  show.value = false;
};

const handleConfirm = () => {
  emit('confirm', model.value);
  handleCancel();
};
</script>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid #f0f0f0;
}
</style>

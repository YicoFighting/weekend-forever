<template>
  <wd-message-box>
    <view class="icon">
      <img src="@/static/error.png" alt="sync" />
    </view>
    <view class="delete" @tap="handleCancel">
      <img src="@/static/delete.png" alt="sync" />
    </view>
    <view class="content"> 点击确认后，将同步信息至日历中 </view>
    <view class="footer">
      <wd-button class="cancel-btn" type="primary" @tap="handleCancel">取消</wd-button>
      <wd-button class="confirm-btn" type="primary" @tap="handleConfirm">确定</wd-button>
    </view>
  </wd-message-box>
</template>

<script setup lang="ts">
import { useMessage } from 'wot-design-uni';
const message = useMessage();

const emit = defineEmits<{
  (e: 'confirm'): void;
}>();

const beforeConfirm = () => {
  message.confirm({
    lazyRender: true,
  });
};

function handleCancel() {
  message.close();
}

function handleConfirm() {
  message.close();
  emit('confirm');
}

defineExpose({
  beforeConfirm,
});
</script>

<style lang="scss" scoped>
.icon {
  position: absolute;
  top: -65rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 121rpx;
  height: 121rpx;
  background: #0c6aed;
  border: 6rpx solid #ffffff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 60rpx;
    height: 60rpx;
  }
}
.delete {
  position: absolute;
  top: 36rpx;
  right: 36rpx;
  width: 28rpx;
  height: 28rpx;
  img {
    width: 100%;
    height: 100%;
  }
}
.content {
  flex: 1 0 0;

  font-size: 16px;
  color: #333;
  padding: 60rpx 32rpx 0 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.footer {
  display: flex;
  justify-content: center;
  gap: 24rpx;
  .cancel-btn {
    width: 240rpx;
    height: 80rpx;
    background: #ededed;
    border-radius: 40rpx;

    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 34rpx;
    color: #575757;
    text-align: center;
  }
  .confirm-btn {
    width: 240rpx;
    height: 80rpx;
    background: linear-gradient(180deg, #4586fe 0%, #4586fe 0%, #3d71ff 100%);
    border-radius: 40rpx;
    font-family: Poppins, Poppins;
    font-weight: 400;
    font-size: 34rpx;
    color: #ffffff;
    text-align: center;
  }
}
:deep(.wd-message-box) {
  overflow: visible !important;
  .wd-message-box__container {
    width: 600rpx;
    height: 460rpx;
    border-radius: 32rpx;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #daf2ff 0%, #ffffff 30%, #ffffff 100%);
    .wd-message-box__body {
      height: 100%;
      position: relative;
      overflow: visible;
      padding: 0;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      background: transparent;
      .wd-message-box__content {
        box-sizing: border-box;
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-bottom: 72rpx;
      }
    }
    .wd-message-box__actions {
      display: none;
    }
  }
}
</style>

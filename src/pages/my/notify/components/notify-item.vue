<template>
  <wd-card class="notify-item">
    <view class="flex flex-col relative">
      <view
        v-if="props.unread"
        class="dot absolute top-0 right-0 w-[8px] h-[8px] bg-[#ff3b30] rounded-full"
      ></view>
      <view class="info flex items-center">
        <div class="avatar">
          <wd-img round :src="props.avatar" enable-preview />
        </div>
        <div class="desc">
          <div class="name">{{ props.name }}</div>
          <div class="ago">{{ props.ago }}</div>
        </div>
      </view>

      <slot name="content">
        <div v-if="content" class="content">
          {{ content }}
        </div>
      </slot>

      <slot name="text">
        <div v-if="text" class="text">
          {{ text }}
        </div>
      </slot>

      <div class="operation">
        <slot name="operation">
          <view class="default-btn gap-[8px]">
            <wd-button v-if="props.agree" size="small" class="agree">同意</wd-button>
            <wd-button v-if="props.reject" size="small" class="reject">拒绝</wd-button>
            <wd-button
              v-if="props.blacklist"
              type="icon"
              icon="close-normal"
              class="blacklist"
            ></wd-button>
          </view>
        </slot>
      </div>
    </view>
  </wd-card>
</template>

<script setup lang="ts">
interface Props {
  avatar: string;
  name: string;
  ago: string;
  content?: string;
  text?: string;
  agree?: boolean;
  reject?: boolean;
  blacklist?: boolean;
  unread: boolean;
}
const props = withDefaults(defineProps<Partial<Props>>(), {
  avatar: '',
  name: '',
  ago: '',
  content: '',
  text: '',
  agree: false,
  reject: false,
  blacklist: false,
  unread: true,
});
</script>

<style lang="scss" scoped>
.notify-item {
  padding: 32rpx;
  margin-bottom: 24rpx;
}
.info {
  margin-bottom: 24rpx;
  .avatar {
    width: 80rpx;
    height: 80rpx;
    :deep(.wd-img) {
      width: 100%;
      height: 100%;
    }
  }
  .desc {
    margin-left: 24rpx;
    .name {
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
    }
    .ago {
      font-size: 24rpx;
      color: #999;
    }
  }
}
.content {
  font-size: 30rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 16rpx;
}
.text {
  padding: 24rpx;
  background-color: #f8f9fa;
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 32rpx;
}
.default-btn {
  display: flex;
  align-items: center;
}
.agree {
  height: 64rpx !important;
  background-color: #34c759 !important;
}
.reject {
  height: 64rpx !important;
  background-color: #ff3b30 !important;
}
.blacklist {
  background-color: #f8f8f8 !important;
  border: 2rpx solid #e0e0e0 !important;
  width: 64rpx !important;
  height: 64rpx !important;
}
</style>

<template>
  <wd-popup v-model="visible" safe-area-inset-bottom root-portal>
    <view class="item-card">
      <view class="close">
        <wd-icon name="close-normal" size="22px"></wd-icon>
      </view>
      <view class="card">
        <view class="header bg-[#4d80f0] text-[#fff]">
          <view class="title">
            <text>
              打开客服会话，如果用户在会话中点击消息卡片后返回应用，可以从 @contact
              回调中获得具体信息
            </text>
          </view>
          <view class="time">
            <text>时间</text>
          </view>
        </view>
        <view class="container">
          <h4 class="font-normal text-[12px] py-[10px]">备注</h4>
          <view class="remark text-[12px]">
            打开客服会话，如果用户在会话中点击消息卡片后返回应用，可以从 @contact 回调中获得具体信息
          </view>
        </view>
        <view class="footer">
          <wd-cell-group>
            <wd-cell title="提醒">
              <view @tap="show = true">
                <text>{{ remindText }}</text>
                <wd-icon name="chevron-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
              </view>
            </wd-cell>
          </wd-cell-group>
        </view>
      </view>
      <view class="btns">
        <view class="btn" @tap="handleEdit"><wd-icon name="edit-1" size="22px"></wd-icon></view>
        <view class="btn"><wd-icon name="delete-thin" size="22px"></wd-icon></view>
      </view>
    </view>

    <xl-add-item v-model="show" @close="handleClose" />
  </wd-popup>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ItemType } from '@/types/item';

const visible = defineModel<boolean>('modelValue');

// 提醒
const show = ref(false);
const remindText = ref('开始时');
const handleClose = (model: ItemType) => {
  console.log(model, 'model');
  if (model.checked) {
    remindText.value = model.reminds
      .map((item) => (item == 0 ? '开始时' : `${item}分钟前`))
      .join('、');
  } else {
    remindText.value = '关闭';
  }
};

const handleEdit = () => {
  visible.value = false;
  uni.navigateTo({
    url: `/pages/home/edit/index?id=${1}`,
  });
};
</script>

<style lang="scss" scoped>
.item-card {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0 10vw;

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  .close {
    height: 200rpx;
  }

  .card {
    box-sizing: border-box;
    width: 80vw;
    height: 70vh;
    border-radius: 20rpx;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.8) 10rpx 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .header {
      padding: 30rpx;
      flex: 2;
    }
    .container {
      padding: 30rpx;
      flex: 3;
    }
    .footer {
      padding: 30rpx;
      flex: 1;
    }
  }

  .btns {
    display: flex;
    justify-content: center;
    gap: 15vw;
    .btn {
      width: 90rpx;
      height: 90rpx;
      background-color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

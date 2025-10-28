<template>
  <xl-navbar title="分享" show-back>
    <view class="share w-full h-full overflow-hidden flex flex-col">
      <wd-form ref="form" :model="model" class="form">
        <!-- 表单 -->
        <wd-card class="card">
          <ul>
            <li class="item">
              <view class="label">分享数据范围</view>
              <view class="value">
                <wd-radio-group v-model="model.rangs" shape="dot" inline>
                  <wd-radio value="day">当天</wd-radio>
                  <wd-radio value="month">当月</wd-radio>
                </wd-radio-group>
              </view>
            </li>
            <li class="item">
              <view class="label">分享数据类型</view>
              <view class="value">
                <wd-checkbox-group v-model="model.types" shape="square">
                  <wd-checkbox modelValue="duty">值班安排</wd-checkbox>
                  <wd-checkbox modelValue="other">事项记录</wd-checkbox>
                </wd-checkbox-group>
              </view>
            </li>
            <li>
              <view class="label">查找目标人员</view>
              <view class="value search">
                <wd-search
                  v-model="model.keyword"
                  hide-cancel
                  placeholder-left
                  placeholder="请输入目标人员账号"
                >
                  <template #prefix>
                    <wd-icon class="pl-[16px]" name="search1" size="18px" color="#999999"></wd-icon>
                  </template>
                </wd-search>
              </view>
            </li>
          </ul>
        </wd-card>
      </wd-form>

      <!-- 列表 -->
      <wd-card class="content-card">
        <view class="title">全部人员（10人）</view>
        <view class="list">
          <view class="item" v-for="value in 10" :key="value">
            <view class="avatar">
              <wd-img round :src="mockImageSrc" enable-preview mode="aspectFill" />
            </view>
            <view class="text">
              <view class="name">张医生</view>
              <view class="desc">内科 · 主治医师</view>
            </view>
            <view class="share-btn" @tap="handleShare">
              <wd-button size="small">分享</wd-button>
            </view>
          </view>
        </view>
      </wd-card>
    </view>

    <wd-message-box />
  </xl-navbar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'wot-design-uni';

const message = useMessage();

const mockImageSrc =
  'https://readdy.ai/api/search-image?query=Professional%20doctor%20portrait%2C%20medical%20professional%20headshot%2C%20clean%20white%20background%2C%20realistic%20photography%20style%2C%20friendly%20expression%2C%20medical%20uniform%2C%20high%20quality%20portrait&width=80&height=80&seq=doc001&orientation=squarish';

const model = ref({
  rangs: 'day',
  types: ['duty', 'other'],
  keyword: '',
});

const handleShare = () => {
  message
    .confirm({
      msg: '确认将当天的值班安排分享给张医生吗？',
      title: '确认分享',
    })
    .then(() => {
      console.log('点击了确定按钮');
    })
    .catch(() => {
      console.log('点击了取消按钮');
    });
};
</script>

<style lang="scss" scoped>
.share {
  background: #f5f5f5;
  ul,
  li {
    list-style: none;
    padding: 0;
  }
  .item {
    margin-bottom: 48rpx;
  }
  .card {
    margin: 24rpx 32rpx;
    padding: 32rpx;
    .label {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 24rpx;
    }
    .value {
      font-size: 15px;
      color: #333;
    }
  }
  .search {
    // padding-bottom: 8px;
    :deep(.wd-search) {
      padding: 0;
      .wd-search__block {
        border-radius: 12rpx;
        height: 70rpx;
      }
      .wd-search__field {
        .wd-icon-search {
          display: none;
        }
        .wd-search__input {
          padding: 0;
        }
      }
    }
  }
  .content-card {
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 16rpx;
    overflow: hidden;
    :deep(.wd-card__content) {
      height: 100%;
      display: flex;
      flex-direction: column;
      background-color: #fff;
    }
    .title {
      box-sizing: border-box;
      padding: 32rpx 32rpx 24rpx 32rpx;
      border-bottom: 2rpx solid #e9ecef;
      background-color: #f8f9fa;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    .list {
      flex: 1 0 0;
      overflow-y: auto;
      .item {
        display: flex;
        align-items: center;
        padding: 32rpx;
        border-bottom: 2rpx solid #e9ecef;
        margin-bottom: 0;
        .avatar {
          width: 92rpx;
          height: 92rpx;
          :deep(.wd-img) {
            width: 100%;
            height: 100%;
          }
        }
        .text {
          flex: 1 0 0;
          display: flex;
          flex-direction: column;
          margin-left: 32rpx;
          .name {
            font-size: 34rpx;
            font-weight: 600;
            color: #1a1a1a;
          }
          .desc {
            font-size: 14px;
            color: #6b7280;
          }
        }
        .share-btn {
          :deep(.wd-button) {
            color: #333;
            background-color: #fff;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 0.0625rem 0.25rem rgba(0, 122, 255, 0.2);
          }
        }
      }
    }
  }
}
</style>

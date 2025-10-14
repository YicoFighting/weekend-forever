<template>
  <view class="agreement-page">
    <xl-navbar title="服务协议" />
    <scroll-view scroll-y class="content">
      <view class="section">
        <view class="h1">服务协议</view>
        <view class="p">
          感谢使用本应用。为保障您的合法权益，请在使用前仔细阅读并同意本《服务协议》。
        </view>
        <view class="p"> 1. 本服务为您提供账号登录、数据记录与同步等功能； </view>
        <view class="p">2. 您应遵守适用的法律法规，不得利用本服务从事违法违规行为；</view>
        <view class="p">3. 我们可能会根据运营需要对服务进行更新或调整；</view>
        <view class="p">4. 更多具体条款可根据实际业务进行补充与修改。</view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts"></script>

<style scoped>
.agreement-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.content {
  flex: 1;
  padding: 24rpx 32rpx 48rpx;
}
.section {
  color: #333;
  font-size: 28rpx;
  line-height: 1.8;
}
.h1 {
  font-size: 36rpx;
  font-weight: 600;
  margin: 16rpx 0 24rpx;
}
.p {
  margin-bottom: 16rpx;
}
</style>

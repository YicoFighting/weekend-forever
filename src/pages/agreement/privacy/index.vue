<template>
  <view class="agreement-page">
    <xl-navbar title="隐私政策" />
    <scroll-view scroll-y class="content">
      <view class="section">
        <view class="h1">隐私政策</view>
        <view class="p">
          我们非常重视您的隐私与个人信息保护。请在使用前仔细阅读本《隐私政策》以了解我们如何收集、使用、存储与保护您的信息。
        </view>
        <view class="p">1. 我们仅收集提供服务所必要的信息；</view>
        <view class="p">2. 信息将用于账号认证、服务提供与安全保障；</view>
        <view class="p">3. 未经您同意，不会向无关第三方提供您的个人信息；</view>
        <view class="p">4. 您可依据法律规定行使查询、更正、删除等权利。</view>
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

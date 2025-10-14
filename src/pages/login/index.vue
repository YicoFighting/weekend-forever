<template>
  <view class="login-page">
    <!-- 小程序端：头像昵称授权 + 登录 -->
    <!-- #ifdef MP-WEIXIN -->
    <view class="mini-container">
      <image class="logo" src="/static/logo.png" mode="aspectFit" />
      <view class="title">授权登录</view>
      <button class="btn primary" @click="onMiniLogin">授权登录</button>
      <button class="btn" open-type="getPhoneNumber" @getphonenumber="onMiniPhoneLogin">
        手机号授权登录
      </button>
      <button class="btn" @click="onCancel">取消</button>
    </view>
    <!-- #endif -->

    <!-- APP 端：一键登录（univerify）风格 -->
    <!-- #ifdef APP-PLUS -->
    <view class="app-container">
      <view class="welcome">欢迎登录不想值班</view>
      <image class="banner" src="/static/logo.png" mode="aspectFit" />
      <button class="btn app" @click="onAppOneKeyLogin">用户一键登录</button>
      <view class="agreements">
        <label class="checkbox">
          <checkbox :checked="agreed" @click.native.stop="toggleAgree" />
          <text>已阅读并同意</text>
          <text class="link" @click.stop="goService">《服务协议》</text>
          <text class="link" @click.stop="goPrivacy">《隐私政策》</text>
        </label>
      </view>
    </view>
    <!-- #endif -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores';
import { miniLogin, appUniverifyLogin, miniPhoneLogin } from '@/services/login';

const userStore = useUserStore();
const agreed = ref(false);

const toggleAgree = () => {
  agreed.value = !agreed.value;
};

const goService = () => {
  uni.navigateTo({ url: '/pages/agreement/service/index' });
};

const goPrivacy = () => {
  uni.navigateTo({ url: '/pages/agreement/privacy/index' });
};

// 小程序登录：获取临时 code -> 传给后端换 token
const onMiniLogin = async () => {
  try {
    const loginRes = await uni.login({ provider: 'weixin' });
    const code = loginRes.code as string;
    // 可选拉取昵称头像
    let nickName: string | undefined;
    let avatarUrl: string | undefined;
    try {
      const userProfile: any = await uni.getUserProfile({ desc: '用于完善会员资料' });
      nickName = userProfile.userInfo?.nickName;
      avatarUrl = userProfile.userInfo?.avatarUrl;
    } catch (e) {
      // 用户拒绝授权昵称头像不阻塞登录
    }
    const { data } = await miniLogin({ code, nickName, avatarUrl });
    userStore.setUser({ ...data.user, token: data.token });
    uni.showToast({ title: '登录成功' });
    uni.switchTab({ url: '/pages/home/index' });
  } catch (err) {
    uni.showToast({ icon: 'none', title: '登录失败，请重试' });
  }
};

// APP 端一键登录，需先勾选协议
const onAppOneKeyLogin = async () => {
  // #ifndef APP-PLUS
  return;
  // #endif
  if (!agreed.value) {
    uni.showToast({ icon: 'none', title: '请先阅读并同意协议' });
    return;
  }
  try {
    // 打开一键登录授权页
    await uni.preLogin({ provider: 'univerify' });
    const res: any = await new Promise((resolve, reject) => {
      // 调用 plus API
      // @ts-ignore
      uni.login({
        provider: 'univerify',
        univerifyStyle: {
          fullScreen: true,
          // 自定义授权页样式
        },
        success: resolve,
        fail: reject,
      });
    });
    const { openid, access_token } = res.authResult || {};
    const { data } = await appUniverifyLogin({ openid, access_token });
    userStore.setUser({ ...data.user, token: data.token });
    uni.closeAuthView && uni.closeAuthView();
    uni.showToast({ title: '登录成功' });
    uni.switchTab({ url: '/pages/home/index' });
  } catch (e) {
    uni.closeAuthView && uni.closeAuthView();
    uni.showToast({ icon: 'none', title: '一键登录失败' });
  }
};

const onCancel = () => {
  uni.navigateBack();
};

// 小程序：手机号授权登录
const onMiniPhoneLogin = async (e: any) => {
  try {
    const loginRes = await uni.login({ provider: 'weixin' });
    const code = loginRes.code as string;
    const detail = e?.detail || {};
    const phoneCode: string | undefined = detail.code;
    const encryptedData: string | undefined = detail.encryptedData;
    const iv: string | undefined = detail.iv;

    let nickName: string | undefined;
    let avatarUrl: string | undefined;
    try {
      const userProfile: any = await uni.getUserProfile({ desc: '用于完善会员资料' });
      nickName = userProfile.userInfo?.nickName;
      avatarUrl = userProfile.userInfo?.avatarUrl;
    } catch (e) {}

    const { data } = await miniPhoneLogin({
      code,
      phoneCode,
      encryptedData,
      iv,
      nickName,
      avatarUrl,
    });
    userStore.setUser({ ...data.user, token: data.token });
    uni.showToast({ title: '登录成功' });
    uni.switchTab({ url: '/pages/home/index' });
  } catch (err) {
    uni.showToast({ icon: 'none', title: '授权失败，请重试' });
  }
};
</script>
<style scoped>
.login-page {
  padding: 40rpx;
}
.mini-container,
.app-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo {
  width: 160rpx;
  height: 160rpx;
  margin: 80rpx 0;
}
.banner {
  width: 480rpx;
  height: 240rpx;
  margin: 40rpx 0;
}
.title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 40rpx;
}
.btn {
  width: 600rpx;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  border: 2rpx solid #2f77ff;
  color: #2f77ff;
  background: #fff;
  margin-top: 24rpx;
}
.btn.primary {
  background: linear-gradient(135deg, #2f77ff, #5aa0ff);
  color: #fff;
  border: none;
}
.btn.app {
  background: #111;
  color: #c9f76f;
  border: none;
}
.agreements {
  margin-top: 24rpx;
  font-size: 24rpx;
  color: #666;
  padding: 0 24rpx;
}
.checkbox {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.link {
  color: #2f77ff;
}
</style>

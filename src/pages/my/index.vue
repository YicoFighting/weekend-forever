<template>
  <view class="page info">
    <wd-card>
      <view class="p-[10px] flex items-center gap-2">
        <wd-img :width="35" :height="35" round mode="aspectFill" :src="online" />
        <text>在线用户 {{ Date.now().toString().slice(0, 6) }}</text>
      </view>
    </wd-card>

    <wd-card>
      <wd-cell-group>
        <wd-cell title="修改密码">
          <wd-icon name="chevron-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
        </wd-cell>
        <wd-cell title="设置">
          <wd-icon name="chevron-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
        </wd-cell>
      </wd-cell-group>
    </wd-card>
    <!-- <xl-tabber /> -->
  </view>
</template>

<script setup lang="ts">
const online =
  'https://www4.bing.com//th?id=OHR.RidgwayAspens_ZH-CN8735375502_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp&w=360&h=202';
</script>

<style lang="scss" scoped>
.page {
  box-sizing: border-box;
  padding-top: 20rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 88px);
}
.info {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #f5f5f5;
}
</style>

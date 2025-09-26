<template>
  <view>
    <text>首页</text>
    <scroll-view scroll-x>
      <view v-for="item in 10" :key="item">
        <text>{{ item }}</text>
      </view>
    </scroll-view>
    <wd-button type="primary">点击我</wd-button>
  </view>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>

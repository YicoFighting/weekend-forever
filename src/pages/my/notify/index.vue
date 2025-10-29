<template>
  <xl-navbar title="通知消息" show-back>
    <view class="mime w-full h-full pt-[12px] pb-[12px] bg-[#f5f5f5] overflow-auto">
      <notify-item v-for="item in notifyList" :key="item.id" v-bind="item" />
    </view>
  </xl-navbar>
</template>

<script setup lang="ts">
import NotifyItem from './components/notify-item.vue';

const notifyList = [
  {
    id: 1,
    avatar:
      'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20professional%20avatar%20of%20young%20asian%20woman%2C%20business%20casual%20style%2C%20friendly%20smile%2C%20clean%20background%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=80&height=80&seq=avatar002&orientation=squarish',
    name: '张小明',
    ago: '1小时前',
    content: 'xxx将自己当日/当月日程分享给你，是否接受',
    agree: true,
    reject: true,
    blacklist: true,
  },
  {
    id: 2,
    avatar:
      'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20professional%20avatar%20of%20young%20asian%20woman%2C%20business%20casual%20style%2C%20friendly%20smile%2C%20clean%20background%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=80&height=80&seq=avatar002&orientation=squarish',
    name: '张小明',
    ago: '1小时前',
    content: 'xxx将自己当日/当月日程分享给你，是否接受',
    agree: true,
    reject: true,
    blacklist: true,
  },
  {
    id: 3,
    avatar:
      'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20professional%20avatar%20of%20young%20asian%20woman%2C%20business%20casual%20style%2C%20friendly%20smile%2C%20clean%20background%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=80&height=80&seq=avatar002&orientation=squarish',
    name: '张小明',
    ago: '1小时前',
    content: 'xxx将自己当日/当月日程分享给你，是否接受',
    agree: true,
    reject: true,
    blacklist: true,
  },
  {
    id: 4,
    avatar:
      'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20professional%20avatar%20of%20young%20asian%20woman%2C%20business%20casual%20style%2C%20friendly%20smile%2C%20clean%20background%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=80&height=80&seq=avatar002&orientation=squarish',
    name: '张小明',
    ago: '1小时前',
    content: 'xxx将自己当日/当月日程分享给你，是否接受',
    agree: true,
    reject: true,
    blacklist: true,
  },
  {
    id: 5,
    avatar:
      'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20professional%20avatar%20of%20young%20asian%20woman%2C%20business%20casual%20style%2C%20friendly%20smile%2C%20clean%20background%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=80&height=80&seq=avatar002&orientation=squarish',
    name: '张小明',
    ago: '1小时前',
    content: 'xxx将自己当日/当月日程分享给你，是否接受',
    agree: true,
    reject: true,
    blacklist: true,
  },
  {
    id: 6,
    avatar:
      'https://readdy.ai/api/search-image?query=icon%2C%203D%20cartoon%20professional%20avatar%20of%20young%20asian%20woman%2C%20business%20casual%20style%2C%20friendly%20smile%2C%20clean%20background%2C%20subject%20fills%2080%20percent%20of%20frame%2C%20isolated%20on%20white%20background%2C%20centered%20composition%2C%20soft%20lighting&width=80&height=80&seq=avatar002&orientation=squarish',
    name: '张小明',
    ago: '1小时前',
    content: 'xxx将自己当日/当月日程分享给你，是否接受',
    agree: true,
    reject: true,
    blacklist: true,
  },
];
</script>

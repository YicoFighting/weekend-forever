<script setup lang="ts">
import { XlCalendar } from '@/components';
import { ref } from 'vue';
// 红色值班、黄色其他事项  error/warning
const mockEvents = [
  {
    date: '2025-09-28',
    events: [
      // 展示修改历史记录
      {
        id: 0,
        title: '值班',
        description: '值班',
        dtStart: 1727683200000,
        dtEnd: 1727769600000,
        value: 'error',
      },
      {
        id: 1,
        title: '打印资料',
        description: '打印资料',
        dtStart: 1727683200000,
        dtEnd: 1727769600000,
        value: 'warning',
      },
    ],
    status: ['error', 'warning'],
  },
];
const now = new Date();
const year = ref(now.getFullYear());
const month = ref(now.getMonth() + 1);
// 点击日期，显示对应日期的内容
const onCellTap = (payload: { year: number; month: number; day: number }) => {
  console.log(payload);
};

// 点击年月可以切换月份
const calendar = ref()
const onYearMonthTap = (payload: { year: number; month: number }) => {
  calendar.value?.open()
};
const value = ref<number>(Date.now())

function handleConfirm(payload:{ value: number }) {
  const date = new Date(payload.value)
  year.value = date.getFullYear()
  month.value = date.getMonth() + 1
}

const onMonthChange = (payload: { year: number; month: number; direction: 'prev' | 'next' }) => {
  value.value = new Date(payload.year, payload.month - 1, 1, 0, 0, 0, 0).getTime()
}
</script>

<template>
  <xl-navbar>
    <XlCalendar
      :events="mockEvents"
      v-model:year="year"
      v-model:month="month"
      @cell-tap="onCellTap"
      @month-change="onMonthChange"
      @year-month-tap="onYearMonthTap"
    />
    <!-- <view class="content">
      <view class="content-item">
        <view class="content-item-title">
          <text>值班</text>
        </view>
      </view>
      <view class="content-item">
        <view class="content-item-title">
          <text>其他事项</text>
        </view>
      </view>
    </view> -->

    <wd-calendar
      ref="calendar"
      :with-cell="false"
      type="month"
      v-model="value"
      @confirm="handleConfirm"
    />
  </xl-navbar>
</template>

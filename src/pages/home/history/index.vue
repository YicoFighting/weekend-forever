<template>
  <xl-navbar title="历史记录" show-back :navBarStyle="{ backgroundColor: 'rgb(248, 248, 248)' }">
    <view class="history w-full overflow-hidden">
      <view class="search">
        <wd-search
          v-model="filter.keyword"
          hide-cancel
          placeholder-left
          placeholder="搜索记录内容、人员姓名等"
        >
          <template #prefix>
            <wd-icon class="pl-[16px]" name="search1" size="18px" color="#999999"></wd-icon>
          </template>
        </wd-search>
      </view>

      <view class="filter bg-[#fff]">
        <view class="date gap-[12px] flex items-center pl-[15px] mb-[16px]">
          <wd-datetime-picker v-model="filter.startTime" type="date">
            <view
              class="w-[190rpx] px-[12px] py-[5px] bg-[#f8f9fa] text-[28rpx] color-[#bfbfbf] text-center cursor-pointer flex gap-[8px] items-center"
            >
              <text>2025-10-22</text>
              <wd-icon name="calendar" size="16px"></wd-icon>
            </view>
          </wd-datetime-picker>
          <text>至</text>
          <wd-datetime-picker v-model="filter.endTime" type="date">
            <view
              class="w-[190rpx] px-[12px] py-[5px] bg-[#f8f9fa] text-[28rpx] color-[#bfbfbf] text-center cursor-pointer flex gap-[8px] items-center"
            >
              <text>2025-10-22</text>
              <wd-icon name="calendar" size="16px"></wd-icon>
            </view>
          </wd-datetime-picker>
        </view>
        <view class="types gap-[8px] flex items-center pl-[15px]">
          <view
            class="type"
            v-for="item in typeList"
            :key="item.value"
            :class="{ active: filter.type === item.value }"
            @tap="selectType(item.value)"
          >
            <text>{{ item.label }}</text>
          </view>
        </view>
      </view>
    </view>
  </xl-navbar>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';

type FilterType = 'all' | 'duty' | 'change' | 'other';

const typeList: { label: string; value: FilterType }[] = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '值班安排',
    value: 'duty',
  },
  {
    label: '换班记录',
    value: 'change',
  },
  {
    label: '事项记录',
    value: 'other',
  },
];

const filter = ref({
  keyword: '',
  startTime: dayjs().startOf('month').valueOf(),
  endTime: dayjs().endOf('month').valueOf(),
  type: 'all' as FilterType,
});

const selectType = (value: FilterType) => {
  filter.value.type = value;
};
</script>

<style lang="scss" scoped>
.history {
  box-sizing: border-box;
  height: calc(100% - 55px);
  background: rgb(248, 248, 248);
  display: flex;
  flex-direction: column;
  .search {
    // padding-bottom: 8px;
    :deep(.wd-search__field) {
      .wd-icon-search {
        display: none;
      }
      .wd-search__input {
        padding: 0;
      }
    }
  }
  .filter {
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 20px;
  }
  .types {
    .type {
      padding: 8px 12px;
      color: #666666;
      background-color: #f8f9fa;
      font-size: 13px;
      border-radius: 10px;
      border: 1px solid transparent;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .active {
      background-color: #e3f2fd;
      border-color: #007aff;
      color: #007aff;
      font-weight: 500;
    }
  }
}
</style>

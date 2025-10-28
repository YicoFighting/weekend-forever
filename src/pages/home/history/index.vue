<template>
  <xl-navbar title="历史记录" show-back>
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
              class="w-[200rpx] px-[12px] py-[5px] bg-[#f8f9fa] text-[28rpx] color-[#bfbfbf] text-center cursor-pointer flex gap-[8px] items-center"
            >
              <text>2025-10-22</text>
              <wd-icon name="calendar" size="16px"></wd-icon>
            </view>
          </wd-datetime-picker>
          <text>至</text>
          <wd-datetime-picker v-model="filter.endTime" type="date">
            <view
              class="w-[200rpx] px-[12px] py-[5px] bg-[#f8f9fa] text-[28rpx] color-[#bfbfbf] text-center cursor-pointer flex gap-[8px] items-center"
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

      <view class="list overflow-auto">
        <template v-for="item in list" :key="item.date">
          <view class="list-item flex flex-col gap-[12px]">
            <view class="date-header flex justify-between items-center text-[12px] mt-[12px]">
              <view class="date-title text-[16px] font-600 text-[#333]">{{ item.date }}</view>
              <view class="record-count text-[12px] text-[#666]">
                共{{ item.records.length }}条记录
              </view>
            </view>
            <template v-for="record in item.records" :key="`${item.date}-${record.time}`">
              <!-- 换班记录 -->
              <history-item
                :type="record.type"
                :time="record.time"
                :title="record.title"
                :desc="record.desc"
                @click="handleRecordClick(record)"
              />
            </template>
          </view>
        </template>
      </view>
    </view>

    <wd-action-sheet v-model="showDetail" title="记录详情">
      <view class="detail-content">
        <view class="detail-item">
          <view class="detail-label">记录类型</view>
          <view
            class="record-type-badge"
            :style="{
              backgroundColor: typeColor[detail.type!].bgColor,
              color: typeColor[detail.type!].color,
            }"
          >
            {{ typeColor[detail.type!].label }}
          </view>
        </view>

        <view class="detail-item">
          <view class="detail-label">记录时间</view>
          <text class="detail-value">{{ detail.time }}</text>
        </view>

        <view class="detail-item">
          <view class="detail-label">标题</view>
          <text class="detail-value">{{ detail.title }}</text>
        </view>

        <view class="detail-item">
          <view class="detail-label">详细描述</view>
          <text class="detail-value multi-line">
            {{ detail.desc }}
          </text>
        </view>

        <!-- <view class="detail-item">
          <text class="detail-label">相关人员</text>
          <text class="detail-value">张护士、王护士</text>
        </view> -->

        <!-- <view class="detail-item">
          <view class="detail-label">附件</view>
          <view class="detail-attachments">
            <view class="detail-attachment"></view>
          </view>
        </view> -->
      </view>
    </wd-action-sheet>
  </xl-navbar>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
import HistoryItem from './components/history-item.vue';
import { typeColor } from '@/constants/colors';

type FilterType = 'all' | 'duty' | 'change' | 'other';

const list: {
  date: string;
  records: { type: 'duty' | 'change' | 'other'; time: string; title: string; desc: string }[];
}[] = [
  {
    date: '2025-10-22',
    records: [
      {
        type: 'duty',
        time: '16:30',
        title: '患者家属沟通',
        desc: '与5床患者家属沟通病情进展，解答用药疑问，提供护理指导',
      },
      {
        type: 'change',
        time: '16:30',
        title: '患者家属沟通',
        desc: '与5床患者家属沟通病情进展，解答用药疑问，提供护理指导',
      },
      {
        type: 'other',
        time: '16:30',
        title: '患者家属沟通',
        desc: '与5床患者家属沟通病情进展，解答用药疑问，提供护理指导',
      },
    ],
  },
  {
    date: '2025-10-21',
    records: [
      {
        type: 'change',
        time: '16:30',
        title: '患者家属沟通',
        desc: '与5床患者家属沟通病情进展，解答用药疑问，提供护理指导',
      },
      {
        type: 'other',
        time: '16:30',
        title: '患者家属沟通',
        desc: '与5床患者家属沟通病情进展，解答用药疑问，提供护理指导',
      },
    ],
  },
];

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

const showDetail = ref(false);
const detail = ref<
  Partial<{
    type: 'duty' | 'change' | 'other';
    time: string;
    title: string;
    desc: string;
    participants?: string[];
    attachments?: string[];
  }>
>({});
const handleRecordClick = (record: {
  type: 'duty' | 'change' | 'other';
  time: string;
  title: string;
  desc: string;
}) => {
  console.log(record);
  detail.value = record;
  showDetail.value = true;
};
</script>

<style lang="scss" scoped>
.history {
  box-sizing: border-box;
  // #ifdef H5
  height: calc(100vh - 32px);
  // #endif
  // #ifndef H5
  height: 100%;
  // #endif
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
  .list {
    padding: 16px 20px;
  }
}

:deep(.wd-action-sheet__header) {
  height: unset;
  line-height: unset;
  text-align: left;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}
.detail-content {
  padding: 16px 20px;
  max-height: calc(80vh - 60px);
  overflow-y: auto;
  .detail-item {
    margin-bottom: 16px;
    .detail-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
    .record-type-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
    }

    .detail-value {
      font-size: 15px;
      color: #333;
      line-height: 1.5;
    }
    .multi-line {
      white-space: pre-wrap;
    }
  }
}
</style>

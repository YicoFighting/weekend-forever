<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import SyncItem from './components/sync-item.vue';
import DeleteItem from './components/delete-item.vue';

const mockEvents = {
  '2025-10-20': [
    {
      id: 0,
      title: '值班',
      description: '值班',
      dtStart: 1761062400000,
      dtEnd: 1761148799000,
      value: 'duty',
    },
    {
      id: 1,
      title: '打印资料',
      description: '打印资料',
      dtStart: 1761062400000,
      dtEnd: 1761148799000,
      value: 'other',
    },
  ],
  '2025-10-22': [
    {
      id: 1,
      title: '打印资料',
      description: '打印资料',
      dtStart: 1761062400000,
      dtEnd: 1761148799000,
      value: 'other',
    },
  ],
};

const now = new Date();
const year = ref(now.getFullYear());
const month = ref(now.getMonth() + 1);

// 使用 dayjs 拿到当天的 xxxx年xx月xx日
const selectedDay = ref<string>(dayjs().format('YYYY年MM月DD日'));

const onCellTap = (payload: { year: number; month: number; day: number }) => {
  selectedDay.value = dayjs(new Date(payload.year, payload.month - 1, payload.day)).format(
    'YYYY年MM月DD日',
  );
};

const onEventTap = (payload: { year: number; month: number; day: number }) => {
  console.log(payload);
};

// 点击年月可以切换月份
const calendar = ref();
const value = ref<number>(Date.now());
const onYearMonthTap = (payload: { year: number; month: number }) => {
  calendar.value?.open();
};
function handleConfirm(payload: { value: number }) {
  const date = new Date(payload.value);
  year.value = date.getFullYear();
  month.value = date.getMonth() + 1;
}
const onMonthChange = (payload: { year: number; month: number; direction: 'prev' | 'next' }) => {
  value.value = new Date(payload.year, payload.month - 1, 1, 0, 0, 0, 0).getTime();
};

const onAddTap = () => {
  uni.navigateTo({
    url: '/pages/home/add/index',
  });
};

// 分享
const showShare = ref(false);
const handleShare = (type: 'Day' | 'Month') => {
  showShare.value = false;
  uni.showToast({
    title: type === 'Day' ? '分享当日值班' : '分享当月值班',
    icon: 'success',
  });
};

// 日历高度变化时
const itemContent = ref();
const onHeightChange = (payload: number) => {
  const el = (itemContent.value as any)?.$el || (itemContent.value as any);
  if (!el) return;
  if (typeof el.scrollTo === 'function') {
    try {
      el.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      el.scrollTop = 0;
    }
  } else {
    el.scrollTop = 0;
  }
};

const showMore = ref(false);
const onMoreTap = () => {
  showMore.value = true;
};

const onHistoryTap = () => {
  uni.navigateTo({
    url: '/pages/home/history/index',
  });
};

// 打开同步弹窗
const syncItem = ref();
const onSyncTap = () => {
  syncItem.value?.beforeConfirm();
};

// 打开删除弹窗
const deleteItem = ref();
const onDeleteTap = () => {
  deleteItem.value?.beforeConfirm();
};
// 删除其他事项
const handleDelete = () => {
  deleteItem.value?.handleCancel();
  uni.showToast({
    title: '删除成功',
    icon: 'success',
  });
};

// 配置中心
const onSettingTap = () => {
  uni.navigateTo({
    url: '/pages/home/setting/index',
  });
};

// 共享值班
const onShareTap = () => {
  uni.navigateTo({
    url: '/pages/home/share/index',
  });
};

// 打开编辑弹窗
const onEditTap = () => {
  uni.navigateTo({
    url: '/pages/home/edit/index?id=1',
  });
};

// 当天事项以列表展开
const onListTap = () => {
  uni.navigateTo({
    url: '/pages/home/list/index',
  });
};
</script>

<template>
  <xl-navbar title="首页">
    <view class="home w-full overflow-hidden">
      <xl-calendar
        :events="mockEvents"
        :year="year"
        :month="month"
        @cell-tap="onCellTap"
        @event-tap="onEventTap"
        @month-change="onMonthChange"
        @year-month-tap="onYearMonthTap"
        @height-change="onHeightChange"
      >
        <template #header>
          <view class="icon flex justify-end gap-2">
            <wd-icon name="add-circle1" size="20px" @tap="onAddTap"></wd-icon>
            <view class="more">
              <wd-icon name="more1" size="20px" @tap="onMoreTap"> </wd-icon>
              <view v-show="showMore" class="relative" @tap="showMore = false">
                <view class="mask fixed top-0 left-0 w-[100vw] h-[100vh] z-9"></view>
                <view class="more-popup absolute top-[10px] right-[10px] z-999">
                  <view
                    class="list bg-[#fff] w-[200rpx] p-[10px] border border-gray-200 rounded-[10rpx] p-[16rpx]"
                  >
                    <view class="item h-[60rpx] flex gap-[10px] items-center" @tap="onHistoryTap">
                      历史记录
                    </view>
                    <view class="item h-[60rpx] flex gap-[10px] items-center" @tap="onSyncTap">
                      同步至本地
                    </view>
                    <view class="item h-[60rpx] flex gap-[10px] items-center" @tap="onSettingTap">
                      配置中心
                    </view>
                    <view class="item h-[60rpx] flex gap-[10px] items-center" @tap="onShareTap">
                      分享的值班
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </template>
      </xl-calendar>
      <!-- 默认展示当天的 -->
      <view class="item-content py-[10px]" ref="itemContent">
        <wd-card>
          <template #title>
            <view class="flex justify-between items-center">
              {{ `${selectedDay} 详情` }}
              <!-- 以列表形式展示当天的值班信息 -->
              <wd-icon name="list" size="16px" @tap="onListTap"></wd-icon>
              <wd-icon name="share" size="16px" color="#007aff" @tap="showShare = true"></wd-icon>
            </view>
          </template>
          <template #default>
            <!-- 值班信息 -->
            <view class="title mb-[12px]">
              <h4 class="desc text-[32rpx] fw-600 color-[#333333]">值班信息</h4>
            </view>
            <view
              class="card duty bg-[#f8f9fa] p-[12px] boder-rounded-[6px] mb-[16px] flex justify-between items-center"
            >
              <ul>
                <li class="flex">
                  <p class="title color-[#333333] text-[14px]">值班类型：</p>
                  <p class="value color-[#666666] text-[12px]">夜班</p>
                </li>
                <li class="flex">
                  <p class="title color-[#333333] text-[14px]">时间段：</p>
                  <p class="value color-[#666666] text-[12px] f">18:00 - 06:00</p>
                </li>
              </ul>
              <view class="icon flex gap-[10px]">
                <wd-icon name="edit-outline" size="16px" color="#007aff" @tap="onEditTap"></wd-icon>
                <wd-icon name="delete1" size="16px" color="#ff3b30" @tap="onDeleteTap"></wd-icon>
              </view>
            </view>

            <!-- 其他事项 -->
            <view class="title flex justify-between items-center mb-[12px]">
              <h4 class="desc text-[32rpx] fw-600 color-[#333333]">其他事项</h4>
            </view>

            <view class="flex flex-col gap-[16px] pb-[16px]">
              <view
                class="card other bg-[#f8f9fa] p-[12px] boder-rounded-[6px] flex justify-between items-center"
              >
                <ul>
                  <li class="desc color-[#333333] text-[14px]">查房</li>
                  <li class="time color-[#666666] text-[12px]">18:00 - 06:00</li>
                </ul>
                <view class="icon flex gap-[10px]">
                  <wd-icon
                    name="edit-outline"
                    size="16px"
                    color="#007aff"
                    @tap="onEditTap"
                  ></wd-icon>
                  <wd-icon name="delete1" size="16px" color="#ff3b30" @tap="onDeleteTap"></wd-icon>
                </view>
              </view>
            </view>

            <!-- <view class="no-events py-[24px] text-[#999] text-[14px] text-center">
              暂无其他事项
            </view> -->
          </template>
        </wd-card>
      </view>
    </view>

    <wd-calendar
      ref="calendar"
      :with-cell="false"
      type="month"
      v-model="value"
      @confirm="handleConfirm"
    />

    <!-- 在数据库要单独存分享表 -->
    <wd-action-sheet v-model="showShare">
      <view class="share p-[32rpx]">
        <h4 class="text-[16px] text-center color-[#333333] fw-600 mb-[32rpx]">分享值班信息</h4>
        <view class="share-options gap-[24rpx] mb-[32rpx] flex flex-col">
          <view
            class="share-option flex items-center p-[32rpx] bg-[#f8f9fa] boder-rounded-[12rpx] gap-[24rpx]"
            @tap="handleShare('Day')"
          >
            <wd-icon name="calendar" size="20px" color="#007aff"></wd-icon>
            <text>分享当日值班</text>
          </view>
          <view
            class="share-option flex items-center p-[32rpx] bg-[#f8f9fa] boder-rounded-[12rpx] gap-[24rpx]"
            @tap="handleShare('Month')"
          >
            <wd-icon name="view-list" size="20px" color="#007aff"></wd-icon>
            <text>分享当月值班</text>
          </view>
        </view>
        <view
          class="cancel-btn py-[24rpx] text-[28rpx] text-center color-[#666666] fw-600 bg-[#f5f5f5]"
          @tap="showShare = false"
        >
          取 消
        </view>
      </view>
    </wd-action-sheet>

    <sync-item ref="syncItem" />

    <delete-item ref="deleteItem" @confirm="handleDelete" />
  </xl-navbar>

  <!-- <xl-tabber /> -->
</template>

<style lang="scss" scoped>
.home {
  box-sizing: border-box;
  // #ifdef H5
  height: calc(100vh - 69px);
  // #endif
  // #ifndef H5
  height: 100%;
  // #endif
  background: rgb(248, 248, 248);
  display: flex;
  flex-direction: column;
  .mask {
    background: rgba(0, 0, 0, 0.15);
  }
  .list {
    font-size: 14px;
    color: #666;
  }
  .item-content {
    flex: 1 0 0;
    overflow-y: auto;
  }
  .card {
    position: relative;
    border-radius: 6rpx;
    overflow: hidden;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 6rpx;
    }
  }
  .duty {
    &::before {
      background: #4caf50;
    }
  }
  .other {
    &::before {
      background: #2196f3;
    }
  }
  ul,
  li {
    list-style: none;
    padding: 0;
  }
}

.share {
  height: 436rpx;
}
</style>

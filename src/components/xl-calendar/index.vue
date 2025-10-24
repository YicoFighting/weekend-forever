<template>
  <view class="xl-calendar">
    <xl-floating-panel v-model:height="height" :anchors="anchors" @heightChange="onHeightChange">
      <view class="header flex justify-between items-center">
        <text @tap="onYearMonthTap" class="text-[#333] font-600">
          {{ `${baseYear}年${baseMonth}月` }}
        </text>
        <slot name="header"></slot>
      </view>
      <swiper class="swiper" :current="currentIndex" circular @change="onChange">
        <swiper-item v-for="(cells, idx) in list" :key="idx">
          <view class="swiper-item">
            <view v-if="showWeekHeader" class="xl-calendar__week">
              <view v-for="w in weekdayLabels" :key="w" class="xl-calendar__week-item">
                {{ w }}
              </view>
            </view>
            <view class="grid">
              <view
                v-for="(cell, i) in cells"
                :key="`${cell.year}-${cell.month}-${cell.date}`"
                class="cell relative"
                :class="{
                  dim: !cell.inCurrentMonth,
                  'last-cell': i % 7 === 6,
                  duty: isDuty(cell.year, cell.month, cell.date),
                }"
              >
                <view class="dot" v-if="isOther(cell.year, cell.month, cell.date)"></view>
                <view
                  class="cell-date"
                  :class="{ today: isToday(cell.year, cell.month, cell.date) }"
                  @tap="onCellTap(cell)"
                >
                  {{ isToday(cell.year, cell.month, cell.date) ? '今' : cell.date }}
                </view>
                <text
                  v-if="anchorsIndex === 1 && hasEvents(cell.year, cell.month, cell.date)"
                  class="cell-events"
                  @tap="onEventTap(cell.year, cell.month, cell.date)"
                >
                  {{ hasEvents(cell.year, cell.month, cell.date) }}
                </text>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </xl-floating-panel>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

interface Events {
  id: number;
  title: string;
  description: string;
  dtStart: number;
  dtEnd: number;
  value: string;
}

const props = withDefaults(
  defineProps<{
    year?: number; // 默认：当前年
    month?: number; // 1-12，默认：当前月
    showWeekHeader?: boolean;
    events?: Record<string, Events[]>;
  }>(),
  {
    showWeekHeader: true,
    events: () => ({}),
  },
);

const emit = defineEmits<{
  (e: 'month-change', payload: { year: number; month: number; direction: 'prev' | 'next' }): void;
  (e: 'cell-tap', payload: { year: number; month: number; day: number }): void;
  (e: 'year-month-tap', payload: { year: number; month: number }): void;
  (e: 'event-tap', payload: { year: number; month: number; day: number }): void;
  (e: 'height-change', payload: number): void;
}>();

const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日'];

const height = ref<number>(0);
const windowHeight = ref<number>(0);
const anchorsIndex = ref<number>(1);
const anchors = ref<number[]>([]);

onLoad(() => {
  // 获取窗口高度
  windowHeight.value = uni.getWindowInfo().windowHeight;
  // 锚定高度
  anchors.value = [Math.round(0.5 * windowHeight.value), Math.round(0.6 * windowHeight.value)];
  // 设置初始高度
  height.value = anchors.value[anchorsIndex.value];
});

const onHeightChange = (payload: { height: number; index: number }) => {
  anchorsIndex.value = payload.index;
  emit('height-change', payload.height);
};

// 基准年月：优先使用 props，否则取系统当前
const now = new Date();
const baseYear = ref<number>(props.year ?? now.getFullYear());
const baseMonth = ref<number>(props.month ?? now.getMonth() + 1); // 1-12

// 三槽位 swiper 索引
const currentIndex = ref<number>(1);
const prevIndexRef = ref<number>(1);

// 单元格类型定义与列表
type DayCell = {
  year: number;
  month: number; // 1-12
  date: number; // 1-31
  inCurrentMonth: boolean;
};

type MonthCells = DayCell[];

const list = ref<MonthCells[]>([]);

const isDuty = (year: number, month: number, date: number): boolean => {
  return props.events[`${year}-${month}-${date}`]?.some((event) => event.value === 'duty');
};

const isOther = (year: number, month: number, date: number): boolean => {
  return props.events[`${year}-${month}-${date}`]?.some((event) => event.value === 'other');
};

const isToday = (year: number, month: number, date: number): boolean => {
  const today = new Date();
  return today.getFullYear() === year && today.getMonth() + 1 === month && today.getDate() === date;
};

const hasEvents = (year: number, month: number, date: number): string => {
  const events = props.events[`${year}-${month}-${date}`] || [];
  return events[0]?.title?.slice(0, 2);
};

const onCellTap = (cell: DayCell) => {
  emit('cell-tap', { year: cell.year, month: cell.month, day: cell.date });
};

const onEventTap = (year: number, month: number, date: number) => {
  emit('event-tap', { year: year, month: month, day: date });
};

const onYearMonthTap = () => {
  emit('year-month-tap', { year: baseYear.value, month: baseMonth.value });
};

const shiftYearMonth = (y: number, m: number, delta: number): { year: number; month: number } => {
  // delta 可为正负，表示偏移多少个月
  let total = y * 12 + (m - 1) + delta; // 归一到 0 基
  const newYear = Math.floor(total / 12);
  const newMonth = (total % 12) + 1;
  return { year: newYear, month: newMonth };
};

const daysInMonth = (y: number, m: number): number => {
  return new Date(y, m, 0).getDate();
};

const firstDayWeekIndex = (y: number, m: number): number => {
  // 以周一为 0，周日为 6（便于 7 列布局）
  const jsWeek = new Date(y, m - 1, 1).getDay(); // 0-6，周日-周六
  return (jsWeek + 6) % 7;
};

const buildMonthCells = (y: number, m: number): MonthCells => {
  const cells: MonthCells = [];
  const curMonthDays = daysInMonth(y, m);
  const prevYM = shiftYearMonth(y, m, -1);
  const nextYM = shiftYearMonth(y, m, 1);
  const prevMonthDays = daysInMonth(prevYM.year, prevYM.month);

  const startOffset = firstDayWeekIndex(y, m); // 当月 1 号在周几（以周一为 0）

  // 填充上月补位
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({
      year: prevYM.year,
      month: prevYM.month,
      date: prevMonthDays - i,
      inCurrentMonth: false,
    });
  }

  // 填充当月
  for (let d = 1; d <= curMonthDays; d++) {
    cells.push({ year: y, month: m, date: d, inCurrentMonth: true });
  }

  // 填充下月补位，直到 42 格
  let tail = 42 - cells.length;
  for (let d = 1; d <= tail; d++) {
    cells.push({ year: nextYM.year, month: nextYM.month, date: d, inCurrentMonth: false });
  }
  return cells;
};

// 初始化三槽位列表：prev / current / next
const initList = () => {
  const prev = shiftYearMonth(baseYear.value, baseMonth.value, -1);
  const next = shiftYearMonth(baseYear.value, baseMonth.value, 1);
  list.value = [
    buildMonthCells(prev.year, prev.month),
    buildMonthCells(baseYear.value, baseMonth.value),
    buildMonthCells(next.year, next.month),
  ];
};

initList();

// 外部变更 year/month 时，同步内部基准年月并重建列表
watch(
  () => [props.year, props.month] as const,
  (nv) => {
    const y = nv[0];
    const m = nv[1];
    if (typeof y === 'number' && typeof m === 'number') {
      baseYear.value = y;
      baseMonth.value = m;
      initList();
    }
  },
);

const onChange = (e: UniHelper.SwiperOnChangeEvent) => {
  const cur = e.detail.current as number;
  const old = prevIndexRef.value;
  const forward = (old + 1) % 3;
  const backward = (old + 2) % 3;
  if (cur === forward) {
    // 进入下一月
    const nextYM = shiftYearMonth(baseYear.value, baseMonth.value, 1);
    baseYear.value = nextYM.year;
    baseMonth.value = nextYM.month;
    emit('month-change', { year: baseYear.value, month: baseMonth.value, direction: 'next' });
    // 复用右侧槽位作为“新的 next”
    const slot = (cur + 1) % 3;
    const newNext = shiftYearMonth(baseYear.value, baseMonth.value, 1);
    list.value[slot] = buildMonthCells(newNext.year, newNext.month);
  } else if (cur === backward) {
    // 进入上一月
    const prevYM = shiftYearMonth(baseYear.value, baseMonth.value, -1);
    baseYear.value = prevYM.year;
    baseMonth.value = prevYM.month;
    emit('month-change', { year: baseYear.value, month: baseMonth.value, direction: 'prev' });
    // 复用左侧槽位作为“新的 prev”
    const slot = (cur + 2) % 3;
    const newPrev = shiftYearMonth(baseYear.value, baseMonth.value, -1);
    list.value[slot] = buildMonthCells(newPrev.year, newPrev.month);
  }
  prevIndexRef.value = cur;
  currentIndex.value = cur;
};
</script>

<style lang="scss" scoped>
.xl-calendar {
  .header {
    padding: 32rpx 40rpx;
  }
  .swiper {
    flex: 1 0 0;
    overflow: hidden;
    &-item {
      height: 100%;
      display: flex;
      flex-direction: column;

      .xl-calendar__week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-top: 2rpx solid #f0f0f0;
        border-bottom: 2rpx solid #f0f0f0;
        &-item {
          text-align: center;
          color: #808191;
          font-size: 24rpx;
          padding: 24rpx 0;
        }
      }

      .grid {
        flex: 1 0 0;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: 1fr;
        border-bottom: 2rpx solid #f0f0f0;
        .cell {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          border-right: 2rpx solid #f0f0f0;
          border-bottom: 2rpx solid #f0f0f0;
          padding-bottom: 16rpx;
          .dot {
            position: absolute;
            top: 12rpx;
            right: 12rpx;
            width: 12rpx;
            height: 12rpx;
            border-radius: 50%;
            background-color: rgb(76, 175, 80);
          }
          .cell-date {
            flex: 1 0 0;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .today {
            color: #2196f3;
          }
          .cell-events {
            margin: 0 auto;
            color: #ff9800;
            font-size: 20rpx;
            text-align: center;
            padding: 4rpx 8rpx;
            border-radius: 8rpx;
            background-color: rgba(255, 152, 0, 0.1);
          }
        }
        .dim {
          color: #999;
        }
        .last-cell {
          border-right: none;
        }
        .duty {
          background: #fff3e0;
          color: #333;
        }
      }
    }
  }
}
</style>

<script setup lang="ts">
import { computed, ref } from 'vue';

type FirstDay = 0 | 1; // 0: Sunday-first, 1: Monday-first

type event = {
  id: number;
  title: string;
  description: string;
  dtStart: number;
  dtEnd: number;
  // value: 'error' | 'warning';
  value: string;
};

type CalendarEvent = {
  date: string | number | Date;
  events: event[];
  status: string[];
};

const props = withDefaults(
  defineProps<{
    year?: number; // default: current year
    month?: number; // 1-12, default: current month
    firstDayOfWeek?: FirstDay; // default: Monday-first like the screenshot
    showWeekHeader?: boolean; // default: true
    collapsedCellHeight?: number; // rpx
    expandedCellHeight?: number; // rpx
    events?: CalendarEvent[];
    maxEventsPerDay?: number;
    // 手势阈值与折叠态指示点
    expandThreshold?: number; // px
  }>(),
  {
    firstDayOfWeek: 1,
    showWeekHeader: true,
    collapsedCellHeight: 96,
    expandedCellHeight: 160,
    maxEventsPerDay: 2,
    expandThreshold: 30,
  },
);

const emit = defineEmits<{
  (e: 'update:year', value: number): void;
  (e: 'update:month', value: number): void;
  (e: 'month-change', payload: { year: number; month: number; direction: 'prev' | 'next' }): void;
  (e: 'cell-tap', payload: { year: number; month: number; day: number }): void;
  (e: 'year-month-tap', payload: { year: number; month: number }): void;
}>();

// 年月：默认是当前年月
const today = new Date();
const viewYear = computed(() => props.year ?? today.getFullYear());
const viewMonth = computed(() => props.month ?? today.getMonth() + 1); // 1-12

// 星期：默认是周一到周日
const weekdayLabels = computed(() =>
  props.firstDayOfWeek === 0
    ? ['日', '一', '二', '三', '四', '五', '六']
    : ['一', '二', '三', '四', '五', '六', '日'],
);

// 获取每个月的天数
function getMonthDayCount(year: number, monthOneBased: number): number {
  return new Date(year, monthOneBased, 0).getDate();
}
const monthDayCount = computed(() => getMonthDayCount(viewYear.value, viewMonth.value));

// 计算需要填充的空格数
const leadingEmptyCount = computed(() => {
  // 该月 1 号的星期（0=周日…6=周六）
  const firstDayJs = new Date(viewYear.value, viewMonth.value - 1, 1).getDay();
  // 需要把 JS 的“周日=0”体系映射为“周一=0”。映射公式：(firstDayJs + 6) % 7
  return props.firstDayOfWeek === 1 ? (firstDayJs + 6) % 7 : firstDayJs;
});

// 计算格子数
const totalCells = computed(() => {
  const used = leadingEmptyCount.value + monthDayCount.value;
  if (used <= 28) return 28; // 4 rows
  if (used <= 35) return 35; // 5 rows
  return 42; // 6 rows max
});
type CalendarCell = { dayNumber: number | null };
const cells = computed<CalendarCell[]>(() => {
  const result: CalendarCell[] = Array.from({ length: totalCells.value }, () => ({
    dayNumber: null,
  }));
  for (let i = 0; i < monthDayCount.value; i++) {
    result[leadingEmptyCount.value + i].dayNumber = i + 1;
  }
  return result;
});

// 事件映射（当前月）
const eventsByDay = computed(() => {
  const map: Record<number, { events: event[]; status: string[] }> = {};
  (props.events ?? []).forEach((evt) => {
    const d = new Date(evt.date as any);
    // 判断是当月
    if (
      !Number.isNaN(d.getTime()) &&
      d.getFullYear() === viewYear.value &&
      d.getMonth() + 1 === viewMonth.value
    ) {
      // 第几天
      const day = d.getDate();
      map[day] = {
        events: evt.events,
        status: evt.status,
      };
    }
  });
  return map;
});

// 下滑展开，上滑收起（本地受控）
const isExpanded = ref(false);
let touchStartY = 0;
let lastMoveY = 0;
function onTouchStart(e: any) {
  const t = e.touches?.[0] || e.changedTouches?.[0];
  touchStartY = t?.clientY ?? 0;
  lastMoveY = touchStartY;
}
function onTouchMove(e: any) {
  const t = e.touches?.[0] || e.changedTouches?.[0];
  lastMoveY = t?.clientY ?? lastMoveY;
}
function onTouchEnd(e: any) {
  const t = e.changedTouches?.[0] || e.touches?.[0];
  const endY = t?.clientY ?? lastMoveY;
  const deltaY = endY - touchStartY;
  // 超过此位移才触发展开/收起
  const threshold = props.expandThreshold;
  if (Math.abs(deltaY) > threshold) {
    // 下滑展开
    if (deltaY > 0) isExpanded.value = true;
    // 上滑收起
    else isExpanded.value = false;
  }
}

const currentCellHeight = computed(() =>
  isExpanded.value ? props.expandedCellHeight : props.collapsedCellHeight,
);

// 判断是否是今天
const isToday = (day: number | null) => {
  if (!day) return false;
  return (
    viewYear.value === today.getFullYear() &&
    viewMonth.value === today.getMonth() + 1 &&
    day === today.getDate()
  );
};

// 头部左右切换月份（由父组件 v-model:year / v-model:month 接管）
function setYearMonth(y: number, m: number, direction: 'prev' | 'next') {
  emit('update:year', y);
  emit('update:month', m);
  emit('month-change', { year: y, month: m, direction });
}
function onPrevMonth() {
  let y = viewYear.value;
  let m = viewMonth.value - 1;
  if (m < 1) {
    m = 12;
    y -= 1;
  }
  setYearMonth(y, m, 'prev');
}
function onNextMonth() {
  let y = viewYear.value;
  let m = viewMonth.value + 1;
  if (m > 12) {
    m = 1;
    y += 1;
  }
  setYearMonth(y, m, 'next');
}

const onCellTap = (day: number | null) => {
  if (!day) return;
  emit('cell-tap', { year: viewYear.value, month: viewMonth.value, day });
};

const onYearMonthTap = () => {
  emit('year-month-tap', { year: viewYear.value, month: viewMonth.value });
};
</script>

<template>
  <view
    class="xl-calendar"
    @touchstart.passive.stop="onTouchStart"
    @touchmove.stop.prevent="onTouchMove"
    @touchend.passive.stop="onTouchEnd"
  >
    <slot name="header">
      <view class="xl-calendar__header">
        <view class="header-left">
          <view class="xl-calendar__header-left" @tap="onPrevMonth">&lt;</view>
          <view class="xl-calendar__header-year-month" @tap="onYearMonthTap"> {{ viewYear }}年{{ viewMonth }}月 </view>
          <view class="xl-calendar__header-right" @tap="onNextMonth">&gt;</view>
        </view>
        <view class="header-right">
          <view class="xl-calendar__header-right-item">
            <view class="xl-calendar__header-right-item-dot"></view>
            <view class="xl-calendar__header-right-item-text">值班</view>
          </view>
          <view class="xl-calendar__header-right-item">
            <view class="xl-calendar__header-right-item-dot"></view>
            <view class="xl-calendar__header-right-item-text">其他事项</view>
          </view>
        </view>
      </view>
    </slot>

    <view v-if="showWeekHeader" class="xl-calendar__week">
      <view v-for="w in weekdayLabels" :key="w" class="xl-calendar__week-item">{{ w }}</view>
    </view>

    <view class="xl-calendar__grid" :style="{ gridAutoRows: currentCellHeight + 'rpx' }">
      <view
        v-for="(cell, idx) in cells"
        :key="idx"
        :class="['xl-calendar__cell', !cell.dayNumber ? 'is-empty' : '']"
        @tap="onCellTap(cell.dayNumber)"
      >
        <template v-if="cell.dayNumber">
          <text :class="{ 'xl-calendar__day': true, 'is-today': isToday(cell.dayNumber) }">
            {{ cell.dayNumber }}
          </text>
          <view class="xl-calendar__events">
            <slot :isExpanded="isExpanded" :events="eventsByDay[cell.dayNumber]">
              <template v-if="isExpanded">
                <view
                  v-for="(evt, eidx) in (eventsByDay[cell.dayNumber]?.events || []).slice(
                    0,
                    maxEventsPerDay,
                  )"
                  :key="evt.id ?? eidx"
                  class="xl-calendar__event"
                >
                  {{ evt.title?.slice(0, 4) }}
                </view>
              </template>
              <template v-else>
                <view class="xl-calendar__dots">
                  <view
                    v-for="status in eventsByDay[cell.dayNumber]?.status"
                    :key="status"
                    :class="['xl-calendar__dot', status]"
                  />
                </view>
              </template>
            </slot>
          </view>
        </template>
      </view>
    </view>

    <!-- 拖拽提示条：下边框 + 居中的小圆柱 -->
    <view
      class="xl-calendar__drag-handle"
      @touchstart.stop="onTouchStart"
      @touchmove.stop.prevent="onTouchMove"
      @touchend.stop="onTouchEnd"
    >
      <view class="xl-calendar__drag-bar" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.xl-calendar {
  display: flex;
  flex-direction: column;
}

.xl-calendar__week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 8rpx;
  margin-bottom: 12rpx;
}

/* 头部样式优化：左侧不拉伸，右侧说明项靠右对齐 */
.xl-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8rpx 12rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex: 0 0 auto; /* 不占满，保持紧凑 */
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  justify-content: flex-end;
}

.xl-calendar__header-left,
.xl-calendar__header-right {
  width: 44rpx;
  height: 44rpx;
  border-radius: 8rpx;
  border: 1rpx solid #e5e6eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2329;
  background-color: #ffffff;
}

.xl-calendar__header-year-month {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f2329;
}

.xl-calendar__header-right-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.xl-calendar__header-right-item-text {
  font-size: 22rpx;
  color: #4e5969;
}

.xl-calendar__header-right-item-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #d0d3d9;
}

/* 约定第一个为红，第二个为黄 */
.header-right .xl-calendar__header-right-item:nth-child(1) .xl-calendar__header-right-item-dot {
  background-color: #ff4d4f;
}
.header-right .xl-calendar__header-right-item:nth-child(2) .xl-calendar__header-right-item-dot {
  background-color: #faad14;
}

/* 拖拽提示区域 */
.xl-calendar__drag-handle {
  height: 36rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #e5e6eb;
}

.xl-calendar__drag-bar {
  width: 96rpx;
  height: 10rpx;
  border-radius: 10rpx;
  background-color: #d8dadd;
}

.xl-calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 8rpx;
}

.xl-calendar__header-left,
.xl-calendar__header-right {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2329;
  background-color: #f5f6f8;
}

.xl-calendar__header-year-month {
  font-size: 30rpx;
  color: #1f2329;
}

.xl-calendar__week-item {
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  color: #808191;
  font-size: 24rpx;
}

.xl-calendar__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  // 默认值，运行时通过 style 覆盖
  grid-auto-rows: 96rpx;
  // 设置行列间距
  row-gap: 8rpx;
  column-gap: 8rpx;
}

.xl-calendar__cell {
  position: relative;
  background-color: #ffffff;

  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.xl-calendar__cell.is-empty {
  background-color: transparent;
}

.xl-calendar__day {
  height: 96rpx;
  line-height: 96rpx;
  font-size: 30rpx;
  color: #1f2329;
  text-align: center;
  border-radius: 12rpx;
}

.xl-calendar__day.is-today {
  color: #ffffff;
  background-color: #007aff;
}

.xl-calendar__events {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  width: 100%;
  margin-top: 6rpx;
  overflow: hidden;
}

.xl-calendar__event {
  border-radius: 8rpx;
  font-size: 20rpx;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #007aff;
  background-color: #e8f3ff;
  text-align: center;
}

.xl-calendar__dots {
  position: absolute;
  bottom: 18rpx;
  left: 0;
  width: 100%;
  display: flex;
  gap: 6rpx;
  justify-content: center;
  padding: 6rpx 0;
}

.xl-calendar__dot {
  width: 5rpx;
  height: 5rpx;
  border-radius: 50%;
  &.error {
    background-color: #ff4d4f;
  }
  &.warning {
    background-color: #faad14;
  }
}
</style>

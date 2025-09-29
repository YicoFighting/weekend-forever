<template>
  <view class="xl-calendar">
    <xl-floating-panel v-model:height="height" :anchors="anchors" @heightChange="onHeightChange">
      <text @tap="onYearMonthTap">{{ baseMonth }} 月</text>
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
                :key="`${cell.year}-${cell.month}-${cell.date}-${i}`"
                class="cell"
                :class="{
                  dim: !cell.inCurrentMonth,
                }"
              >
                <view
                  class="cell-date"
                  :class="{
                    today: isToday(cell.year, cell.month, cell.date),
                    selected: isSelected(cell.year, cell.month, cell.date),
                  }"
                  @tap="onCellTap(cell)"
                >
                  {{ cell.date }}
                </view>
                <view v-if="anchorsIndex === 1" class="cell-events"></view>
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

// props：允许父级传入默认的年、月
const props = withDefaults(
  defineProps<{
    year?: number; // 默认：当前年
    month?: number; // 1-12，默认：当前月
    showWeekHeader?: boolean;
  }>(),
  {
    showWeekHeader: true,
  },
);

const emit = defineEmits<{
  (e: 'month-change', payload: { year: number; month: number; direction: 'prev' | 'next' }): void;
  (e: 'cell-tap', payload: { year: number; month: number; day: number }): void;
  (e: 'year-month-tap', payload: { year: number; month: number }): void;
}>();

const weekdayLabels = ['一', '二', '三', '四', '五', '六', '日'];

const height = ref<number>(0);
const windowHeight = ref<number>(0);
const anchorsIndex = ref<number>(0);
const anchors = ref<number[]>([]);

onLoad(() => {
  windowHeight.value = uni.getWindowInfo().windowHeight;
  anchors.value = [Math.round(0.4 * windowHeight.value), Math.round(0.7 * windowHeight.value)];
  height.value = anchors.value[anchorsIndex.value];
});

const onHeightChange = (payload: { height: number; index: number }) => {
  anchorsIndex.value = payload.index;
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

type MonthCells = DayCell[]; // 以 6 行 * 7 列（42 格）为一页

const list = ref<MonthCells[]>([]);

// 选中态（只记录一个日期，可拓展成多选）
const selected = ref<{ year: number; month: number; date: number } | null>(null);

function isToday(y: number, m: number, d: number): boolean {
  const t = new Date();
  return t.getFullYear() === y && t.getMonth() + 1 === m && t.getDate() === d;
}

function isSelected(y: number, m: number, d: number): boolean {
  if (!selected.value) return false;
  const s = selected.value;
  return s.year === y && s.month === m && s.date === d && !isToday(y, m, d);
}

function onCellTap(cell: DayCell) {
  selected.value = { year: cell.year, month: cell.month, date: cell.date };
  emit('cell-tap', { year: cell.year, month: cell.month, day: cell.date });
}

function onYearMonthTap() {
  emit('year-month-tap', { year: baseYear.value, month: baseMonth.value });
}

function shiftYearMonth(y: number, m: number, delta: number): { year: number; month: number } {
  // delta 可为正负，表示偏移多少个月
  let total = y * 12 + (m - 1) + delta; // 归一到 0 基
  const newYear = Math.floor(total / 12);
  const newMonth = (total % 12) + 1;
  return { year: newYear, month: newMonth };
}

function daysInMonth(y: number, m: number): number {
  return new Date(y, m, 0).getDate();
}

function firstDayWeekIndex(y: number, m: number): number {
  // 以周一为 0，周日为 6（便于 7 列布局）
  const jsWeek = new Date(y, m - 1, 1).getDay(); // 0-6，周日-周六
  return (jsWeek + 6) % 7;
}

function buildMonthCells(y: number, m: number): MonthCells {
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
}

// 初始化三槽位列表：prev / current / next
function initList() {
  const prev = shiftYearMonth(baseYear.value, baseMonth.value, -1);
  const next = shiftYearMonth(baseYear.value, baseMonth.value, 1);
  list.value = [
    buildMonthCells(prev.year, prev.month),
    buildMonthCells(baseYear.value, baseMonth.value),
    buildMonthCells(next.year, next.month),
  ];
}

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

const onChange = (e: any) => {
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
.swiper {
  height: 100%;
}
.swiper-item {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.grid {
  flex: 1 0 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 1fr;
  gap: 8rpx;
}
.dim {
  color: #999;
}
.cell {
  display: flex;
  flex-direction: column;
}
.cell-date {
  flex: 1 0 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8rpx;
}
.cell-date.today {
  background: #2a6df5;
  color: #ffffff;
}
.cell-date.selected {
  outline: 2rpx solid #2a6df5;
  outline-offset: -2rpx;
  background: transparent;
  color: inherit;
}
.cell-events {
  height: 60rpx;
}
.xl-calendar__week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  column-gap: 8rpx;
  margin-bottom: 12rpx;
}
.xl-calendar__week-item {
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  color: #808191;
  font-size: 24rpx;
}
</style>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { Solar } from 'lunar-javascript';

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
// 通用：指定任意年月的起始空格
function getLeadingEmptyCount(year: number, monthOneBased: number): number {
  const firstDayJs = new Date(year, monthOneBased - 1, 1).getDay();
  return props.firstDayOfWeek === 1 ? (firstDayJs + 6) % 7 : firstDayJs;
}

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

// 构造指定年月的 cells
function buildCellsFor(year: number, monthOneBased: number): CalendarCell[] {
  const dayCount = getMonthDayCount(year, monthOneBased);
  const lead = getLeadingEmptyCount(year, monthOneBased);
  const used = lead + dayCount;
  const cellsCount = used <= 28 ? 28 : used <= 35 ? 35 : 42;
  const result: CalendarCell[] = Array.from({ length: cellsCount }, () => ({ dayNumber: null }));
  for (let i = 0; i < dayCount; i++) {
    result[lead + i].dayNumber = i + 1;
  }
  return result;
}

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

function buildEventsByDayFor(year: number, monthOneBased: number) {
  const map: Record<number, { events: event[]; status: string[] }> = {};
  (props.events ?? []).forEach((evt) => {
    const d = new Date(evt.date as any);
    if (
      !Number.isNaN(d.getTime()) &&
      d.getFullYear() === year &&
      d.getMonth() + 1 === monthOneBased
    ) {
      const day = d.getDate();
      map[day] = { events: evt.events, status: evt.status };
    }
  });
  return map;
}

// 下滑展开，上滑收起；三屏联动：左右滑动预览并过半屏切换
const isExpanded = ref(false);
let touchStartY = 0;
let lastMoveY = 0;
let touchStartX = 0;
let lastMoveX = 0;
let activeGesture: 'none' | 'horizontal' | 'vertical' = 'none';
const gestureDetectThreshold = 8; // px：判定初始方向

const dragOffsetX = ref(0); // 相对中间面板的水平位移
const isAnimating = ref(false);
const containerWidth = ref(0);
const calendarRef = ref<HTMLElement | null>(null);

onMounted(() => {
  // 计算容器宽度（用于阈值和位移）
  const rect = (calendarRef.value as any)?.getBoundingClientRect?.();
  if (rect?.width) {
    containerWidth.value = rect.width;
  } else if (typeof window !== 'undefined') {
    containerWidth.value = window.innerWidth || 375;
  } else {
    containerWidth.value = 375;
  }
});

function onTouchStart(e: any) {
  const t = e.touches?.[0] || e.changedTouches?.[0];
  touchStartY = t?.clientY ?? 0;
  lastMoveY = touchStartY;
  touchStartX = t?.clientX ?? 0;
  lastMoveX = touchStartX;
  activeGesture = 'none';
  isAnimating.value = false;
  dragOffsetX.value = 0;
}
function onTouchMove(e: any) {
  const t = e.touches?.[0] || e.changedTouches?.[0];
  const currentY = t?.clientY ?? lastMoveY;
  const currentX = t?.clientX ?? lastMoveX;
  const deltaY = currentY - touchStartY;
  const deltaX = currentX - touchStartX;

  if (activeGesture === 'none') {
    if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < gestureDetectThreshold) return;
    activeGesture = Math.abs(deltaX) >= Math.abs(deltaY) ? 'horizontal' : 'vertical';
  }

  if (activeGesture === 'horizontal') {
    const width = containerWidth.value || 0;
    const limited = Math.max(-width, Math.min(width, deltaX));
    dragOffsetX.value = limited;
  } else {
    lastMoveY = currentY;
  }

  lastMoveX = currentX;
}
function onTouchEnd(e: any) {
  const t = e.changedTouches?.[0] || e.touches?.[0];
  const endY = t?.clientY ?? lastMoveY;
  const endX = t?.clientX ?? lastMoveX;
  const deltaY = endY - touchStartY;
  const deltaX = endX - touchStartX;
  const thresholdY = props.expandThreshold; // 纵向展开阈值
  const width = containerWidth.value || 0;

  if (activeGesture === 'horizontal') {
    isAnimating.value = true;
    if (deltaX <= -width / 2) {
      // 切到下一月：动画滑到右侧，再复位并更新月份
      dragOffsetX.value = -width;
      setTimeout(() => {
        isAnimating.value = false;
        dragOffsetX.value = 0;
        onNextMonth();
      }, 250);
    } else if (deltaX >= width / 2) {
      // 切到上一月
      dragOffsetX.value = width;
      setTimeout(() => {
        isAnimating.value = false;
        dragOffsetX.value = 0;
        onPrevMonth();
      }, 250);
    } else {
      // 回弹
      dragOffsetX.value = 0;
      setTimeout(() => {
        isAnimating.value = false;
      }, 250);
    }
    return;
  }

  // 纵向滑动：展开/收起
  if (Math.abs(deltaY) > thresholdY) {
    if (deltaY > 0)
      isExpanded.value = true; // 下滑展开
    else isExpanded.value = false; // 上滑收起
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

function isTodayIn(year: number, monthOneBased: number, day: number | null) {
  if (!day) return false;
  return (
    year === today.getFullYear() &&
    monthOneBased === today.getMonth() + 1 &&
    day === today.getDate()
  );
}

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

// 选中日期默认为当天
const selectDay = ref<string | null>(
  `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
);
// 选中日期对应的农历文本（基于 Intl，尽量输出“干支年 农历八月初八”样式）
const selectedDateObj = computed<Date | null>(() => {
  const v = selectDay.value;
  if (!v) return null;
  const parts = v.split('-').map((n) => parseInt(n, 10));
  if (parts.length !== 3) return null;
  const [y, m, d] = parts;
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
});
function formatChineseDay(dayNum: number): string {
  const dayTexts = [
    '',
    '初一',
    '初二',
    '初三',
    '初四',
    '初五',
    '初六',
    '初七',
    '初八',
    '初九',
    '初十',
    '十一',
    '十二',
    '十三',
    '十四',
    '十五',
    '十六',
    '十七',
    '十八',
    '十九',
    '二十',
    '廿一',
    '廿二',
    '廿三',
    '廿四',
    '廿五',
    '廿六',
    '廿七',
    '廿八',
    '廿九',
    '三十',
  ];
  if (dayNum >= 1 && dayNum <= 30) return dayTexts[dayNum];
  return `${dayNum}`;
}
const intlLunarText = computed(() => {
  const date = selectedDateObj.value;
  if (!date) return '';
  try {
    // zh：拿汉字月份与干支（era）
    const fmtZh = new Intl.DateTimeFormat('zh-CN-u-ca-chinese', {
      month: 'long',
      day: 'numeric',
      era: 'short',
      weekday: undefined,
    } as any);
    const partsZh = (fmtZh.formatToParts(date) as any[]) || [];
    const monthZh = partsZh.find((p: any) => p.type === 'month')?.value ?? '';
    const eraZh = partsZh.find((p: any) => p.type === 'era')?.value ?? '';

    // en：可靠拿到阿拉伯数字的“日”以便转成“初八/廿九”等
    const fmtEn = new Intl.DateTimeFormat('en-u-ca-chinese', {
      day: 'numeric',
    } as any);
    const partsEn = (fmtEn.formatToParts(date) as any[]) || [];
    const dayNumStr = partsEn.find((p: any) => p.type === 'day')?.value ?? '';
    const dayNum = parseInt(dayNumStr, 10);
    const dayCn = Number.isFinite(dayNum) ? formatChineseDay(dayNum) : '';

    if (!monthZh && !dayCn) return '农历信息暂不支持';
    const ganZhi = eraZh ? `${eraZh}年 ` : '';
    return `${ganZhi}农历${monthZh}${dayCn}`;
  } catch (err) {
    return '农历信息暂不支持';
  }
});
// 优先使用 lunar-javascript，失败则回退到 Intl 文案
const lunarText = computed(() => {
  const date = selectedDateObj.value;
  if (!date) return '';
  try {
    const solar = Solar.fromDate(date);
    const lunar = solar.getLunar();
    const gzYear = lunar.getYearInGanZhi?.() || '';
    const shengxiao = lunar.getYearShengXiao?.() || '';
    const gzMonth = (lunar as any)?.getMonthInGanZhi?.() || '';
    const gzDay = (lunar as any)?.getDayInGanZhi?.() || '';
    const monthCn = lunar.getMonthInChinese?.() || '';
    const dayCn = lunar.getDayInChinese?.() || '';

    const parts: string[] = [];
    if (gzYear || shengxiao) parts.push(`${gzYear}${shengxiao}年`.trim());
    if (gzMonth) parts.push(`${gzMonth}月`);
    if (gzDay) parts.push(`${gzDay}日`);
    if (monthCn || dayCn) parts.push(`${monthCn}月${dayCn}`);

    if (parts.length === 0) return intlLunarText.value;
    return parts.join(' ');
  } catch (e) {
    // ignore and fallback
  }
  return intlLunarText.value;
});
const onCellTap = (day: number | null) => {
  if (!day) return;
  emit('cell-tap', { year: viewYear.value, month: viewMonth.value, day });
  selectDay.value = `${viewYear.value}-${viewMonth.value}-${day}`;
};

const onYearMonthTap = () => {
  emit('year-month-tap', { year: viewYear.value, month: viewMonth.value });
};

// 上/下月信息与网格/事件
const prevYM = computed(() => {
  let y = viewYear.value;
  let m = viewMonth.value - 1;
  if (m < 1) {
    m = 12;
    y -= 1;
  }
  return { year: y, month: m };
});
const nextYM = computed(() => {
  let y = viewYear.value;
  let m = viewMonth.value + 1;
  if (m > 12) {
    m = 1;
    y += 1;
  }
  return { year: y, month: m };
});

const prevCells = computed(() => buildCellsFor(prevYM.value.year, prevYM.value.month));
const nextCells = computed(() => buildCellsFor(nextYM.value.year, nextYM.value.month));
const prevEventsByDay = computed(() => buildEventsByDayFor(prevYM.value.year, prevYM.value.month));
const nextEventsByDay = computed(() => buildEventsByDayFor(nextYM.value.year, nextYM.value.month));

const trackTransformStyle = computed(() => {
  const width = containerWidth.value || 0;
  if (!width) {
    return {
      transform: 'translateX(-100%)',
      transition: 'none',
    } as any;
  }
  return {
    transform: `translateX(${-width + dragOffsetX.value}px)`,
    transition: isAnimating.value ? 'transform 250ms ease' : 'none',
  } as any;
});
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
          <view class="xl-calendar__header-year-month" @tap="onYearMonthTap">
            {{ viewMonth }}月
          </view>
        </view>
      </view>
    </slot>

    <view v-if="showWeekHeader" class="xl-calendar__week">
      <view v-for="w in weekdayLabels" :key="w" class="xl-calendar__week-item">{{ w }}</view>
    </view>

    <!-- 三屏联动：左（上月）/中（当月）/右（下月） -->
    <view class="xl-calendar__carousel" ref="calendarRef">
      <view class="xl-calendar__track" :style="trackTransformStyle">
        <!-- 上月 -->
        <view class="xl-calendar__month">
          <view class="xl-calendar__grid" :style="{ gridAutoRows: currentCellHeight + 'rpx' }">
            <view
              v-for="(cell, idx) in prevCells"
              :key="'p-' + idx"
              :class="['xl-calendar__cell', !cell.dayNumber ? 'is-empty' : '']"
              @tap="onCellTap(cell.dayNumber)"
            >
              <template v-if="cell.dayNumber">
                <text
                  :class="{
                    'xl-calendar__day': true,
                    'is-today': isTodayIn(prevYM.year, prevYM.month, cell.dayNumber),
                  }"
                >
                  {{ cell.dayNumber }}
                </text>
                <view class="xl-calendar__events">
                  <slot :isExpanded="isExpanded" :events="prevEventsByDay[cell.dayNumber]">
                    <template v-if="isExpanded">
                      <view
                        v-for="(evt, eidx) in (prevEventsByDay[cell.dayNumber]?.events || []).slice(
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
                          v-for="status in prevEventsByDay[cell.dayNumber]?.status"
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
        </view>

        <!-- 当月 -->
        <view class="xl-calendar__month">
          <view class="xl-calendar__grid" :style="{ gridAutoRows: currentCellHeight + 'rpx' }">
            <view
              v-for="(cell, idx) in cells"
              :key="'c-' + idx"
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
        </view>

        <!-- 下月 -->
        <view class="xl-calendar__month">
          <view class="xl-calendar__grid" :style="{ gridAutoRows: currentCellHeight + 'rpx' }">
            <view
              v-for="(cell, idx) in nextCells"
              :key="'n-' + idx"
              :class="['xl-calendar__cell', !cell.dayNumber ? 'is-empty' : '']"
              @tap="onCellTap(cell.dayNumber)"
            >
              <template v-if="cell.dayNumber">
                <text
                  :class="{
                    'xl-calendar__day': true,
                    'is-today': isTodayIn(nextYM.year, nextYM.month, cell.dayNumber),
                  }"
                >
                  {{ cell.dayNumber }}
                </text>
                <view class="xl-calendar__events">
                  <slot :isExpanded="isExpanded" :events="nextEventsByDay[cell.dayNumber]">
                    <template v-if="isExpanded">
                      <view
                        v-for="(evt, eidx) in (nextEventsByDay[cell.dayNumber]?.events || []).slice(
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
                          v-for="status in nextEventsByDay[cell.dayNumber]?.status"
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
        </view>
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
  <!-- 显示选中日期 selectDay 对应的农历信息 -->
  <view class="xl-calendar__select-day">
    <text>公历：{{ selectDay }}</text>
    <text style="margin-left: 12rpx">{{ lunarText }}</text>
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

/* 三屏联动容器与轨道 */
.xl-calendar__carousel {
  overflow: hidden;
}
.xl-calendar__track {
  display: flex;
  width: 300%;
}
.xl-calendar__month {
  flex: 1 0 0;
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

.xl-calendar__select-day {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 0 16rpx;
  color: #1f2329;
  font-size: 26rpx;
}
</style>

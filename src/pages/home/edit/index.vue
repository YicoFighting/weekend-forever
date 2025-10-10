<template>
  <view class="add h-[100vh] bg-[#f5f5f5]">
    <wd-navbar safeAreaInsetTop :bordered="false">
      <template #left>
        <wd-icon name="close" size="22px" @tap="goBack"></wd-icon>
      </template>
      <template #right>
        <wd-icon name="check" size="22px" @tap="handleSubmit"></wd-icon>
      </template>
    </wd-navbar>
    <h4 class="font-normal pl-[20px] text-[20px] py-[10px]">创建日程</h4>
    <wd-form ref="form" :model="model">
      <wd-card>
        <wd-input prop="title" v-model="model.title" placeholder="请输入日程标题" />
      </wd-card>

      <wd-card>
        <wd-cell-group class="time">
          <wd-cell title="全天事件">
            <wd-switch v-model="model.allDay" size="16px" />
          </wd-cell>
          <wd-cell title="开始时间">
            <wd-datetime-picker v-model="model.startTime" :displayFormat="displayFormat" />
          </wd-cell>
          <wd-cell title="结束时间">
            <wd-datetime-picker v-model="model.endTime" :displayFormat="displayFormat" />
          </wd-cell>
          <wd-cell title="提醒">
            <view @tap="show = true">
              <text>{{ remindText }}</text>
              <wd-icon name="chevron-right" size="16px" color="rgba(0, 0, 0, 0.25)"></wd-icon>
            </view>
          </wd-cell>
        </wd-cell-group>
      </wd-card>

      <wd-card>
        <wd-textarea prop="remark" v-model="model.remark" placeholder="请输入备注" />
      </wd-card>
    </wd-form>

    <!-- 提醒 -->
    <xl-add-item v-model="show" @close="handleClose" />
  </view>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { reactive, ref } from 'vue';
import { onBackPress, onLoad } from '@dcloudio/uni-app';
import type { FormInstance } from 'wot-design-uni/components/wd-form/types';
import type { itemFormType, itemType } from '@/types/item';
import { useGoBack } from '@/composables/useGoBack';

const form = ref<FormInstance>();
const model = reactive<itemFormType>({
  id: '',
  title: '',
  allDay: false,
  startTime: Date.now(),
  endTime: Date.now() + 1 * 60 * 60 * 1000,
  reminds: [],
  remark: '',
});

// 使用 dayjs：YYYY年M月D日 ddd A h:mm -> 2025年10月9日 周四 下午 1:00
type DateTimePickerItems = Record<string, any>[];

const displayFormat = (items: DateTimePickerItems) => {
  const year = Number(items[0]?.label);
  const month = Number(items[1]?.label);
  const day = Number(items[2]?.label);
  const hour24 = Number(items[3]?.label);
  const minute = Number(items[4]?.label);
  const date = new Date(year, month - 1, day, hour24, minute);
  return dayjs(date).format('YYYY年M月D日 ddd A h:mm');
};

// 提醒
const show = ref(false);
const remindText = ref('开始时');
const handleClose = (model: itemType) => {
  console.log(model, 'model');
  if (model.checked) {
    remindText.value = model.reminds
      .map((item) => (item == 0 ? '开始时' : `${item}分钟前`))
      .join('、');
  } else {
    remindText.value = '关闭';
  }
};

// 点击事件
const goBack = () => {
  useGoBack();
};
const handleSubmit = () => {
  console.log(model, 'model');
  useGoBack();
};

onLoad((options: any) => {
  model.title = options?.title || '';
  model.remark = options?.remark || '';
});

// Android 返回键 & 手势返回优先关闭弹框
onBackPress(() => {
  if (show.value) {
    show.value = false;
    return true; // 阻止默认返回上一页
  }
  return false; // 交给系统处理（返回上一页）
});
</script>

<style lang="scss" scoped>
.add {
  :deep(.wd-navbar__content) {
    background-color: #f5f5f5;
  }
  :deep(.wd-input) {
    &::after {
      display: none !important;
    }
  }
  .time {
    :deep(.wd-cell) {
      padding-left: unset;
      .wd-cell__wrapper {
        padding-right: 0;
      }
      .wd-cell__left {
        width: 200rpx;
        flex: unset;
        margin-right: unset;
      }
      .wd-cell__right {
        .wd-cell__wrapper {
          padding: 0;
        }
        .wd-cell__value--left {
          text-align: right;
        }
      }
    }
  }
}
</style>

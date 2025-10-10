<template>
  <wd-popup
    v-model="show"
    safe-area-inset-bottom
    position="right"
    custom-class="remind"
    :mask-closable="false"
    @close="close"
  >
    <view class="remind-content">
      <wd-navbar
        left-arrow
        safeAreaInsetTop
        :bordered="false"
        @click-left="handleClose"
      ></wd-navbar>
      <h4 class="font-normal pl-[20px] text-[20px] py-[10px]">提醒设置</h4>
      <wd-card>
        <wd-cell-group>
          <wd-cell title="提醒">
            <wd-switch v-model="model.checked" size="16px" />
          </wd-cell>
        </wd-cell-group>
      </wd-card>
      <wd-card v-if="model.checked">
        <wd-cell-group>
          <wd-checkbox-group v-model="model.reminds">
            <wd-cell title="开始时">
              <wd-checkbox :modelValue="0"></wd-checkbox>
            </wd-cell>
            <wd-cell title="5分钟前">
              <wd-checkbox :modelValue="5"></wd-checkbox>
            </wd-cell>
            <wd-cell title="10分钟前">
              <wd-checkbox :modelValue="10"></wd-checkbox>
            </wd-cell>
            <wd-cell title="15分钟前">
              <wd-checkbox :modelValue="15"></wd-checkbox>
            </wd-cell>
            <wd-cell title="30分钟前">
              <wd-checkbox :modelValue="30"></wd-checkbox>
            </wd-cell>
            <wd-cell title="1小时前">
              <wd-checkbox :modelValue="60"></wd-checkbox>
            </wd-cell>
            <wd-cell title="1天前">
              <wd-checkbox :modelValue="1440"></wd-checkbox>
            </wd-cell>
            <wd-cell title="2天前">
              <wd-checkbox :modelValue="2880"></wd-checkbox>
            </wd-cell>
            <wd-cell title="1周前">
              <wd-checkbox :modelValue="10080"></wd-checkbox>
            </wd-cell>
            <wd-cell title="自定义" class="diy">
              <wd-input v-model="model.diyRemind" type="number" inputmode="numeric">
                <template #suffix>
                  <view class="flex gap-[10px] ml-[10px]">
                    <text>分钟前</text>
                    <wd-checkbox :modelValue="model.diyRemind"></wd-checkbox>
                  </view>
                </template>
              </wd-input>
            </wd-cell>
          </wd-checkbox-group>
        </wd-cell-group>
      </wd-card>
    </view>
  </wd-popup>
</template>

<script setup lang="ts">
import type { itemType } from '@/types/item';
import { reactive } from 'vue';

const show = defineModel<boolean>('modelValue');
const emit = defineEmits<{
  (e: 'close', model: itemType): void;
}>();

const model = reactive<itemType>({
  checked: true,
  reminds: [0],
  diyRemind: 120,
});

const close = () => {
  emit('close', model);
};

const handleClose = () => {
  show.value = false;
  emit('close', model);
};
</script>

<style lang="scss" scoped>
.remind-content {
  width: 100vw;
  height: 100vh;
  background-color: #f5f5f5;
  :deep(.wd-navbar__content) {
    background-color: #f5f5f5;
  }

  .diy {
    :deep(.uni-input-wrapper) {
      text-align: right;
    }
  }
}
</style>

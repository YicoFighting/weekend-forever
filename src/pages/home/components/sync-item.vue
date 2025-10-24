<template>
  <wd-message-box />
</template>

<script setup lang="ts">
import { useMessage } from 'wot-design-uni';
const message = useMessage();

function beforeConfirm() {
  message
    .confirm({
      msg: '是否删除',
      title: '提示',
    })
    .then(() => {})
    .catch((error) => {
      console.log(error);
    });
}

defineExpose({
  beforeConfirm,
});
</script>

<style lang="scss" scoped></style>

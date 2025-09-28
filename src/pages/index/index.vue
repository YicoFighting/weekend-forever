<template>
  <xl-navbar>
    <wd-button type="primary" class="mt-2 flex justify-center" @click="handleClick">点击我</wd-button>
  </xl-navbar>
</template>

<script setup lang="ts">
import { register } from '@/services/login';

const handleClick = () => {
  register({
    name: 'test',
    email: 'test@test.com',
    password: '123456',
  }).then((res) => {
    console.log(res.code);
    console.log(res.data.token);
    console.log(res.data.user);
    console.log(res.message);
  });
};
</script>

<style scoped lang="scss"></style>

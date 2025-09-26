import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const user = ref<any>({});

    // 保存用户信息，登录时使用
    const setUser = (val: any) => {
      user.value = val;
    };

    // 清理用户信息，退出时使用
    const clearUser = () => {
      user.value = {};
    };

    // 记得 return
    return {
      user,
      setUser,
      clearUser,
    };
  },
  {
    persist: {
      storage: {
        setItem(key, value) {
          uni.setStorageSync(key, value);
        },
        getItem(key) {
          return uni.getStorageSync(key);
        },
      },
    },
  },
);

export const useGoBack = (url?: string) => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 });
  } else if (url) {
    uni.navigateTo({ url });
  } else {
    uni.switchTab({ url: '/pages/home/index' });
  }
};

export const useTabGoBack = (url?: string) => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack({ delta: 1 });
  } else if (url) {
    uni.switchTab({ url });
  } else {
    uni.switchTab({ url: '/pages/home/index' });
  }
};

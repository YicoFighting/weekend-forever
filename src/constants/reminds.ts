export const NO_REMIND = '无提醒';
export const NO_REMIND_VALUE = -1;
export const CUSTOM_REMIND_VALUE = -2;
export const CUSTOM_REMIND_LABEL = '自定义';

export const REMIND_OPTIONS = [
  {
    label: NO_REMIND,
    value: NO_REMIND_VALUE,
  },
  {
    label: '开始时',
    value: 0,
  },
  {
    label: '15分钟前',
    value: 15,
  },
  {
    label: '30分钟前',
    value: 30,
  },
  {
    label: '1小时前',
    value: 60,
  },
  {
    label: '2小时前',
    value: 120,
  },
  {
    label: '1天前',
    value: 1440,
  },
  {
    label: CUSTOM_REMIND_LABEL,
    value: CUSTOM_REMIND_VALUE,
  },
];

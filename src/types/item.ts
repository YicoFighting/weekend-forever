// 时间戳（毫秒）
export type TimestampMs = number;

// 弹窗内部数据模型（提醒设置）
export interface ItemType {
  // checked: boolean;
  // 单位：分钟；0 表示“开始时”
  reminds: number;
  // 自定义提醒分钟数
  diyRemind: number;
}

// 新建/编辑日程的表单数据模型
export interface ItemFormType {
  id?: number | string;
  title: string;
  type: 'duty' | 'other';
  allDay: boolean;
  dates: number[];
  startTime: string; // 毫秒时间戳
  endTime: string; // 毫秒时间戳
  // 单位：分钟；如 0（开始时）、5、10、30、60 等
  remind: number;
  remark: string;
}

// 兼容现有小写命名的导出别名（不改动现有导入处）
export type itemType = ItemType;
export type itemFormType = ItemFormType;

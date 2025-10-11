// ===== H5 <-> APP-PLUS 消息载荷（按需扩展）=====
export type H5GetTokenMessage = {
  action: 'getToken';
};

// 允许保留一些扩展字段，兼容未来更多 action
export type H5Message = H5GetTokenMessage | ({ action: string } & Record<string, unknown>);

// web-view 组件 message 事件的最小事件结构
export interface WebViewMessageDetail<T = any> {
  data: T[];
}

export interface WebViewMessageEvent<T = any> {
  detail: WebViewMessageDetail<T>;
}

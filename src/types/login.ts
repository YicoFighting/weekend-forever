// 注册的参数
export type RegisterParams = {
  name: string;
  email: string;
  password: string;
};

// 注册成功的类型
export type RegisterSuccess = {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  };
  token: string;
};

// ===== 登录相关类型 =====
// 小程序登录参数（通过 code + 用户信息）
export type MiniLoginParams = {
  code: string;
  nickName?: string;
  avatarUrl?: string;
};

// APP 一键登录（univerify）参数
export type AppUniverifyLoginParams = {
  openid: string;
  access_token: string;
};

// 登录成功返回（与注册保持一致，后端统一返回）
export type LoginSuccess = {
  user: {
    id: number;
    name?: string;
    mobile?: string;
    avatar?: string;
    createdAt?: string;
  };
  token: string;
};

// 小程序手机号授权登录参数
export type MiniPhoneLoginParams = {
  // 用于换取 session/openid 的登录 code
  code: string;
  // 新版手机号授权返回的临时 code（detail.code）
  phoneCode?: string;
  // 旧版方案的加密数据
  encryptedData?: string;
  iv?: string;
  nickName?: string;
  avatarUrl?: string;
};

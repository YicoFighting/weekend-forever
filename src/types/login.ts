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
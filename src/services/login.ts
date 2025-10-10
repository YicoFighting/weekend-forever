import type {
  RegisterParams,
  RegisterSuccess,
  MiniLoginParams,
  AppUniverifyLoginParams,
  LoginSuccess,
  MiniPhoneLoginParams,
} from '@/types/login';
import { http } from '@/utils/http';

// 注册
export const register = (data: RegisterParams) => {
  return http<RegisterSuccess>({
    url: '/auth/register',
    method: 'POST',
    data,
  });
};

// 小程序登录
export const miniLogin = (data: MiniLoginParams) => {
  return http<LoginSuccess>({
    url: '/auth/miniapp/login',
    method: 'POST',
    data,
  });
};

// APP 一键登录（univerify）
export const appUniverifyLogin = (data: AppUniverifyLoginParams) => {
  return http<LoginSuccess>({
    url: '/auth/app/univerify',
    method: 'POST',
    data,
  });
};

// 小程序手机号授权登录
export const miniPhoneLogin = (data: MiniPhoneLoginParams) => {
  return http<LoginSuccess>({
    url: '/auth/miniapp/phone-login',
    method: 'POST',
    data,
  });
};

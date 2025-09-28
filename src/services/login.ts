import type { RegisterParams, RegisterSuccess } from "@/types/login";
import { http } from "@/utils/http";

// 注册
export const register = (data: RegisterParams) => {
  return http<RegisterSuccess>({
    url: '/auth/register',
    method: 'POST',
    data,
  });
};

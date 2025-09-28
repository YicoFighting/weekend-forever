import { http } from "@/utils/http";

export const getServiceData = () => {
  return http({
    url: '',
    method: 'GET',
  });
};
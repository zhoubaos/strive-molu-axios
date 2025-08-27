import smAxios, { request } from '../http';

// 重复请求
export const getServer = (data: any) => {
  return request({
    url: '/getApi',
    repeatRequestStrategy: 2,
    data,
    timeout: 1000,
    method: 'post',
    codeMessageMap: {
      ECONNABORTED: '请求超时'
    }
  });
};
// 重复请求1
export const getServerV2 = () => {
  return request({
    url: '/getapi'
    // repeatRequestStrategy: 2
  });
};

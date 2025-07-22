import smAxios, { request } from '../http';

// 重复请求
export const getServer = () => {
  return request({
    url: '/getApi',
    timeout: 10,
    timeoutMessage: '超时'
    // repeatRequestStrategy: 2
  });
};
// 重复请求1
export const getServerV2 = () => {
  return request({
    url: '/getapi'
    // repeatRequestStrategy: 2
  });
};

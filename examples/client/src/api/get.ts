import smAxios, { request } from '../http';

// 重复请求
export const getServer = (data: any) => {
  return request({
    url: '/getApi',
    repeatRequestStrategy: 2,
    data,
    method: 'post',
    compress: true
  });
};
// 重复请求1
export const getServerV2 = () => {
  return request({
    url: '/getapi'
    // repeatRequestStrategy: 2
  });
};

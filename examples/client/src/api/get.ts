import smAxios, { request } from '../http';

// 重复请求
export const getServer = () => {
  return request({
    url: '/getApi'
    // repeatRequestStrategy: 2
  });
};
// 重复请求1
export const getServerV2 = () => {
  return request({
    url: '/getapi'
    // repeatRequestStrategy: 2
  }).catch((err) => {
    console.log(222, err.flag, err.name, err.message, err.config);
  });
};

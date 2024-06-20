import smAxios, { request } from '../http';

// 重复请求
export const getServer = () => {
  return request.get('/getapi', {
    repeatRequestStrategy: true
  });
};
// 重复请求1
export const getServerV2 = () => {
  return smAxios({
    url: '/getapi',
    repeatRequestStrategy: 2
  });
};

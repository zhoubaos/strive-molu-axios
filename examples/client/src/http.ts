import smAxios from 'strive-molu-axios';

export const request = smAxios.create({
  baseURL: '/api',
  // contentType: 'formdata',

  headers: {
    Authorization: 'xxxx token'
  },
  customBridgeErrorMsg(error: any) {
    return '桥接报错';
  },
  customBridgeSuccessData(res: any) {
    return res.data;
  },
  customBridgeSuccess(res: any) {
    return true;
  },
  getSourceError(error: any) {
    console.log('===source error====', error);
  },
  axiosRequestInterceptors: [
    [
      (config: any) => {
        console.log('==请求拦截==');

        return config;
      }
    ]
  ]
});

export default smAxios;

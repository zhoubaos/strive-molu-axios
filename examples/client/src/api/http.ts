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
    // console.log('===source error====', error);
  },
  axiosRequestInterceptors: [
    [
      (config: any) => {
        return config;
      }
    ]
  ]
});

export const uploadFile = smAxios.create({
  baseURL: '/api',
  timeout: 20000,
  retryTimes: 3,
  customBridgeErrorMsg(error: any) {
    return '桥接报错';
  },
  customBridgeSuccessData(res: any) {
    return res.data;
  },
  customBridgeSuccess(res: any) {
    return true;
  }
}).uploadFile;

export default smAxios;

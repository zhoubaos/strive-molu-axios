import smAxios from 'strive-molu-axios';

const request = smAxios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    Authorization: 'xxxx token'
  },
  customBridgeErrorMsg(error) {
    return '桥接报错';
  },
  customBridgeSuccessData(res) {
    return res.data;
  },
  customBridgeSuccess(res) {
    return true;
  }
});

export default request;

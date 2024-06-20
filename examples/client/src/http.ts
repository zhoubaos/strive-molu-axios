import smAxios from 'strive-molu-axios';

export const request = smAxios.create({
  baseURL: '/api',
  timeout: 1000,
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

smAxios.getSourceError = (e) => {
  console.log('==source error===', e);
};

export default smAxios;

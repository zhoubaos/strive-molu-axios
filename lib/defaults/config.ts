import type { DefaultConfig } from '../typescript/options.ts';

const defConfig: Required<DefaultConfig> = {
  baseURL: '/api',
  method: 'get',
  timeout: 1000,
  contentType: 'json',
  retryTimes: 0,
  isCacheResData: false,
  cacheTime: 3600 * 24 * 1,
  repeatRequestStrategy: true,
  headers: {},
  axiosReqConfig: {}
};

export default defConfig;

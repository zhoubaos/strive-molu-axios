import type { RequiredOptions } from '../tyings/options.ts';

const defaults: RequiredOptions = {
  baseURL: '/api',
  method: 'get',
  timeout: 1000,
  contentType: 'json',
  retryTimes: 0,
  isCacheResData: false,
  cacheTime: 3600 * 24 * 1,
  repeatRequestStrategy: true
};

export default defaults;

import { CustomFlagEnum } from '../typescript/error.ts';
import type { DefaultConfig } from '../typescript/options.ts';
import { codeTextMap } from './error.ts';

const defConfig: Required<DefaultConfig> = {
  baseURL: '/api',
  method: 'get',
  timeout: 10000,
  timeoutMessage: codeTextMap[CustomFlagEnum.ECONNABORTED],
  contentType: 'json',
  retryTimes: 0,
  repeatRequestStrategy: 2,
  compress: false,
  headers: {},
  axiosReqConfig: {},
  customBridgeSuccess(res: any): boolean {
    return res?.data?.info == 'Success' && res?.data?.status == 1;
  },
  customBridgeSuccessData(res: any): unknown {
    return res?.data?.data;
  },
  customBridgeErrorMsg(error: any): string {
    return error?.data?.info;
  },
  getSourceError(error: any) {
    //
  },
  axiosRequestInterceptors: [],
  axiosResponseInterceptors: []
};

export default defConfig;

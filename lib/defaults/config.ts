import type { DefaultConfig } from '../typescript/config.ts';

const defConfig: Required<DefaultConfig> = {
  baseURL: '/api',
  method: 'get',
  timeout: 10000,
  contentType: 'json',
  retryTimes: 0,
  repeatRequestStrategy: 2,
  compress: false,
  headers: {},
  codeMessageMap: {},
  axiosReqConfig: {},
  chunkSize: 1048576,
  threadCount: navigator.hardwareConcurrency ? navigator.hardwareConcurrency - 4 : 4,
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

import type { DefaultConfig } from '../typescript/options.ts';

const defConfig: Required<DefaultConfig> = {
  baseURL: '/api',
  method: 'get',
  timeout: 10000,
  contentType: 'json',
  retryTimes: 0,
  repeatRequestStrategy: true,
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
  }
};

export default defConfig;

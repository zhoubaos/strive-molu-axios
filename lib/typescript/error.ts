import { codes } from '../defaults/error.ts';

/**
 * @desc 错误类型
 */
export enum ErrorName {
  AxiosReq = 'AxiosReqError', //axios请求相关错误
  AxiosRes = 'AxiosResError', //axios响应相关错误
  SmAxios = 'SmAxiosError' //该项目的错误
}

export type ErrorConfig<T = any> = {
  /**
   * 错误code
   */
  code?: (typeof codes)[number] | string;
} & Partial<T>;

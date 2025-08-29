import { AxiosError } from 'axios';
import { httpCodes } from '../defaults/error.ts';

/**
 * @desc 错误类型
 */
export enum ErrorNameEnum {
  AxiosReq = 'AxiosReqError', //axios请求相关错误
  AxiosRes = 'AxiosResError', //axios响应相关错误
  SmAxios = 'SmAxiosError' //自定义错误
}

export enum CustomFlagEnum {
  BridgeSuccess = 'BridgeSuccess', // 桥接成功
  UnKnown = 'UnKnown', // 未知错误
  ECONNABORTED = 'ECONNABORTED', // 请求超时
  ERRCANCELED = 'ERRCANCELED', // 手动取消请求
  BridgeError = 'BridgeError', // 接口请求成功，但不满足成功条件
  AxiosReqError = 'AxiosReqError', // Axios请求报错
  AxiosRespError = 'AxiosRespError', // Axios响应报错
  RepeatReq = 'RepeatReq', // 重复请求
  ERR_CANCELED = 'ERR_CANCELED', // 手动取消请求
  NO_FILE = 'NO_FILE', // 没有文件
  FILE_CHUNK_ERROR = 'FILE_CHUNK_ERROR' // 文件分片错误
}

export type FlagKeys = (typeof httpCodes)[number] | CustomFlagEnum;

export type CodeMessageMap = Partial<Record<FlagKeys, string>>;

export type ErrorConfig<T = any> = {
  /**
   * 错误flag
   */
  flag: FlagKeys;
} & Partial<T>;

/**
 * @desc axios响应错误
 */
export type AxiosFlagError = AxiosError & { flag: FlagKeys };

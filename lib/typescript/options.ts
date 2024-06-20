import type { AxiosRequestConfig, AxiosError } from 'axios';
import type { SetRequiredKey } from './utils.ts';
import StriveMoluAxios from '../core/SmAxios.ts';
export type { AxiosRequestConfig };

/**
 * @desc 请求属性配置
 */
export type Config = {
  /**
   * 请求地址
   */
  url?: string;
  /**
   * 请求传参
   */
  data?: any;
  /**
   * 请求方法
   *
   * @default 'get'
   */
  method?: AxiosRequestConfig['method'];
  /**
   * 如果url是一个相对地址会自动添加在url前面
   *
   * @default '/api'
   */
  baseURL?: string;
  /**
   * 接口超时时间，单位ms
   *
   * @default 1000
   */
  timeout?: number;
  /**
   * 请求头`Content-Type`属性的值
   *
   * @default 'json'
   *
   * * json：application/json;charset=UTF-8;
   * * urlencoded：application/x-www-form-urlencoded;charset=UTF-8
   * * formdata：multipart/formdata
   */
  contentType?: 'json' | 'urlencoded' | 'formdata';
  /**
   * 自定义请求头
   *
   * 注意：请求头设置的优先级会低于contentType属性
   */
  headers?: AxiosRequestConfig['headers'];
  /**
   * 接口失败重试次数
   *
   * @default 0
   */
  retryTimes?: number;
  /**
   * 对于重复请求的处理策略
   *
   * * false 允许重复的请求
   * * 1 | true 取消重复的请求，直接抛出重复请求的错误。
   * * 2 取消重复的请求，不会抛出错误，会返回接口数据。
   * @default true
   */
  repeatRequestStrategy?: boolean | 1 | 2;
  /**
   * 用于判断接口是否成功的函数
   *
   * @param `res` axios请求成功返回数据
   */
  customBridgeSuccess?: (res: any) => boolean;
  /**
   * 用于处理`customBridgeSuccess`方法结果为true的情况下的返回结果
   *
   * @param `res` axios请求成功返回数据
   */
  customBridgeSuccessData?: (res: any) => unknown;

  /**
   * 用于获取`customBridgeSuccess`方法结果为false的情况下的打印的错误信息
   * @param error
   * @returns
   */
  customBridgeErrorMsg?: (error: any) => string;
  /**
   * 自定义axios请求配置
   *
   * 注意：如果该配置的属性和Options冲突，会优先使用Option的属性值
   */
  axiosReqConfig?: AxiosRequestConfig;
};
/**
 * @desc 有默认值的请求属性配置
 */
export type DefaultConfig = Omit<Config, 'url' | 'data'>;
/**
 * @desc url必传的配置
 */
export type UrlRequiredConfig = SetRequiredKey<Config, 'url'>;

/**
 * @desc 排除url和method属性的配置
 */
export type OmitUrlMthodConfig = Omit<Config, 'url' | 'method'>;

/**
 * @desc 接口响应数据标签
 */
export type ResFlag = 'BridgeSuccess' | 'BridgeError' | 'ReqError' | 'ResError';

/**
 * @desc axios响应错误
 */
export type AxiosFlagError = AxiosError & { flag?: ResFlag };

/**
 * @desc 创建smAxios实例函数
 */
export type CreateInstance = (config?: DefaultConfig) => SmAxios;

/**
 * @desc smAxios实例
 */
export type SmAxios = {
  create: CreateInstance;
  request: StriveMoluAxios['request'];
  get: StriveMoluAxios['get'];
  post: StriveMoluAxios['post'];
} & ((config?: UrlRequiredConfig) => any);

import type { AxiosRequestConfig, AxiosError } from 'axios';
import type { SetRequiredKey } from './utils.ts';
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
  method?: 'get' | 'post' | 'put' | 'delete';
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
   * 是否缓存接口返回的数据
   *
   * @default false
   */
  isCacheResData?: boolean;
  /**
   * 接口返回数据缓存时间，单位ms
   *
   * @default 3600*24*1（1天）
   */
  cacheTime?: number;
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
 * @desc 配置中url必传
 */
export type UrlRequiredConfig = SetRequiredKey<Config, 'url'>;

/**
 * @desc 接口响应数据标签
 */
export type ResFlag = 'BridgeSuccess' | 'BridgeError' | 'ReqError' | 'ResError';

/**
 * @desc axios响应错误
 */
export type AxiosFlagError = AxiosError & { flag?: ResFlag };

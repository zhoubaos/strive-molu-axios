import type { AxiosRequestConfig, Method, Axios } from 'axios';
import type { SetRequiredKey } from './utils.ts';
import StriveMoluAxios from '../core/SmAxios.ts';
import { CodeMessageMap } from './error.ts';
export type { AxiosRequestConfig };

// 重复请求策略Code
export type RepeatRequestStrategyCode = 0 | 1 | 2 | 3;

export type Params =
  | URLSearchParams
  | string
  | Record<string, string | readonly string[]>
  | Iterable<[string, string]>
  | ReadonlyArray<[string, string]>;

/**
 * @desc 请求属性配置
 */
export type Config = {
  /**
   * 请求地址
   */
  url?: string;
  /**
   * https://axios-http.com/zh/docs/req_config
   * Axios.data 请求传参
   */
  data?: any;
  /**
   * https://axios-http.com/zh/docs/req_config
   * Axios.params 请求参数
   */
  params?: any;
  /**
   * 请求方法
   *
   * @default 'get'
   */
  method?: Method;
  /**
   * 如果url是一个相对地址会自动添加在url前面
   *
   * @default '/api'
   */
  baseURL?: string;
  /**
   * 接口超时时间，单位ms
   *
   * @default 10000
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
   * * 2 取消重复的请求，不会抛出错误，会返回第一次接口的数据。
   * * 3 接口防抖，高频触发的接口，会返回最后一次接口的数据。
   * @default 2
   */
  repeatRequestStrategy?: boolean | RepeatRequestStrategyCode;
  /**
   * code message
   */
  codeMessageMap?: CodeMessageMap;
  /**
   * 请求data参数是否进行gzip压缩
   * 默认添加请求头字段
   * Content-Type:application/gzip;Content-Encoding:gzip
   * @default false
   */
  compress?: boolean;
  /**
   * 文件分片大小（字节）
   * @warn 文件上传使用
   * @default 1048576 (1mb)
   */
  chunkSize?: number;
  /**
   * 文件分片生成MD5线程数
   * @warn 文件上传使用
   * @default navigator.hardwareConcurrency - 4
   */
  threadCount?: number;
  /**
   * 需要上传的文件
   * @warn 文件上传使用
   */
  file?: File;
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
   */
  customBridgeErrorMsg?: (error: any) => string;
  /**
   * 用于打印原始的错误信息
   * @param error
   */
  getSourceError?: (error: any) => void;
  /**
   * 自定义axios请求配置
   *
   * 注意：如果该配置的属性和Options冲突，会优先使用Option的属性值
   */
  axiosReqConfig?: AxiosRequestConfig;
  /**
   * 请求拦截器
   */
  axiosRequestInterceptors?: Array<Parameters<Axios['interceptors']['request']['use']>>;
  /**
   * 响应拦截器
   */
  axiosResponseInterceptors?: Array<Parameters<Axios['interceptors']['response']['use']>>;
};

/**
 * @desc 有默认值的请求属性配置
 */
export type DefaultConfig = Omit<Config, 'url' | 'data' | 'params' | 'file'>;
/**
 * @desc url必传的配置
 */
export type UrlRequiredConfig = SetRequiredKey<Config, 'url'>;

export type MergeRequestConfig = Required<Config> & {
  RepeatRequestStrategy: RepeatRequestStrategyCode;
  Axioskey: string;
  UniqueKey: string;
  completeUrl: string;
};

/**
 * @desc 排除url和method属性的配置
 */
export type OmitUrlMthodConfig = Omit<Config, 'url' | 'method'>;

/**
 * @desc 创建smAxios实例函数
 */
export type CreateInstance = (config: DefaultConfig) => SmAxios;

/**
 * @desc smAxios方法扩展的属性
 */
type ExtendConfig = {
  create: (
    config?: DefaultConfig
  ) => Omit<ExtendConfig, 'create'> & (<T = any>(config?: UrlRequiredConfig) => Promise<T>);
  cancelAllRequesting: StriveMoluAxios['cancelAllRequesting'];
  request: StriveMoluAxios['request'];
  uploadFile: StriveMoluAxios['uploadFile'];
  pauseUpload: StriveMoluAxios['pauseUpload'];
  get: StriveMoluAxios['get'];
  post: StriveMoluAxios['post'];
  setCongfig: StriveMoluAxios['setCongfig'];
  setHeaders: StriveMoluAxios['setHeaders'];
  setTimeouts: StriveMoluAxios['setTimeouts'];
};

/**
 * @desc smAxios实例
 */
export type SmAxios = ExtendConfig & (<T = any>(config?: UrlRequiredConfig) => Promise<T>);

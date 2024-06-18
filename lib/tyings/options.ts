import type { AxiosRequestConfig } from 'axios';

export type { AxiosRequestConfig };

/**
 * @desc 库的请求配置
 */
export type Options = {
  /**
   * 请求地址
   */
  url?: string;
  /**
   * 请求方法
   *
   * @default 'get'
   */
  method?: 'get' | 'post' | 'put' | 'delete';
  /**
   * 请求传参
   */
  data?: any;
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
   * 请求头Content-Type属性的值
   *
   * @default 'json'
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

export type RequiredOptions = Required<
  Pick<
    Options,
    | 'baseURL'
    | 'method'
    | 'timeout'
    | 'contentType'
    | 'retryTimes'
    | 'isCacheResData'
    | 'cacheTime'
    | 'repeatRequestStrategy'
  >
>;

import type { Options, AxiosRequestConfig } from '../tyings/options.ts';
import { Typings } from '../utils/index.ts';
import defaults from '../defaults/index.ts';
import defu from 'defu';

// 适配 axios data 属性的请求方法
const AdaptAxiosDataMethods = ['post', 'put', 'delete', 'patch'];

// 请求头content-type值映射
const contentTypeReflect = {
  urlencoded: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  json: { 'Content-Type': 'application/json;charset=UTF-8' },
  formdata: { 'Content-Type': 'multipart/formdata' }
};
class MergeConfig {
  /**
   *  请求库的属性
   */
  contentType;
  retryTimes;
  isCacheResData;
  cacheTime;
  repeatRequestStrategy;
  /**
   * 可以直接被axios识别的请求属性。
   * 详见：https://axios-http.com/zh/docs/req_config
   */
  axiosReqConfig: AxiosRequestConfig = {};
  constructor(config: Options) {
    this.contentType = config.contentType ?? defaults.contentType;
    this.retryTimes = config.retryTimes ?? defaults.retryTimes;
    this.isCacheResData = config.isCacheResData ?? defaults.isCacheResData;
    this.cacheTime = config.cacheTime ?? defaults.cacheTime;
    this.repeatRequestStrategy = config.repeatRequestStrategy ?? defaults.repeatRequestStrategy;
    this._initAxiosReqConfig(config);
  }
  /**
   * @desc 初始化axios 请求配置参数
   * @param config
   */
  private _initAxiosReqConfig(config: Options) {
    this.axiosReqConfig = {
      ...config.axiosReqConfig,
      url: config.url,
      method: config.method ?? defaults.method,
      baseURL: config.baseURL ?? defaults.baseURL,
      timeout: config.timeout ?? defaults.timeout
    };
    // 适配axios传参
    if (AdaptAxiosDataMethods.includes(this.axiosReqConfig.method as string)) {
      this.axiosReqConfig.data = config.data;
    } else {
      this.axiosReqConfig.params = config.data;
    }

    // 合并axios headers
    this.buildHeaders(config);
  }
  /**
   * @desc 合并axios headers
   * @param config
   */
  private buildHeaders(config: Options) {
    const { headers, axiosReqConfig } = config;

    this.axiosReqConfig.headers = {
      ...(axiosReqConfig?.headers ?? {}),
      ...(headers ?? {}),
      ...contentTypeReflect[this.contentType]
    };
  }
  /**
   * @desc 合并属性
   * @param key
   * @param value
   */
  merge<K extends keyof Options>(key: K, value: Options[K]) {
    if (key !== 'axiosReqConfig') {
      //@ts-ignore
      this[key] = value;
    } else {
    }
  }
}

export default MergeConfig;

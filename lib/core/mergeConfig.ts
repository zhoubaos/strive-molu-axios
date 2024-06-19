import type { Config, DefaultConfig, AxiosRequestConfig } from '../typescript/options.ts';
import { Typings } from '../utils/index.ts';
import defConfig from '../defaults/config.ts';
import { defu } from 'defu';

// 适配 axios data 属性的请求方法
const AdaptAxiosDataMethods = ['post', 'put', 'delete', 'patch'];

// 请求头content-type值映射
const contentTypeReflect = {
  urlencoded: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
  json: { 'Content-Type': 'application/json;charset=UTF-8' },
  formdata: { 'Content-Type': 'multipart/formdata' }
};
class MergeConfig {
  url?: Config['url'];
  data?: Config['data'];
  /**
   *  请求库的属性
   */
  baseURL;
  method;
  timeout;
  contentType;
  retryTimes;
  isCacheResData;
  cacheTime;
  repeatRequestStrategy;
  headers: AxiosRequestConfig['headers'];
  /**
   * 可以直接被axios识别的请求属性。
   * 详见：https://axios-http.com/zh/docs/req_config
   */
  axiosReqConfig;
  constructor(config: DefaultConfig) {
    this.baseURL = config.baseURL ?? defConfig.baseURL;
    this.method = config.method ?? defConfig.method;
    this.timeout = config.timeout ?? defConfig.timeout;
    this.contentType = config.contentType ?? defConfig.contentType;
    this.retryTimes = config.retryTimes ?? defConfig.retryTimes;
    this.isCacheResData = config.isCacheResData ?? defConfig.isCacheResData;
    this.cacheTime = config.cacheTime ?? defConfig.cacheTime;
    this.repeatRequestStrategy = config.repeatRequestStrategy ?? defConfig.repeatRequestStrategy;
    this.headers = config.headers ?? defConfig.headers;
    this.axiosReqConfig = config.axiosReqConfig ?? defConfig.axiosReqConfig;
  }

  /**
   * @desc 获取可以直接用于axios的配置
   */
  get AxiosConfig(): AxiosRequestConfig {
    const aConfig = {
      ...this.axiosReqConfig,
      url: this.url ?? '',
      method: this.method,
      baseURL: this.baseURL,
      timeout: this.timeout
    };
    // 适配axios传参
    if (AdaptAxiosDataMethods.includes(aConfig.method as string)) {
      aConfig.data = this.data;
    } else {
      aConfig.params = this.data;
    }

    // 合并axios headers
    aConfig.headers = {
      ...(aConfig?.headers ?? {}),
      ...this.headers,
      ...(contentTypeReflect[this.contentType] ?? {})
    };

    return aConfig;
  }

  /**
   * @desc 合并配置
   * @param config
   */
  merges(config: Config) {
    for (const [key, value] of Object.entries(config)) {
      this.merge(key as any, value);
    }
  }

  /**
   * @desc 合并配置属性
   * @param key
   * @param value
   */
  merge<K extends keyof Config>(key: K, value: Config[K]) {
    if (key === 'headers') {
      this.headers = Object.assign(this.headers as any, Typings.isObject(value) ? value : {});
    } else if (key === 'axiosReqConfig') {
      this.axiosReqConfig = defu(this.axiosReqConfig, Typings.isObject(value) ? value : {});
    } else {
      //@ts-ignore
      this[key] = value;
    }
  }
}

export default MergeConfig;

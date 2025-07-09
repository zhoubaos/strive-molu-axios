import type { Config, DefaultConfig, AxiosRequestConfig, MergeRequestConfig } from '../typescript/options.ts';
import { Typings } from '../utils/index.ts';
import RequestPool from './RequestPool.ts';
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

/**
 * 合并配置
 */
export function mergeConfig(source: Config, target: Config = {}) {
  function getRepeatReqStrategy(repeatRequestStrategy: Config['repeatRequestStrategy']) {
    let s = 0;
    if (repeatRequestStrategy === false) {
      s = 0;
    } else if (repeatRequestStrategy === true || repeatRequestStrategy === 1) {
      s = 1;
    } else {
      s = 2;
    }
    return s;
  }

  const config = defu(target, source);

  // 归一化RepeatRequestStrategy的值
  Reflect.set(config, 'RepeatRequestStrategy', getRepeatReqStrategy(config.repeatRequestStrategy));

  // 设置唯一key
  Reflect.set(config, 'Axioskey', RequestPool.getConfigKey(config));

  return config as MergeRequestConfig;
}

/**
 * 获取axios需要的配置
 */
export function getAxiosConfig(config: Config) {
  const aConfig = {
    ...config.axiosReqConfig,
    url: config.url ?? '',
    method: config.method,
    baseURL: config.baseURL,
    timeout: config.timeout
  } as Required<AxiosRequestConfig>;
  // 适配axios传参
  if (AdaptAxiosDataMethods.includes(aConfig.method.toLowerCase())) {
    aConfig.data = config.data;
  } else {
    aConfig.params = config.data;
  }

  // 合并axios headers
  aConfig.headers = {
    ...(aConfig?.headers ?? {}),
    ...config.headers,
    ...(contentTypeReflect[config.contentType ?? 'json'] ?? {})
  };

  return aConfig;
}

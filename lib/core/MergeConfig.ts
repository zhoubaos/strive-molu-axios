import type {
  Config,
  AxiosRequestConfig,
  MergeRequestConfig,
  RepeatRequestStrategyCode
} from '../typescript/options.ts';
import { defu } from 'defu';
import { RequestPool } from './RequestPool.ts';
import { randomString } from '../utils/random.ts';
import { gzip } from 'pako';

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
export function mergeConfig<T extends Config>(source: T, target: Partial<Config> = {}) {
  const config = defu(target, source);

  return config;
}

/**
 * 扩展config
 * @param config
 * @returns
 */
export function extendMergeConfig(config: Config): MergeRequestConfig {
  // 设置唯一key
  Reflect.set(config, 'Axioskey', RequestPool.getConfigKey(config));
  Reflect.set(config, 'UniqueKey', randomString());

  // 搜索参数
  const search = new URLSearchParams(config.params).toString();
  Reflect.set(config, 'completeUrl', config.url + (search ? '?' + new URLSearchParams(config.params).toString() : ''));

  // 归一化RepeatRequestStrategy的值
  Reflect.set(config, 'RepeatRequestStrategy', getRepeatReqStrategy(config.repeatRequestStrategy));
  function getRepeatReqStrategy(repeatRequestStrategy: Config['repeatRequestStrategy']) {
    let s = 0;
    if (repeatRequestStrategy === false) {
      s = 0;
    } else if (repeatRequestStrategy === true || repeatRequestStrategy === 1) {
      s = 1;
    } else {
      s = repeatRequestStrategy as number;
    }
    return s as RepeatRequestStrategyCode;
  }

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
    timeout: config.timeout,
    params: config.params,
    data: config.data
  } as Required<AxiosRequestConfig>;

  // 合并axios headers
  aConfig.headers = {
    ...(aConfig?.headers ?? {}),
    ...config.headers,
    ...(contentTypeReflect[config.contentType ?? 'json'] ?? {}),
    ...(config.compress ? { 'Content-Encoding': 'gzip' } : {})
  };

  // 处理请求body参数进行gzip压缩
  if (Object.keys(config.data ?? {}).length > 0 && config.compress) {
    const compressed = gzip(JSON.stringify(config.data));
    const b = new Blob([compressed], { type: 'application/gzip' });
    Reflect.set(aConfig, 'data', b);
    Reflect.set(aConfig, 'headers', { ...aConfig.headers, 'Content-Type': 'application/octet-stream' });
  }

  return aConfig;
}

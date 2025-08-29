import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import {
  Config,
  DefaultConfig,
  UrlRequiredConfig,
  OmitUrlMthodConfig,
  AxiosFlagError,
  MergeRequestConfig,
  AxiosFlagResponse,
  FlagKeys,
  CustomFlagEnum
} from '../typescript';
import { codeMessageMap } from '../defaults/error.ts';
import { getSmError, ErrorNameEnum, SmAxiosError } from './SmAxiosError.ts';
import { deepClone } from '../utils/index.ts';
import { extendMergeConfig, getAxiosConfig, mergeConfig } from './MergeConfig.ts';
import { RequestPool } from './RequestPool.ts';
import { DebouncePool } from './DebouncePool.ts';
import { AbortControllerPool } from './AbortControllerPool.ts';
import EventEmitter from './EventEmitter.ts';
import { cutFile } from './upload/cutFile.ts';
import { createMD5 } from 'hash-wasm';

/**
 * @desc 基于axios的请求库
 */
class StriveMoluAxios {
  private _default: Required<DefaultConfig>;
  /**
   * 用于处理重复请求
   */
  private _reqPool;
  /**
   * 处理防抖请求的缓存池
   */
  private _debouncePool;
  /**
   * 处理重复请求的发布订阅器
   */
  private _evEmitter;
  /**
   * 用于取消正在请求的接口
   */
  private _controllerPool;
  /**
   * axios实例对象
   */
  private _axiosInstance: AxiosInstance;
  constructor(config: Required<DefaultConfig>) {
    this._default = config;
    this._reqPool = new RequestPool();
    this._debouncePool = new DebouncePool();
    this._evEmitter = new EventEmitter();
    this._controllerPool = new AbortControllerPool();
    this._axiosInstance = axios.create(getAxiosConfig(this._default));
    this._bindAxiosInterceptors();
  }

  /**
   * @desc api请求
   * @param config
   */
  async request<T = any>(config: UrlRequiredConfig): Promise<T> {
    // 合并参数
    const _mConfig = extendMergeConfig(mergeConfig(this._default, config));
    const repeatRequestMap = [];

    // 策略模式——0: 允许重复的请求
    repeatRequestMap.push([() => _mConfig.repeatRequestStrategy === 0, () => this._request(_mConfig)]);

    // 策略模式——1: 取消重复的请求，会抛出错误
    repeatRequestMap.push([
      () => _mConfig.repeatRequestStrategy === 1,
      () => {
        if (this._reqPool.isExistKey(_mConfig.Axioskey)) {
          return Promise.reject(getSmError('接口重复请求', { flag: CustomFlagEnum.RepeatReq }));
        } else {
          this._reqPool.add(_mConfig.Axioskey);
          return this._request(_mConfig);
        }
      }
    ]);

    // 策略模式——2：取消重复请求，重复的请求会返回第一次请求的数据。
    repeatRequestMap.push([
      () => _mConfig.repeatRequestStrategy === 2,
      () => {
        if (this._reqPool.isExistKey(_mConfig.Axioskey)) {
          return new Promise((resolve, reject) => {
            this._evEmitter.on(_mConfig.Axioskey, resolve, reject);
          });
        } else {
          this._reqPool.add(_mConfig.Axioskey);
          return this._request(_mConfig);
        }
      }
    ]);

    // 策略模式——3：接口防抖，会返回最后一次接口的数据
    repeatRequestMap.push([
      () => _mConfig.repeatRequestStrategy === 3,
      () => {
        const url = _mConfig.completeUrl;
        if (this._debouncePool.isExistKey(url)) {
          // 取消正在发送的请求
          const axiosKey = this._debouncePool.getKey(url);
          this._controllerPool.abort(axiosKey, '接口防抖');
        }
        this._debouncePool.setKey(url, _mConfig.UniqueKey);
        return this._request(_mConfig);
      }
    ]);

    for (const rule of repeatRequestMap) {
      if (rule[0]()) {
        return rule[1]();
      }
    }

    return this._request(_mConfig);
  }

  /**
   * @desc 上传文件
   * @param config
   */
  async uploadFile<T = any>(config: UrlRequiredConfig) {
    if (!config.file) {
      throw getSmError('请传入文件', { flag: CustomFlagEnum.NO_FILE });
    }
    console.time('cutfile');
    // 合并参数
    const _mConfig = extendMergeConfig(mergeConfig(this._default, config), true);

    const { file, chunkSize, threadCount } = _mConfig;

    // 获取文件所有分片信息
    const chunks = await cutFile(file, chunkSize, threadCount).catch((error) => {
      throw getSmError(error.message, { flag: CustomFlagEnum.FILE_CHUNK_ERROR });
    });
    console.log(chunks);

    console.timeEnd('cutfile');
  }

  /**
   * api 请求
   * @param config
   * @returns
   */
  private _request(config: MergeRequestConfig): any {
    config.retryTimes--;

    const contr = new AbortController();
    //给每个接口添加取消接口请求的标志
    config = mergeConfig(config, {
      axiosReqConfig: {
        signal: contr.signal
      }
    });
    this._controllerPool.add(config.UniqueKey, contr);

    return (this._axiosInstance as AxiosInstance)
      .request(getAxiosConfig(config))
      .then((res: AxiosFlagResponse) => {
        if (config.customBridgeSuccess(res)) {
          res.flag = CustomFlagEnum.BridgeSuccess;
          const resultData = config.customBridgeSuccessData(res);
          if (config.RepeatRequestStrategy === 2) {
            this._evEmitter.emit(config.Axioskey, 'resolve', resultData);
          }
          return resultData;
        } else {
          res.flag = CustomFlagEnum.BridgeError;
          throw res;
        }
      })
      .catch<SmAxiosError>((error: any) => {
        // 重试
        if (config.retryTimes >= 0 && !config.axiosReqConfig.signal?.aborted) {
          return this._request(config);
        } else {
          const e = this._handleAxiosResError(error, config);
          if (config.RepeatRequestStrategy === 2) {
            this._evEmitter.emit(config.Axioskey, 'resolve', e);
          }
          throw e;
        }
      })
      .finally(() => {
        if (config.RepeatRequestStrategy === 1 || config.RepeatRequestStrategy === 2) {
          this._reqPool.remove(config.Axioskey);
        } else if (config.RepeatRequestStrategy === 3 && !config.axiosReqConfig.signal?.aborted) {
          // 防抖接口，最后一次接口删除pool中的key
          this._debouncePool.removeKey(config.completeUrl);
        }
        this._controllerPool.remove(config.UniqueKey);
      });
  }

  /**
   * 暂停上传
   */
  pauseUpload() {}
  /**
   * @desc 处理axios响应报错
   * @param error
   */
  private _handleAxiosResError(error: AxiosFlagError, config: MergeRequestConfig) {
    console.log(error, config);

    config.getSourceError(deepClone(error));
    // 桥架错误
    if (error.flag === CustomFlagEnum.BridgeError) {
      return getSmError(
        ErrorNameEnum.SmAxios,
        config.customBridgeErrorMsg(error) ?? this._getCodeMessage(error.flag, config),
        error
      );
    }
    // axios 请求错误
    else if (error.flag === CustomFlagEnum.AxiosReqError) {
      // @ts-ignore
      return getSmError(ErrorNameEnum.AxiosReq, this._getCodeMessage(error.flag, config), error);
    }
    // axios 响应错误
    else {
      error.flag = ((error.response?.status || error.code) as FlagKeys) ?? CustomFlagEnum.AxiosRespError;
      const cancelReason = (config.axiosReqConfig.signal as AbortSignal).reason;

      const msg = cancelReason ?? this._getCodeMessage(error.flag, config);

      // @ts-ignore
      return getSmError(ErrorNameEnum.AxiosRes, msg, error);
    }
  }
  /**
   * @desc 获取message
   */
  private _getCodeMessage(flag: FlagKeys, config: MergeRequestConfig) {
    return config.codeMessageMap?.[flag] ?? codeMessageMap[flag];
  }

  /**
   * @desc 取消所有正在请求的接口
   * @param reason 取消原因
   */
  cancelAllRequesting(reason?: string) {
    this._controllerPool.abortAll(reason);
    this._reqPool.removeAll();
  }

  /**
   * @desc 提供get请求别名方法
   */
  get<T = any>(url: string, config: OmitUrlMthodConfig = {}) {
    return this.request<T>({
      ...config,
      url,
      method: 'get'
    });
  }
  /**
   * @desc 提供post请求别名方法
   * @param isForm 是否是表单请求
   *
   * * true：`contentType`值为`formdata`
   * * false：`contentType`值为默认值
   */
  post<T = any>(url: string, config: OmitUrlMthodConfig = {}, isForm = true) {
    const mConfig: any = {
      ...config,
      url,
      method: 'post'
    };
    isForm && (mConfig.contentType = 'formdata');
    return this.request<T>(mConfig);
  }

  /**
   * @desc 配置的默认值
   * @param key
   * @param value
   */
  setCongfig<K extends keyof Config>(obj: Config) {
    this._default = mergeConfig(this._default, obj);
  }
  setTimeouts(value: Config['timeout']) {
    this.setCongfig({ timeout: value });
  }
  setHeaders(value: Config['headers']) {
    this.setCongfig({ headers: value });
  }
  /**
   * @desc 给axios实例绑定拦截器
   */
  private _bindAxiosInterceptors() {
    const reqIntercep = [
      [this.axiosRequestInterceptorsSuccess, this.axiosRequestInterceptorsError],
      ...this._default.axiosRequestInterceptors
    ];
    const respIntercep = [
      [this.axiosResponseInterceptorsSuccess, this.axiosResponseInterceptorsError],
      ...this._default.axiosResponseInterceptors
    ];

    // 绑定请求拦截器
    for (const req of reqIntercep) {
      this._axiosInstance.interceptors.request.use(...(req as any));
    }

    // 绑定响应拦截器
    for (const resp of respIntercep) {
      this._axiosInstance.interceptors.response.use(...(resp as any));
    }
  }
  /**
   * @function axios请求拦截器
   */
  axiosRequestInterceptorsSuccess(config: InternalAxiosRequestConfig) {
    return config;
  }

  /**
   * @function axios请求拦截器--请求发生错误
   */
  axiosRequestInterceptorsError(error: AxiosFlagError) {
    error.flag = CustomFlagEnum.AxiosReqError;
    return Promise.reject(error);
  }

  /**
   * @function axios响应拦截器--响应成功，状态码包括2xx和1xx
   */
  axiosResponseInterceptorsSuccess(res: any) {
    return res;
  }

  /**
   * @function axios响应拦截器--响应失败，状态码码在3xx及以上
   */
  axiosResponseInterceptorsError(error: AxiosFlagError) {
    error.flag = CustomFlagEnum.AxiosRespError;
    return Promise.reject(error);
  }
}

export default StriveMoluAxios;

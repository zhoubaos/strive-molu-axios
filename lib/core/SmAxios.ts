import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type {
  Config,
  DefaultConfig,
  UrlRequiredConfig,
  OmitUrlMthodConfig,
  ResFlag,
  AxiosFlagError,
  MergeRequestConfig
} from '../typescript/options.ts';
import { prsetCodeToText } from '../defaults/error.ts';
import { getSmError, ErrorName } from './SmAxiosError.ts';
import { deepClone } from '../utils/index.ts';
import { getAxiosConfig, mergeConfig } from './MergeConfig.ts';
import RequestPool from './RequestPool.ts';
import { AbortControllerPool } from './AbortControllerPool.ts';
import EventEmitter from './EventEmitter.ts';

/**
 * @desc 基于axios的请求库
 */
class StriveMoluAxios {
  private _default: Required<DefaultConfig>;
  /**
   * 用于记录真在请求的接口
   */
  private _reqPool;
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
    this._evEmitter = new EventEmitter();
    this._controllerPool = new AbortControllerPool();
    this._axiosInstance = axios.create(getAxiosConfig(this._default));
    this._bindAxiosInterceptors();
  }

  /**
   * @desc 请求方法
   * @param config
   */
  async request<T = any>(config: UrlRequiredConfig): Promise<T> {
    const _mConfig = mergeConfig(this._default, config);

    // 设置唯一key
    Reflect.set(_mConfig, 'Axioskey', RequestPool.getConfigKey(config));

    if (_mConfig.RepeatRequestStrategy == 0) return this._request(_mConfig);
    else {
      if (this._reqPool.isExistKey(_mConfig.Axioskey)) {
        // 重复的接口直接返回
        if (_mConfig.RepeatRequestStrategy === 1) {
          return Promise.reject(getSmError('接口重复请求'));
        } else {
          // 重复的接口通过发布-订阅模式返回数据
          return new Promise((resolve, reject) => {
            this._evEmitter.on(_mConfig.Axioskey, resolve, reject);
          });
        }
      } else {
        this._reqPool.add(_mConfig.Axioskey);
        return this._request(_mConfig);
      }
    }
  }

  private _request(config: MergeRequestConfig): any {
    config.retryTimes--;

    const contr = new AbortController();
    //给每个接口添加取消接口请求的标志
    config = mergeConfig(config, {
      axiosReqConfig: {
        signal: contr.signal
      }
    });
    this._controllerPool.add(config.Axioskey, contr);

    return (this._axiosInstance as AxiosInstance)
      .request(getAxiosConfig(config))
      .then((res: AxiosResponse & { flag?: ResFlag }) => {
        if (config.customBridgeSuccess(res)) {
          res.flag = 'BridgeSuccess';
          const resultData = config.customBridgeSuccessData(res);
          if (config.RepeatRequestStrategy === 2) {
            this._evEmitter.emit(config.Axioskey, 'resolve', resultData);
          }
          return resultData;
        } else {
          res.flag = 'BridgeError';
          throw res;
        }
      })
      .catch((error: any) => {
        if (config.retryTimes >= 0) {
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
        config.RepeatRequestStrategy != 0 && this._reqPool.remove(config.Axioskey);
        this._controllerPool.remove(config.Axioskey);
      });
  }

  /**
   * @desc 处理axios响应报错
   * @param error
   */
  private _handleAxiosResError(error: AxiosFlagError, config: MergeRequestConfig) {
    config.getSourceError(deepClone(error));
    if (error.flag === 'BridgeError') {
      error.code = 'BridgeError';
      return getSmError(ErrorName.SmAxios, config.customBridgeErrorMsg(error) ?? prsetCodeToText['BridgeError'], error);
    }
    // axios 请求报错
    else if (error.flag === 'ReqError') {
      error.code = error.code ?? 'ReqError';
      // @ts-ignore
      return getSmError(ErrorName.AxiosReq, prsetCodeToText[error.code ?? 'UnKnown'], error);
    }
    // axios 响应报错
    else {
      error.code = (error.code as string) ?? 'ResError';
      const cancelReason = (config.axiosReqConfig.signal as AbortSignal).reason;
      const msg = cancelReason ?? prsetCodeToText[(error?.response?.status as number) ?? error.code ?? 'UnKnown'];
      // @ts-ignore
      return getSmError(ErrorName.AxiosRes, msg, error);
    }
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
    error.flag = 'ReqError';
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
    error.flag = 'ResError';
    return Promise.reject(error);
  }
}

export default StriveMoluAxios;

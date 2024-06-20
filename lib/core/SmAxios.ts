import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type {
  Config,
  DefaultConfig,
  UrlRequiredConfig,
  OmitUrlMthodConfig,
  ResFlag,
  AxiosFlagError
} from '../typescript/options.ts';
import { prsetCodeToText } from '../defaults/error.ts';
import { getSmError, ErrorName } from './SmAxiosError.ts';
import MergeConfig from './MergeConfig.ts';
import RequestPool from './RequestPool.ts';
import EventEmitter from './EventEmitter.ts';

class StriveMoluAxios {
  /**
   * 合并的配置对象
   */
  private _mConfig;
  /**
   * 用于记录真在请求的接口
   */
  private _reqPool;
  /**
   * 处理重复请求的发布订阅器
   */
  private _evEmitter;
  /**
   * axios实例对象
   */
  private _axiosInstance: AxiosInstance;
  constructor(config: DefaultConfig = {}) {
    this._mConfig = new MergeConfig(config);
    this._reqPool = new RequestPool();
    this._evEmitter = new EventEmitter();
    this._axiosInstance = axios.create(this._mConfig.AxiosConfig);
    this._bindAxiosInterceptors();
  }

  /**
   * @desc 请求方法
   * @param config
   */
  async request(config: UrlRequiredConfig) {
    // 合并传入的配置
    this._mConfig.merges(config);
    if (this._mConfig.RepeatReqStrategy === 0) return this._request();
    else {
      if (this._reqPool.isExistKey(this._mConfig.Axioskey)) {
        if (this._mConfig.RepeatReqStrategy === 1) {
          return Promise.reject(getSmError('接口重复请求'));
        } else {
          return new Promise((resolve, reject) => {
            this._evEmitter.on(this._mConfig.Axioskey, resolve, reject);
          })
            .then((res) => {
              return res;
            })
            .catch((e) => {
              throw e;
            });
        }
      } else {
        this._reqPool.add(this._mConfig.AxiosConfig);
        return this._request();
      }
    }
  }

  private _request(): any {
    this._mConfig.retryTimes--;
    return (this._axiosInstance as AxiosInstance)
      .request(this._mConfig.AxiosConfig)
      .then((res: AxiosResponse & { flag?: ResFlag }) => {
        if (this._mConfig.customBridgeSuccess(res)) {
          res.flag = 'BridgeSuccess';
          const resultData = this._mConfig.customBridgeSuccessData(res);
          if (this._mConfig.RepeatReqStrategy === 2) {
            this._evEmitter.emit(this._mConfig.Axioskey, 'resolve', resultData);
          }
          return resultData;
        } else {
          res.flag = 'BridgeError';
          throw res;
        }
      })
      .catch((error: any) => {
        if (this._mConfig.retryTimes >= 0) {
          return this._request();
        } else {
          const e = this._handleAxiosResError(error);
          if (this._mConfig.RepeatReqStrategy === 2) {
            this._evEmitter.emit(this._mConfig.Axioskey, 'resolve', e);
          }
          throw e;
        }
      })
      .finally(() => {
        this._mConfig.RepeatReqStrategy !== 0 && this._reqPool.remove(this._mConfig.AxiosConfig);
      });
  }

  /**
   * @desc 处理axios响应报错
   * @param error
   */
  private _handleAxiosResError(error: AxiosFlagError) {
    this.getSourceError(error);
    if (error.flag === 'BridgeError') {
      error.code = 'BridgeError';
      return getSmError(
        ErrorName.SmAxios,
        this._mConfig.customBridgeErrorMsg(error) ?? prsetCodeToText['BridgeError'],
        error
      );
    }
    // axios 请求报错
    else if (error.flag === 'ReqError') {
      error.code = error.code ?? 'ReqError';
      // @ts-ignore
      return getSmError(ErrorName.AxiosReq, prsetCodeToText[error.code] ?? prsetCodeToText['UnKnown'], error);
    }
    // axios 响应报错
    else {
      error.code = 'ResError';
      // @ts-ignore
      return getSmError(ErrorName.AxiosRes, prsetCodeToText[error.status] ?? prsetCodeToText['ResError'], error);
    }
  }

  /**
   * @desc 获取原始报错信息
   * @param error
   */
  getSourceError(error: unknown) {
    //
  }
  /**
   * @desc 提供get请求别名方法
   */
  get(url: string, config: OmitUrlMthodConfig) {
    return this.request({
      ...config,
      url,
      method: 'get'
    });
  }
  /**
   * @desc 提供post请求别名方法
   * @param isForm
   *
   * * true：`contentType`值为`formdata`
   * * false：`contentType`值为默认值
   */
  post(url: string, config: OmitUrlMthodConfig, isForm = true) {
    const mConfig = {
      ...config,
      url,
      method: 'post'
    };
    isForm && (mConfig.contentType = 'formdata');
    return this.request(mConfig);
  }

  /**
   * @desc 配置的默认值
   * @param key
   * @param value
   */
  setCongfig<K extends keyof Config>(key: K, value: Config[K]) {
    this._mConfig.merge(key, value);
  }
  setTimeouts(value: Config['timeout']) {
    this.setCongfig('timeout', value);
  }
  setHeaders(value: Config['headers']) {
    this.setCongfig('headers', value);
  }
  /**
   * @desc 给axios实例绑定拦截器
   */
  private _bindAxiosInterceptors() {
    this._axiosInstance.interceptors.request.use(
      this.axiosRequestInterceptorsSuccess,
      this.axiosRequestInterceptorsError
    );
    this._axiosInstance.interceptors.response.use(
      this.axiosResponseInterceptorsSuccess,
      this.axiosResponseInterceptorsError
    );
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

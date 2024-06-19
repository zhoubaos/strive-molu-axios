import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import type { Config, DefaultConfig, UrlRequiredConfig, ResFlag, AxiosFlagError } from '../typescript/options.ts';
import { prsetCodeToText } from '../defaults/error.ts';
import { getSmError, ErrorName } from './SmAxiosError.ts';
import MergeConfig from './MergeConfig.ts';
import RequestPool from './RequestPool.ts';

class StriveMoluAxios {
  private _sourceConfig;
  /**
   * 合并的配置对象
   */
  private _mConfig;
  /**
   * 用于记录真在请求的接口
   */
  private _ReqPool;
  /**
   * axios实例对象
   */
  private _axiosInstance: AxiosInstance;
  constructor(config: DefaultConfig = {}) {
    this._sourceConfig = config;
    this._mConfig = new MergeConfig(config);
    this._ReqPool = new RequestPool();
    this._axiosInstance = axios.create(this._mConfig.AxiosConfig);
    this._bindAxiosInterceptors();
  }

  /**
   * @desc 请求方法
   * @param config
   */
  request(config: UrlRequiredConfig) {
    // 合并传入的配置
    this._mConfig.merges(config);

    return this._request();
  }

  private _request(): any {
    this._mConfig.retryTimes--;
    return (this._axiosInstance as AxiosInstance)
      .request(this._mConfig.AxiosConfig)
      .then((res: AxiosResponse & { flag?: ResFlag }) => {
        if (this.customBridgeSuccess(res)) {
          res.flag = 'BridgeSuccess';
          return this.customResSuccessData(res);
        } else {
          res.flag = 'BridgeError';
          throw res;
        }
      })
      .catch((error: any) => {
        if (this._mConfig.retryTimes >= 0) {
          return this._request();
        } else {
          throw this._handleAxiosResError(error);
        }
      })
      .finally(() => {
        this._ReqPool.remove(this._sourceConfig);
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
      return getSmError(ErrorName.SmAxios, this.customBridgeErrorMsg(error) ?? prsetCodeToText['BridgeError'], error);
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
   * @desc 判断接口是否请求成功
   * @param res
   */
  customBridgeSuccess(res: any): boolean {
    return res?.data?.info == 'Success' && res?.data?.sttatus == 1;
  }

  /**
   * @desc 自定义接口成功返回的数据
   * @param res
   */
  customResSuccessData(res: any): unknown {
    return res?.data?.data;
  }

  /**
   * @desc 自定义接口失败返回错误
   * @param error
   * @returns
   */
  customBridgeErrorMsg(error: any): string {
    return error?.data?.info ?? prsetCodeToText['UnKnown'];
  }
  /**
   * @desc 获取原始报错信息
   * @param error
   */
  getSourceError(error: unknown) {
    //
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

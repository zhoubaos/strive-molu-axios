import type { AxiosRequestConfig } from '../typescript/options.ts';
import { Typings } from '../utils/typings.ts';
import { Md5 } from 'ts-md5';

class RequestPool {
  /**
   * api 请求池
   */
  pool: Set<string>;
  /**
   * 已完成请求的api，延迟退出请求池的时间
   */
  delayTime: number;

  constructor(delay = 200) {
    this.pool = new Set();
    this.delayTime = delay;
  }

  /**
   * @desc 添加接口
   * @param config
   */
  add(c: AxiosRequestConfig | string) {
    const key = Typings.isString(c) ? c : RequestPool.getConfigKey(c);
    if (!this.pool.has(key)) {
      this.pool.add(key);
    }
  }

  /**
   * @desc 移除接口
   * @param config
   */
  remove(c: AxiosRequestConfig | string) {
    const key = Typings.isString(c) ? c : RequestPool.getConfigKey(c);
    setTimeout(() => {
      this.pool.delete(key);
    }, this.delayTime);
  }

  /**
   * @desc 判断接口是否存在
   * @param config
   */
  has(c: AxiosRequestConfig | string) {
    const key = Typings.isString(c) ? c : RequestPool.getConfigKey(c);
    return this.isExistKey(key);
  }

  /**
   * @desc 判断是否有相同的请求
   * @param config
   * @returns
   */
  isExistKey(key: string) {
    return this.pool.has(key);
  }

  /**
   * @desc 根据对象获取唯一的key
   * @param config
   * @returns
   */
  static getConfigKey<T extends object>(config: T) {
    const str = this._transformObjValuesToStr(config);
    return Md5.hashStr(str);
  }

  /**
   * @function 把目标对象内的所有值转为字符串
   * @param target
   * @returns
   */
  private static _transformObjValuesToStr<T extends object>(target: T) {
    if (!Typings.isObject(target)) return target + '&';
    let str = '';
    let aStr: any = null;
    if (Array.isArray(target)) {
      aStr = target;
    } else {
      aStr = Object.values(target);
    }

    aStr.forEach((item: any) => {
      str += this._transformObjValuesToStr(item);
    });
    return str;
  }
}

export default RequestPool;

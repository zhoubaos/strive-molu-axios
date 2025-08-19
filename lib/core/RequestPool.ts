import type { AxiosRequestConfig } from '../typescript/options.ts';
import { Typings } from '../utils/typings.ts';
import { Md5 } from 'ts-md5';

/**
 * @desc 请求池
 * 处理repeatRequestStrategy 为 1 | 2 的逻辑
 */
export class RequestPool {
  /**
   * api 请求池，保存每次请求参数删生成的唯一key
   */
  _pool: Set<string>;

  /**
   * 已完成请求的api，延迟退出请求池的时间
   */
  delayTime: number;

  constructor(delay = 200) {
    this._pool = new Set();
    this.delayTime = delay;
  }

  /**
   * @desc 添加唯一key
   * @param config
   */
  add(c: AxiosRequestConfig | string) {
    const key = Typings.isString(c) ? c : RequestPool.getConfigKey(c);
    if (!this._pool.has(key)) {
      this._pool.add(key);
    }
  }

  /**
   * @desc 移除唯一key
   * @param config
   */
  remove(c: AxiosRequestConfig | string) {
    const key = Typings.isString(c) ? c : RequestPool.getConfigKey(c);
    setTimeout(() => {
      this._pool.delete(key);
    }, this.delayTime);
  }

  /**
   * @des 移除所有接口
   */
  removeAll() {
    setTimeout(() => {
      this._pool.clear();
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
    return this._pool.has(key);
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

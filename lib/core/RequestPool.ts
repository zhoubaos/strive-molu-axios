import type { Config } from '../typescript/options.ts';
import { Typings } from '../utils/typings.ts';
import { Md5 } from 'ts-md5';

class RequestPool {
  /**
   * api 请求池
   */
  pool: Map<any, any>;
  /**
   * 已完成请求的api，延迟退出请求池的时间
   */
  delayTime: number;

  constructor(delay = 200) {
    this.pool = new Map();
    this.delayTime = delay;
  }

  /**
   * @desc 添加接口
   * @param config
   */
  add(config: Config) {
    const key = this.getConfigKey(config);
    if (!this.pool.has(key)) {
      this.pool.set(key, config);
    }
  }

  /**
   * @desc 移除接口
   * @param config
   */
  remove(config: Config) {
    const key = this.getConfigKey(config);
    setTimeout(() => {
      this.pool.delete(key);
    }, this.delayTime);
  }

  /**
   * @desc 判断是否有相同的请求
   * @param config
   * @returns
   */
  isExistReq(config: Config) {
    const key = this.getConfigKey(config); //获取请求参数唯一key
    return this.pool.has(key);
  }

  /**
   * @desc 获取api的key
   * @param config
   * @returns
   */
  private getConfigKey(config: Config) {
    const str = this._transformObjValuesToStr(config);
    return Md5.hashStr(str);
  }

  /**
   * @function 把目标对象内的所有值转为字符串
   * @param target
   * @returns
   */
  private _transformObjValuesToStr<T extends object>(target: T) {
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

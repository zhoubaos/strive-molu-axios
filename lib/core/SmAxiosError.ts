import { ErrorName, type ErrorConfig } from '../tyings/error.ts';
import { Typings } from '../utils/index.ts';

class SmAxiosError extends Error {
  /**
   * 错误类型
   */
  name;
  /**
   * 错误code 包含接口请求错误status
   */
  code: ErrorConfig['code'] = 'UNKNOWN';
  config: Record<string, any> = {};
  constructor(name: ErrorName, message: string, config?: ErrorConfig) {
    super(message);
    this.name = name;
    config && this._setConfig(config);
  }
  /**
   * @desc 设置
   * @param config
   */
  private _setConfig(config: ErrorConfig) {
    this.code = config.code || 'UNKNOWN';
    if (Typings.isObject(config)) {
      this.config = {
        ...config
      };
    }
  }
  /**
   * @desc 自定义对象转
   * @returns
   */
  toString() {
    let basic = `${this.name} [${this.code}]: ${this.message}`;
    if (this.config && Object.keys(this.config).length) {
      basic += `\n${this.config}`;
    }
    return basic;
  }
}

export function getSmError(message: string): SmAxiosError;
export function getSmError(name: ErrorName, message: string): SmAxiosError;
export function getSmError(message: string, config: ErrorConfig): SmAxiosError;
export function getSmError(name: ErrorName, message: string, config: ErrorConfig): SmAxiosError;
/**
 * @desc 返回错误信息
 * @param a
 * @param b
 * @param c
 * @returns
 */
export function getSmError(a: ErrorName | string, b?: string | ErrorConfig, c?: ErrorConfig) {
  let argLen = arguments.length;
  let err: SmAxiosError | null = null;
  if (argLen === 1) {
    err = new SmAxiosError(ErrorName.SmAxios, a);
  } else if (argLen === 2) {
    if (Typings.isString(a) && Typings.isString(b)) {
      err = new SmAxiosError(a as ErrorName, b);
    } else {
      err = new SmAxiosError(ErrorName.SmAxios, a, b as ErrorConfig);
    }
  } else {
    err = new SmAxiosError(a as ErrorName, b as string, c);
  }
  return err;
}

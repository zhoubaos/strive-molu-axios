import { ErrorName, type ErrorConfig } from '../typescript/error.ts';
import { Typings } from '../utils/index.ts';

export { ErrorName } from '../typescript/error.ts';

export class SmAxiosError<Config = any> extends Error {
  /**
   * 错误类型
   */
  name;
  /**
   * 错误code 包含接口请求错误status
   */
  code: ErrorConfig['code'] = 'UnKnown';
  config: ErrorConfig<Config>;
  constructor(name: ErrorName, message: string, config?: ErrorConfig<Config>) {
    super(message);
    this.name = name;
    this.config = config ?? {};
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
export function getSmError<Config = any>(message: string, config: ErrorConfig<Config>): SmAxiosError<Config>;
export function getSmError<Config = any>(
  name: ErrorName,
  message: string,
  config: ErrorConfig<Config>
): SmAxiosError<Config>;
/**
 * @desc 返回错误信息
 * @param a
 * @param b
 * @param c
 * @returns
 */
export function getSmError<Config extends object>(
  a: ErrorName | string,
  b?: string | ErrorConfig<Config>,
  c?: ErrorConfig<Config>
) {
  const argLen = arguments.length;
  let err: SmAxiosError<Config> | null = null;
  if (argLen === 1) {
    err = new SmAxiosError<Config>(ErrorName.SmAxios, a);
  } else if (argLen === 2) {
    if (Typings.isString(a) && Typings.isString(b)) {
      err = new SmAxiosError(a as ErrorName, b);
    } else {
      err = new SmAxiosError<Config>(ErrorName.SmAxios, a, b as ErrorConfig);
    }
  } else {
    err = new SmAxiosError<Config>(a as ErrorName, b as string, c);
  }
  return err;
}

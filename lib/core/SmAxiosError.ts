import { ErrorName, type ErrorConfig } from '../typescript/error.ts';
import { Typings } from '../utils/index.ts';

export { ErrorName } from '../typescript/error.ts';

export class SmAxiosError<Config = any> extends Error {
  /**
   * 错误类型
   */
  name;
  msg;
  config: ErrorConfig<Config>;
  constructor(name: ErrorName, message: string, config?: ErrorConfig<Config>) {
    super(`[${config?.code ?? 'UnKnown'}] ${message}`);
    this.name = name;
    this.msg = message;
    this.config = config ?? {};
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

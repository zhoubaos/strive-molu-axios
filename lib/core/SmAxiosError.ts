import { ErrorNameEnum, FlagKeys, type ErrorConfig } from '../typescript/error.ts';
import { Typings } from '../utils/index.ts';

export { ErrorNameEnum } from '../typescript/error.ts';

/**
 * @desc 请求库错误处理
 */
export class SmAxiosError<Config = any> extends Error {
  /**
   * 错误类型
   */
  flag: FlagKeys;
  name;
  message;
  /**
   * axios和该库返回的错误原始信息
   */
  config: ErrorConfig<Config>;
  constructor(name: ErrorNameEnum, message: string, config?: ErrorConfig<Config>) {
    const flag = (config?.flag ?? 'UnKnown') as FlagKeys;
    super(`[${flag}] ${message}`);
    this.flag = flag;
    this.name = name;
    this.message = message;
    this.config =
      config ??
      ({
        flag
      } as any);
  }
}

export function getSmError(message: string): SmAxiosError;
export function getSmError(name: ErrorNameEnum, message: string): SmAxiosError;
export function getSmError<Config = any>(message: string, config: ErrorConfig<Config>): SmAxiosError<Config>;
export function getSmError<Config = any>(
  name: ErrorNameEnum,
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
  a: ErrorNameEnum | string,
  b?: string | ErrorConfig<Config>,
  c?: ErrorConfig<Config>
) {
  const argLen = arguments.length;
  let err: SmAxiosError<Config> | null = null;
  if (argLen === 1) {
    err = new SmAxiosError<Config>(ErrorNameEnum.SmAxios, a);
  } else if (argLen === 2) {
    if (Typings.isString(a) && Typings.isString(b)) {
      err = new SmAxiosError(a as ErrorNameEnum, b);
    } else {
      err = new SmAxiosError<Config>(ErrorNameEnum.SmAxios, a, b as ErrorConfig);
    }
  } else {
    err = new SmAxiosError<Config>(a as ErrorNameEnum, b as string, c);
  }
  return err;
}

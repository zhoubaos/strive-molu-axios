import axios from 'axios';
import type { Options } from '../tyings/options.ts';
import { getSmError } from './SmAxiosError.ts';
import MergeConfig from './mergeConfig.ts';

class StriveMoluAxios {
  private mConfig;
  constructor(config: Options = {}) {
    this.mConfig = new MergeConfig(config);
  }
  /**
   * @desc 设置axios配置的默认值
   * @param key
   * @param value
   */
  setDefaults<K extends keyof Options>(key: K, value: Options[K]) {
    // this.mConfig = new MergeConfig();
    this.mConfig.merge(key, value);
  }
  setTimeouts(value: Options['timeout']) {
    this.setDefaults('timeout', value);
  }
  setHeaders(value: Options['headers']) {
    this.setDefaults('headers', value);
  }
}

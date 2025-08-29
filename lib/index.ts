import { mergeConfig } from './core/MergeConfig.ts';
import StriveMoluAxios from './core/SmAxios.ts';
import type { SmAxios, CreateInstance } from './typescript/config.ts';
import defConfig from './defaults/config.ts';
import { bind, extend } from './utils/index.ts';
const createInstance: CreateInstance = function (config: any) {
  // 如果不传或传个空对象，采用默认配置
  const context = new StriveMoluAxios(config);
  const instance = bind<SmAxios>(StriveMoluAxios.prototype.request, context);

  // 复制 StriveMoluAxios 原型中方法给instance
  extend(instance, StriveMoluAxios.prototype, context, true);

  // 复制实例属性给instance方法
  extend(instance, context, null, true);

  instance.create = function (config) {
    return createInstance(mergeConfig(defConfig, config));
  };

  return instance;
};

const smAxios = createInstance(defConfig);

export * from './typescript/index.ts';
export default smAxios;

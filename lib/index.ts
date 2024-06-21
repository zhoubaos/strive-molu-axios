import StriveMoluAxios from './core/SmAxios.ts';
import type { SmAxios, CreateInstance } from './typescript/options.ts';
import { bind, extend } from './utils/index.ts';

const createInstance: CreateInstance = function (config) {
  const context = new StriveMoluAxios(config);
  const instance = bind<SmAxios>(StriveMoluAxios.prototype.request, context);

  // 复制 StriveMoluAxios 原型中方法给instance
  extend(instance, StriveMoluAxios.prototype, context, true);

  // 复制实例属性给instance方法
  extend(instance, context, null, true);

  instance.create = function (config) {
    return createInstance(config);
  };

  return instance;
};

const smAxios = createInstance();

export * from './typescript/options.ts';
export default smAxios;

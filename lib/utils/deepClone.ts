import { Typings } from './typings.ts';
/**
 * @desc 深拷贝对象(支持拷贝属性的描述符)
 * @param target 目标对象
 * @param cache 用于缓存已经拷贝完成的对象，方便处理循环引用的情况
 * @returns
 */
export const deepClone = (target: any, cache = new WeakMap()): any => {
  if (!Typings.isObject(target) && !Typings.isArray(target)) return target;
  if (target instanceof Date) return new Date(target);
  if (target instanceof RegExp) return new RegExp(target);
  if (cache.get(target) === null) return cache.get(target);

  const copyTarget: any = Array.isArray(target) ? [] : {};
  cache.set(target, null); //对于循环引用的值设置为null

  if (Typings.isArray(target)) {
    for (const item of target) {
      copyTarget.push(deepClone(item, cache));
    }
  } else {
    Reflect.ownKeys(target).forEach((key) => {
      copyTarget[key] = deepClone(target[key as string], cache);
      Object.defineProperty(copyTarget, key, {
        //拷贝属性的描述符
        configurable: Object.getOwnPropertyDescriptor(target, key)?.configurable,
        enumerable: Object.getOwnPropertyDescriptor(target, key)?.enumerable,
        writable: Object.getOwnPropertyDescriptor(target, key)?.writable
      });
    });
  }

  return copyTarget;
};

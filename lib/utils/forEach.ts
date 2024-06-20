import { Typings } from './typings.ts';

/**
 * 循环一个数组或一个对象的key和value
 *
 * @param target 数组或对象
 * @param fn
 * @param allOwnKeys
 *
 * * true：遍历obj所有的属性（不包括属性为Symbol数据类型）
 * * false: 输出obj可被遍历的属性
 */
export function forEach<T = Array<any> | Record<string, any>>(
  target: T,
  fn: (value: any, key: T extends Array<any> ? number : string, context: T) => void,
  allOwnKeys = false
) {
  if (!Typings.isObject(target)) return;

  if (Typings.isArray(target)) {
    for (let i = 0; i < target.length; i++) {
      fn.call(null, target[i], i as any, target);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(target) : Object.keys(target as object);
    let key = '';
    for (let i = 0; i < keys.length; i++) {
      key = keys[i];
      fn.call(null, (target as Record<string, any>)[key], key as any, target);
    }
  }
}

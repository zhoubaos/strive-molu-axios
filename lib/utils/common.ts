/**
 * @desc js函数重载器
 * @returns
 */
export function createOverload() {
  const fnMap = new Map();
  function overload(...args: any[]) {
    const key = args.map((i) => typeof i).join(',');
    const fn = fnMap.get(key);
    if (!fn) {
      throw new TypeError('没有找到对应的实现');
    }
    // @ts-ignore
    return fn.apply(this, args);
  }

  overload.addImpl = function (...args: any[]) {
    const fn = args.pop();
    if (typeof fn !== 'function') {
      throw new TypeError('最后一个参数必须是函数');
    }
    const key = args.join(',');
    fnMap.set(key, fn);
  };
  return overload;
}

/**
 * @desc 柯里化函数
 * @param fn
 * @param length
 * @returns
 */
export function currying<T extends (...args: any[]) => any>(
  fn: T,
  length?: number
): (...args: Partial<Parameters<T>>) => any {
  length = length || fn.length;
  return function (...args) {
    // @ts-ignore
    return args.length >= length ? fn.apply(this, args) : currying(fn.bind(this, ...args), length - args.length);
  };
}

export function bind<T extends () => any>(fn: (...args: any[]) => any, context: any) {
  return function wrap(...args: any[]) {
    return fn.apply(context, args);
  } as T;
}

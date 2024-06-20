export function bind<T extends () => any>(fn: (...args: any[]) => any, context: any) {
  return function wrap() {
    return fn.apply(context, Array.from(arguments));
  } as T;
}

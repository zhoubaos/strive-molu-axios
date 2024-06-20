/**
 * 让接口的某一下属性变为必须项
 */
export type SetRequiredKey<T, K extends keyof T> = T & { [P in K]-?: T[P] };

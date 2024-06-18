const isUndefined = (val: any): val is undefined => val === undefined;
const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
const isNumber = (val: any): val is number => typeof val === 'number';
const isString = (val: any): val is string => typeof val === 'string';

const { isArray } = Array;
const isObject = (thing: any) => thing !== null && typeof thing === 'object';

export const Typings = {
  isUndefined,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isObject
};

import { Typings } from './typings.ts';
import { forEach } from './forEach.ts';
import { bind } from './bind.ts';

/**
 * 复制target的内容到source
 * @param source
 * @param target
 * @param context
 * @param allOwnKeys
 */
export function extend(source: Record<any, any>, target: Record<any, any>, context: object | null, allOwnKeys = false) {
  forEach(
    [target],
    (val, key) => {
      if (context && Typings.isFunction(val)) {
        source[key] = bind(val, context);
      } else {
        source[key] = val;
      }
    },
    allOwnKeys
  );
  return source;
}

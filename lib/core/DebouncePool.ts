/**
 * 对接口进行防抖处理
 */
export class DebouncePool {
  private _pool: Record<string, string> = {};

  setKey(url: string, key: string) {
    this._pool[url] = key;
  }

  removeKey(url: string) {
    Reflect.deleteProperty(this._pool, url);
  }

  getKey(url: string) {
    return this._pool[url];
  }

  isExistKey(url: string) {
    return !!this._pool[url];
  }
}

export class AbortControllerPool {
  private _pool: Record<string, AbortController> = {};

  add(key: string, controller: AbortController) {
    Reflect.set(this._pool, key, controller);
  }
  remove(key: string) {
    Reflect.deleteProperty(this._pool, key);
  }

  abort(key: string, reason?: string) {
    if (!this._pool[key]) {
      return;
    }

    this._pool[key].abort(reason);
    this.remove(key);
  }
  abortAll(reason?: string) {
    Object.entries(this._pool).forEach(([key, controller]) => {
      controller.abort(reason);
    });
    this._pool = {};
  }
}

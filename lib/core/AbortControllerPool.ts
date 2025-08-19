export class AbortControllerPool {
  private _pool: Map<string, AbortController> = new Map();

  add(key: string, controller: AbortController) {
    this._pool.set(key, controller);
  }
  remove(key: string) {
    this._pool.delete(key);
  }

  abort(key: string, reason?: string) {
    if (this._pool.has(key)) {
      this._pool.get(key)?.abort(reason);
      this.remove(key);
    }
  }
  abortAll(reason?: string) {
    this._pool.forEach((controller) => controller.abort(reason));
    this._pool.clear();
  }
}

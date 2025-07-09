export class AbortControllerPool {
  private _pool: Map<string, AbortController> = new Map();

  add(key: string, controller: AbortController) {
    this._pool.set(key, controller);
  }
  remove(key: string) {
    this._pool.delete(key);
  }
  abortAll(reason?: string) {
    this._pool.forEach((controller) => controller.abort(reason));
  }
}

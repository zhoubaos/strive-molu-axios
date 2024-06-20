/**
 * @desc 接口请求发布-订阅
 */
class EventEmitter {
  events;

  constructor() {
    this.events = Object.create(null);
  }
  /**
   * @desc 发布事件
   * @param event
   * @param res 响应结果
   * @param type 响应类型
   */
  emit<T = any>(event: string, type: 'resolve' | 'reject', res: T) {
    if (!this._hasEvent(event)) return;

    for (const cbArr of this.events[event]) {
      if (type == 'resolve') {
        cbArr[0](res);
      } else {
        cbArr[1](res);
      }
    }
  }

  /**
   * @desc 订阅事件
   * @param event
   * @param callback
   */
  on(event: string, cbRes: (...args: any[]) => unknown, cbRej: (...args: any[]) => unknown) {
    if (!this._hasEvent(event)) {
      this.events[event] = [];
    }
    this.events[event].push([cbRes, cbRej]);
  }

  /**
   * @desc 移除事件
   * @param event
   * @param callback
   */
  off(event: string, cbRes: (...args: any[]) => unknown, cbRej: (...args: any[]) => unknown) {
    if (!this._hasEvent(event)) return;
    if (this._hasEvent(event)) {
      const cbArr = this.events[event];
      for (let i = 0; i < cbArr.length; i++) {
        if (cbArr[i][0] === cbRes && cbArr[i][1] === cbRej) {
          cbArr.splice(i, 1);
          break;
        }
      }
    }
  }

  /**
   * @desc 判断是否有该事件
   * @param event
   * @returns
   */
  private _hasEvent(event: string) {
    return Reflect.has(this.events, event);
  }
}

export default EventEmitter;

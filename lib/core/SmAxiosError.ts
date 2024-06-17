import { ErrorTypeName, type ErrorConfig } from '../tyings/error.ts';

class SmAxiosError {
  /**
   * 错误信息
   */
  message: string;
  /**
   * 错误类型
   */
  name = ErrorTypeName.SmAxios;
  /**
   * 错误code 包含接口请求错误status
   */
  code?: ErrorConfig['code'];
  constructor(name: ErrorTypeName, message: string, config?: ErrorConfig) {
    this.message = message;
    this.name = name;

    config && this._setConfig(config);
  }

  _setConfig(config: ErrorConfig) {
    this.code = config.code || 99;
  }

  /**
   * code对应的message
   * @param code
   * @returns
   */
  static codeMessage(code: ErrorConfig['code']) {
    let errMessage = '';
    switch (code) {
      case 400:
        errMessage = '错误的请求';
        break;
      case 401:
        errMessage = '未授权，请重新登录';
        break;
      case 403:
        errMessage = '拒绝访问';
        break;
      case 404:
        errMessage = '请求错误,未找到该资源';
        break;
      case 405:
        errMessage = '请求方法未允许';
        break;
      case 408:
        errMessage = '请求超时';
        break;
      case 500:
        errMessage = '服务器端出错';
        break;
      case 501:
        errMessage = '网络未实现';
        break;
      case 502:
        errMessage = '网络错误';
        break;
      case 503:
        errMessage = '服务不可用';
        break;
      case 504:
        errMessage = '网络超时';
        break;
      case 505:
        errMessage = 'http版本不支持该请求';
        break;
      case 99:
        errMessage = '常用错误';
        break;
      case 'ECONNABORTED':
        errMessage = '请求超时';
        break;
      default:
        errMessage = `未知错误 --${code}`;
    }
    return errMessage;
  }
}

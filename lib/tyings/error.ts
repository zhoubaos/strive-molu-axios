/**
 * @desc 错误类型
 */
export enum ErrorName {
  AxiosReq = 'AxiosReqError', //axios请求相关错误
  AxiosRes = 'AxiosResError', //axios响应相关错误
  SmAxios = 'SmAxiosError' //该项目的错误
}
/**
 * @desc 错误状态码
 */
export const codes = [400, 401, 403, 404, 405, 429, 500, 501, 502, 503, 504, 505, 'ECONNABORTED', 'UNKNOWN'] as const;
/**
 * @desc 状态码对应的预设文本
 */
export const prsetCodeToText: Record<(typeof codes)[number] | number, string> = {
  400: '错误的请求',
  401: '未授权，请重新登录',
  403: '服务器拒绝访问',
  404: '请求资源不存在',
  405: '请求方法未允许',
  429: '请求频率过高',
  500: '服务器端出错',
  501: '服务器不支持请求',
  502: '网络错误',
  503: '服务器过载',
  504: '网络超时',
  505: 'http版本不支持该请求',
  UNKNOWN: '未知错误',
  ECONNABORTED: '请求时间超过TimeOut时间'
};

export type ErrorConfig = {
  /**
   * 错误code
   */
  code?: (typeof codes)[number];
} & Record<string, any>;

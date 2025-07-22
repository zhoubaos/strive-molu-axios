import { FlagKeys, CustomFlagEnum } from '../typescript/error.ts';

/**
 * @desc 错误状态码
 */
export const httpCodes = [400, 401, 403, 404, 405, 429, 500, 501, 502, 503, 504, 505] as const;

/**
 * @desc 状态码对应的预设文本
 */
export const codeTextMap: Record<FlagKeys, string> = {
  400: '错误的请求',
  401: '未授权，请重新登录',
  403: '服务器拒绝访问',
  404: '请求资源不存在',
  405: '请求方法未允许',
  429: '请求频率过高',
  500: '服务器端报错',
  501: '服务器不支持请求',
  502: '网络错误',
  503: '服务器过载',
  504: '网络超时',
  505: 'http版本不支持该请求',
  [CustomFlagEnum.BridgeSuccess]: '桥接成功',
  [CustomFlagEnum.UnKnown]: '未知错误',
  [CustomFlagEnum.ECONNABORTED]: '请求超时，请稍后再试',
  [CustomFlagEnum.ERRCANCELED]: '手动取消请求',
  [CustomFlagEnum.BridgeError]: '桥接失败',
  [CustomFlagEnum.AxiosReqError]: 'Axios请求报错',
  [CustomFlagEnum.AxiosRespError]: 'Axios响应报错',
  [CustomFlagEnum.RepeatReq]: '重复请求'
} as const;

/**
 * @desc 错误类型
 */
export enum ErrorTypeName {
  Axios_Req = 'AxiosReqError', //axios请求相关错误
  Axios_Res = 'AxiosResError', //axios响应相关错误
  SmAxios = 'SmAxiosError' //本项目的错误
}

export type Code = [400, 401, 403, 404, 405, 408, 500, 501, 502, 503, 504, 505, 'ECONNABORTED', 99];

export type ErrorConfig = {
  /**
   * 错误code
   */
  code: Code[number];
};

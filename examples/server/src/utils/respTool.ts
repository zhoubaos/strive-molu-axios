import { Response } from 'express';

/**
 * 成功响应
 * @param res
 * @param data
 */
export function successResp(res: Response, data: any) {
  res.json({
    code: 0,
    data,
    message: 'success'
  });
}

/**
 * 失败响应
 */
export function failResp(res: Response, message: string) {
  res.status(200).json({
    code: 1,
    message: message
  });
}

/**
 * 错误响应
 * @param res
 * @param error
 */
export function errorResp(res: Response, error: any) {
  res.status(error.statusCode || 500).json({
    code: -1,
    message: error.message || '服务器内部错误'
  });
}

import { Request, Response, NextFunction } from 'express';
import { errorResp } from '../utils/respTool';
// 自定义错误接口
interface AppError extends Error {
  statusCode?: number;
}

// 错误处理中间件
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  // 日志记录错误
  console.error(err.stack || err.message);

  errorResp(res, err);
};

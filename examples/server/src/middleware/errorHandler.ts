import { Request, Response, NextFunction } from 'express';
// 自定义错误接口
interface AppError extends Error {
  statusCode?: number;
}

// 错误处理中间件
export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  // 日志记录错误
  console.error(err.stack || err.message);

  // 确定HTTP状态码，默认为500
  const statusCode = err.statusCode || 500;

  // 开发环境返回详细错误信息，生产环境返回简化信息
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    message: err.message || '服务器内部错误',
    ...(isProduction ? {} : { stack: err.stack })
  });
};

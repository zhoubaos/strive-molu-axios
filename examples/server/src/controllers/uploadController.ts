import { Request, Response, NextFunction } from 'express';
import * as uploadService from '../services/uploadService';
import { successResp } from '../utils/respTool';

export const getTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await uploadService.getTest();
    res.json(result);
  } catch (error) {
    next(error);
  }
};
/**
 * 初始化文件上传
 * @param req
 * @param res
 * @param next
 */
export const createUpload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await uploadService.createUpload(req.body);
    successResp(res, result);
  } catch (error) {
    next(error);
  }
};

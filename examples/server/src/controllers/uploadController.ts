import { Request, Response, NextFunction } from 'express';
import * as uploadService from '../services/uploadService';

export const getTest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await uploadService.getTest();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

import { AxiosResponse } from 'axios';
import { FlagKeys } from './error';

export type AxiosFlagResponse = AxiosResponse & { flag?: FlagKeys };

// 文件chunk
export type Chunk = {
  /**
   * chunk内容
   */
  chunk: Blob;
  /**
   * chunk大小
   */
  size: number;
  /**
   * chunk md5
   */
  md5: string;
  /**
   * file开始索引
   */
  start: number;
  /**
   * file中结束索引
   */
  end: number;
  /**
   * chunk索引
   */
  index: number;
};

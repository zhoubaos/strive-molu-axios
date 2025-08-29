import { AxiosResponse } from 'axios';
import { FlagKeys } from './error';

export type AxiosFlagResponse = AxiosResponse & { flag?: FlagKeys };

// 文件chunk
export type Chunk = {
  /**
   * chunk blob
   */
  chunk: Blob;
  /**
   * chunk md5
   */
  md5: string;
  /**
   * file中开始索引
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
  /**
   * chunk数量
   */
  total: number;
};

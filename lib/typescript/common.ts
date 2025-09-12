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
// uploadInit 函数参数
export type FileInitConfig = {
  /**
   * 文件
   */
  file: File;
  /**
   * 文件hash值
   */
  fileMd5: string;
  /**
   * 分片大小
   */
  chunkSize: number;
  /**
   * 分片数量
   */
  chunkCount: number;
  /**
   * 分片信息
   */
  chunks: Chunk[];
};

/**
 * 上传进度
 */
export type UploadProgress = {
  /**
   * 已上传分片
   */
  uploaded: number;
  /**
   * 总分片数
   */
  total: number;
  /**
   * 上传进度百分比
   */
  percent: number;
};

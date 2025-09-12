import { createMD5 } from 'hash-wasm';
import { Chunk, CustomFlagEnum } from '../typescript';
import { getSmError } from '../core/SmAxiosError';
/**
 * 获取文件md5值
 * @param chunks
 */
export async function generateFileMd5(chunks: Chunk[]) {
  try {
    const m = await createMD5();
    m.init();
    for (let i = 0; i < chunks.length; i++) {
      m.update(chunks[i].md5);
    }
    return m.digest('hex');
  } catch (error: any) {
    throw getSmError(error.message, { flag: CustomFlagEnum.GEN_FILE_MD5_ERROR });
  }
}

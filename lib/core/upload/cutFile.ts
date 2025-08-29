import { Chunk } from '../../typescript';

/**
 * 处理文件分片
 * @param file
 * @param chunkSize
 */
export async function cutFile(file: File, chunkSize: number, threadCount: number) {
  return new Promise<Chunk[]>((resolve, reject) => {
    // 分片数量
    const chunkCount = Math.ceil(file.size / chunkSize);
    // 每个线程处理分片数量
    const threadChunkCount = Math.ceil(chunkCount / threadCount);

    // 每个线程处理的分片结果
    const chunksList: Chunk[][] = [];
    let finishedCount = 0;

    for (let i = 0; i < threadCount; i++) {
      // 每个线程分配任务

      const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
      // 分片起始下标
      const start = i * threadChunkCount;
      // 分片结束下标
      const end = Math.min((i + 1) * threadChunkCount, chunkCount);

      worker.postMessage({
        file,
        start,
        end,
        chunkSize
      });
      worker.onmessage = (e) => {
        worker.terminate();
        chunksList[i] = e.data;
        finishedCount++;

        if (finishedCount === threadCount) {
          resolve(chunksList.flat());
        }
      };
      worker.onerror = (e) => {
        worker.terminate();
        reject(new Error('文件分片失败'));
      };
    }
  });
}

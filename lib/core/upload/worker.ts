import { createMD5 } from 'hash-wasm';
import { createChunk } from './createChunk';

self.onmessage = async (e) => {
  const { file, start, end, chunkSize } = e.data;
  const chunksAsync = [];
  // 计算chunk md5
  const md5 = await createMD5();
  for (let i = start; i < end; i++) {
    const c = createChunk(file, i, chunkSize, md5);
    chunksAsync.push(c);
  }
  const chunks = await Promise.all(chunksAsync);
  self.postMessage(chunks);
};

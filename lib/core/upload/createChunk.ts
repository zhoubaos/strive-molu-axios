import { createMD5, IHasher } from 'hash-wasm';

export async function createChunk(file: File, index: number, chunkSize: number, md5: IHasher) {
  const start = index * chunkSize;
  const end = Math.min(start + chunkSize, file.size);

  const blob = file.slice(start, end);

  const arrayBuffer = await blob.arrayBuffer();

  md5.init();
  md5.update(new Uint8Array(arrayBuffer));

  return {
    chunk: blob,
    md5: md5.digest('hex'),
    start,
    end,
    index
  };
}

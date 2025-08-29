/**
 * 处理文件分片
 * @param file
 * @param size
 */
export function cutFile(file: File, size: number) {
  // 分片数量
  const chunkCount = Math.ceil(file.size / size);
}

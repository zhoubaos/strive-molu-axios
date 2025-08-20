/**
 * 生成12为随机字符串
 */
export function randomString() {
  return Math.random().toString(36).substring(2, 12);
}

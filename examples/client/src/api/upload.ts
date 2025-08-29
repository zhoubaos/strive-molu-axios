import { uploadFile } from './http';

export const upload = async (file: File) => {
  return uploadFile({
    url: '/upload',
    file,
    chunkSize: 1024 * 1024 * 10
  });
};

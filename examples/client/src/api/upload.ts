import { uploadFile } from './http';

export const upload = async (file: File) => {
  return uploadFile({
    url: '/upload',
    file,
    chunked: false,
    threadCount: 6,
    chunkSize: Math.ceil(file.size / 20)
  });
};

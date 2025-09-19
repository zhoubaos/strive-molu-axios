import { uploadFile } from './http';

export const upload = async (file: File) => {
  return uploadFile({
    url: '/api/upload/chunks',
    file,
    chunked: true,
    threadCount: 6,
    chunkSize: Math.ceil(file.size / 20),
    uploadInit: async (config) => {
      return Promise.resolve({
        fileMd5: 'fileMd5'
      });
    },
    setUploadData: (chunk, fileMd5, initRes?: any) => {
      return {
        fileMd5,
        chunk: chunk.chunk,
        chunkIndex: chunk.index,
        chunkSize: chunk.size,
        chunkTotal: chunk.index
      };
    }
  });
};

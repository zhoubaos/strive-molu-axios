import localforage from 'localforage';
function db(config: Pick<LocalForageOptions, 'name' | 'description'>) {
  return localforage.createInstance({
    driver: localforage.INDEXEDDB,
    name: 'strive-molu-axios',
    version: 1.0,
    ...config
  });
}

export const fileDb = db({
  name: 'fileDb',
  description: '文件blob缓存'
});

export const chunkDb = db({
  name: 'chunkDb',
  description: '分片缓存'
});

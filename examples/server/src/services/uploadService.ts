import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { failResp } from '../utils/respTool';

// 测试
export const getTest = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM test');
    return rows;
  } catch (error) {
    throw error || '数据库查询失败';
  }
};

// 上传文件唯一ID并初始化数据库记录
export const createUpload = async (data: any) => {
  const { fileName, fileSize, fileMd5, fileType, chunkTotal } = data;
  if (!fileName || !fileSize || !chunkTotal || !fileMd5) {
    throw new Error('缺少必要参数');
  }

  try {
    const fileId = uuidv4();

    const connection = await pool.getConnection();

    await connection.execute(
      'INSERT INTO files (file_id, file_name, file_size, file_md5, file_type, chunk_total ) VALUES (?, ?, ?, ?, ?)',
      [fileId, fileName, fileSize, fileMd5, fileType || '', chunkTotal]
    );

    connection.release();

    return {
      fileId
    };
  } catch (error) {
    throw error || '数据库操作失败';
  }
};

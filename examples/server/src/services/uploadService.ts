import pool from '../config/database';

// 测试
export const getTest = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM test');
    return rows;
  } catch (error) {
    throw error || '数据库查询失败';
  }
};

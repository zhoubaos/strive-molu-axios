import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// 配置数据库连接
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 创建数据库连接池
const pool: Pool = mysql.createPool(dbConfig);

// 测试数据库连接
const testDbConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.info('数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
};

// 初始化数据库连接
testDbConnection();

export default pool;

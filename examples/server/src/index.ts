import express, { Express } from 'express';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import uploadRoutes from './routes/uploadRoutes';
import testRoutes from './routes/test';

// 加载环境变量
dotenv.config();

// 创建Express应用
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // JSON解析
app.use(express.urlencoded({ extended: true })); // 表单数据解析

// 路由
app.use('/api/upload', uploadRoutes);
app.use('/api/test', testRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// 错误处理中间件
app.use(errorHandler);

// 启动服务器
app.listen(port, () => {
  console.info(`服务器运行在 http://localhost:${port}`);
});

export default app;

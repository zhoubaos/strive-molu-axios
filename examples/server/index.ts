import http from 'http';
import getFun from './get';
import querystring from 'querystring';
// function pipeFileToResponse(res, file, type) {
//   if (type) {
//     res.writeHead(200, {
//       'Content-Type': type
//     });
//   }
// }

const server = http.createServer();

server.on('request', function (req, res) {
  if (req.method === 'POST') {
    let body = '';

    // 监听数据传输事件，拼接请求体
    req.on('data', (chunk) => {
      body += chunk;
    });

    // 数据传输完成后解析
    req.on('end', () => {
      // 解析表单格式数据（如 name=张三&age=20）
      const postParams = querystring.parse(body);
      console.log('POST 参数（表单格式）：', postParams);
    });
  }

  const method = req.method?.toLowerCase();
  if (method == 'get') {
    getFun(req, res);
  } else if (method == 'post') {
    //
  }
});

server.listen(3000, () => {
  console.log(`Examples running on ${3000}`);
});

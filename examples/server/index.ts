import http from 'http';
import getFun from './get';
// function pipeFileToResponse(res, file, type) {
//   if (type) {
//     res.writeHead(200, {
//       'Content-Type': type
//     });
//   }
// }

const server = http.createServer();

server.on('request', function (req, res) {
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

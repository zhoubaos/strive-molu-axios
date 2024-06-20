import http from 'http';

const server = http.createServer((req, res) => {
  const url = req.url;
  console.log(url);
});

server.listen(3000, () => {
  console.log(`Examples running on ${3000}`);
});

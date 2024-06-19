import type { ServerResponse } from 'http';

const people = [
  {
    id: 1,
    name: '张三',
    age: 20
  },
  {
    id: 2,
    name: '李四',
    age: 30
  }
];

export default function (req, res: ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/json'
  });
  // res.write(JSON.stringify(people));
  res.end();
}

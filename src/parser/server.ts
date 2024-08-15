import express from 'express';
import parse from './parser';
import type { BabelFileResult } from '@babel/core'
const app = express();

// 启用JSON解析（如果需要）
app.use(express.json());

// 启用URL编码的表单数据解析
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
  const body = req.body;
  // const collection: Map<string, Promise<BabelFileResult | null>> = new Map()
  const tasks: Record<string, Promise<BabelFileResult | null>> = {}

  Object.keys(body).forEach((key) => {
    tasks[key] = parse(body[key])
  })
  await Promise.all(Object.values(tasks))

  const result: Map<string, string> = new Map()
  for (const [key, value] of Object.entries(tasks)) {
    const parseResult = await value
    // console.log(parseResult?.code);
    result.set(key, parseResult ? parseResult.code! : '')
  }
  await res.send(Object.fromEntries(result.entries()))
});

const port = 3000;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

import path from 'path'
// const a = path.extname('C:\\temp\\myfile.html');
console.log(__dirname, __filename);
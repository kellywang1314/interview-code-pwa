# Promise 题库扩充设计

## 目标

将源目录
`https://github.com/kellywang1314/sourceCode/tree/master/webpack/src/js/promise`
下的 13 个文件完整映射到 JavaScript / Promise 分类，确保 Promise 核心实现和并发控制可在目录中直接看到。

## 迁移范围

采用“一份源文件对应一个目录条目”的方式，共 13 个条目：

| 源文件 | 目录条目 ID | 状态 |
| --- | --- | --- |
| `promise.js` | `promise-core` | 已有，补强为完整链式实现 |
| `promiseAll.js` | `promise-all` | 已有 |
| `promiseRace.js` | `promise-race` | 已有 |
| `promiseResolve.js` | `promise-resolve` | 已有 |
| `promise.finally.js` | `promise-finally` | 已有 |
| `limitPromsie.js` | `promise-concurrency-limit` | 已有 |
| `promise.reTry.js` | `promise-retry` | 已有 |
| `promsie串行.js` | `promise-serial` | 已有 |
| `onLoadIamge.js` | `promise-image-loader` | 新增 |
| `promsieAjax.js` | `promise-ajax` | 新增 |
| `promsie输出面试题.js` | `promise-output-order` | 新增 |
| `red-green-yellow.js` | `promise-traffic-light` | 新增 |
| `setTimeout.js` | `promise-timer-sequence` | 新增 |

## 展示规则

- 保持全站“不展示困难题”的既有规则。
- 将 `promise-core` 和 `promise-concurrency-limit` 从“困难”调整为“中等”，使其进入目录。
- 其他新增条目按内容标记为简单或中等，并继续由目录层按“简单 -> 中等”稳定排序。
- 不修改已有 8 个条目的稳定 ID，避免现有详情页地址失效。

## 内容规范

- 源文件作为主题和来源依据，`sourceUrl` 指向对应 GitHub 文件。
- 代码改写为可独立通过严格 TypeScript 编译的面试示例，不机械复制源文件中的拼写错误或全局副作用。
- 函数和类方法添加函数级注释，命名使用驼峰命名法。
- 每个条目包含标题、摘要、题意、思路、代码、至少两个易错点。
- Promise 核心实现覆盖状态不可逆、异步回调、链式 `then`、返回值吸收和循环引用检查。
- 并发限制使用任务函数而非已启动的 Promise，确保并发上限真实有效。

## 测试与验收

- 目录测试锁定 Promise 分类的 13 个稳定 ID 及排序。
- 搜索测试覆盖“Promise 实现”“并发限制”“Ajax”“红绿灯”等关键词。
- 所有目录代码片段继续通过独立 TypeScript 严格编译。
- 全量测试和类型检查通过。
- GitHub Pages 构建成功，并生成首页加全部详情页的 SSG 产物。
- Promise 分类最终显示 13 道题；项目总展示题量从 79 增至 86。


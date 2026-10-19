# 题库分类与高效导航设计

## 目标

将当前单层题目目录升级为可快速检索的双题库：

- 大类一：LeetCode。
- 大类二：JavaScript。
- 同时支持题名或关键词搜索、按分类浏览。
- 桌面端使用常驻左侧导航栏。
- 移动端使用侧滑分类抽屉，搜索入口保持可见。
- 搜索、分类和返回路径可通过 URL 恢复。

## 信息架构

### LeetCode

LeetCode 包含六个子类：

1. 数组
2. 字符串
3. 链表
4. BFS / DFS
5. 二叉树
6. 排序

首批收录 18 道 Hot 100 代表题，每类 3 道：

| 分类 | 题目 |
| --- | --- |
| 数组 | 两数之和、三数之和、合并区间 |
| 字符串 | 无重复字符的最长子串、最长回文子串、字母异位词分组 |
| 链表 | 反转链表、合并两个有序链表、环形链表 |
| BFS / DFS | 岛屿数量、腐烂的橘子、课程表 |
| 二叉树 | 二叉树层序遍历、二叉树的最大深度、二叉树的最近公共祖先 |
| 排序 | 颜色分类、数组中的第 K 个最大元素、排序链表 |

已存在的三道题保留并归入对应分类。

### JavaScript

JavaScript 包含两个子类：

1. Promise
2. Common

内容主题参考
[`webpack/src/js/promise`](https://github.com/kellywang1314/sourceCode/tree/master/webpack/src/js/promise)
和
[`webpack/src/js/common`](https://github.com/kellywang1314/sourceCode/tree/master/webpack/src/js/common)。

首批收录 18 个主题：

| 分类 | 主题 |
| --- | --- |
| Promise | Promise 核心实现、Promise.all、Promise.race、Promise.resolve、Promise.finally、并发限制、失败重试、串行执行 |
| Common | call/apply/bind、compose、async/await 原理、iterator、memoize、发布订阅、类型判断、柯里化、深拷贝、防抖与节流 |

外部仓库仅作为主题与原始思路参考。页面中的讲解和 TypeScript 代码重新整理，不逐字复制；函数使用驼峰命名，并添加函数级注释。每个 JavaScript 条目保留来源链接。

## 数据模型

现有单文件 `questions.ts` 拆分为领域目录：

```text
src/data/catalog/
├── index.ts
├── types.ts
├── leetcode/
│   ├── array.ts
│   ├── string.ts
│   ├── linkedList.ts
│   ├── traversal.ts
│   ├── binaryTree.ts
│   └── sort.ts
└── javascript/
    ├── promise.ts
    └── common.ts
```

统一条目模型包含：

- `id`：稳定路由标识。
- `domainId`：`leetcode` 或 `javascript`。
- `categoryId`：子分类标识。
- `title`、`summary`、`description`、`approach`。
- `difficulty`：简单、中等或困难。
- `tags`：搜索与扫描标签。
- `code`：TypeScript 示例。
- `pitfalls`：易错点。
- `complexity`：LeetCode 必填，JavaScript 可选。
- `sourceUrl`：外部参考来源，可选。

聚合入口提供领域分组、分类分组、按 ID 查找、搜索和计数函数。页面组件不直接读取具体分类文件。

## 导航布局

### 桌面端

在宽度不小于 960px 时：

- 左侧导航栏宽度固定为 248px，并保持在视口内。
- 顶部显示品牌和搜索框。
- LeetCode 与 JavaScript 作为可展开的大类。
- 子分类显示题目数量与当前选中状态。
- 右侧显示当前范围、命中数量和题目列表。
- 详情页继续保留侧栏，方便直接切换题目。

### 移动端

在宽度小于 960px 时：

- 侧栏收起为抽屉，不占用正文宽度。
- 页头显示分类按钮和搜索按钮。
- 搜索激活后在页头下方固定显示。
- 选择分类后自动关闭抽屉并更新题目列表。
- 详情页可从页头重新打开分类抽屉。

抽屉提供焦点锁定、Escape 关闭和遮罩关闭，打开时阻止背景滚动。

## 搜索行为

搜索默认匹配当前选中的大类和子分类。用户可以一键切换为全站搜索。

搜索字段包括：

- 题名
- 标签
- 摘要
- 核心思路
- 分类名称

搜索采用大小写不敏感的子串匹配，不引入模糊搜索依赖。中文、英文和代码术语均可直接输入。

状态写入 URL 查询参数：

```text
/?domain=leetcode&category=array&q=哈希
```

行为规则：

- 清空搜索词时保留当前分类。
- 切换分类时保留搜索词，并重新计算结果。
- 浏览器前进、后退可恢复分类与搜索。
- 从详情页返回时恢复原列表滚动位置和筛选条件。
- 无结果时显示清空搜索和切换全站搜索两个恢复操作。

键盘支持：

- `/` 聚焦搜索框。
- `Escape` 清空搜索；抽屉打开时优先关闭抽屉。

## 页面与组件

新增或调整的主要组件：

- `CatalogSidebar`：桌面侧栏与移动抽屉共用的导航内容。
- `CatalogSearch`：搜索输入、当前分类或全站范围切换。
- `CatalogLayout`：响应式侧栏、遮罩、滚动与焦点管理。
- `QuestionList`：接收过滤后的条目，不自行执行搜索。
- `QuestionPage`：支持 LeetCode 与 JavaScript 的差异化章节。
- `EmptySearchResult`：提供明确恢复操作。

首页不再展示大幅介绍区域，首屏优先呈现搜索、分类和题目列表，降低扫描距离。

## 路由与 SSG

继续使用 `src/modern.routes.ts` 配置式路由：

| 路由 | 用途 |
| --- | --- |
| `/` | 题库目录、搜索和分类 |
| `/questions/:questionId` | LeetCode 或 JavaScript 条目详情 |
| `*` | 404 |

每个条目仍生成独立 SSG 页面并加入 PWA 预缓存。筛选状态使用查询参数，不增加分类静态路由数量。

## 错误处理

- URL 中出现未知大类或分类时，回退到 LeetCode 全部。
- 未知题目 ID 显示现有 404 页面。
- 外部来源链接失效不阻断本地内容渲染。
- 搜索无结果不显示空白页面。
- JavaScript 条目没有复杂度时隐藏复杂度区块。

## 测试与验收

采用测试先行：

1. 数据测试覆盖 ID 唯一、分类完整、首批条目数量与来源链接。
2. 搜索测试覆盖题名、标签、摘要、分类、当前范围和全站范围。
3. URL 状态测试覆盖初始化、切换与浏览器恢复。
4. 组件测试覆盖侧栏选择、移动抽屉、空结果和键盘操作。
5. 详情页测试覆盖 LeetCode 复杂度与 JavaScript 来源区块。
6. SSG 和 PWA 构建覆盖全部 36 个首批条目。
7. 浏览器验证覆盖 360px、390px、412px、960px 和 1440px。

验收标准：

- 桌面端从任意页面最多一次点击切换子分类。
- 移动端最多两次点击切换子分类。
- 输入关键词后无需提交即可更新结果。
- 页面没有横向溢出、遮挡或不可达控件。
- 搜索和分类状态可复制 URL 并恢复。

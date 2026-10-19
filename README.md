# 面试代码速查

基于 Modern.js 3、React 和 TypeScript 的移动端面试题 PWA。应用使用配置式路由、SSG 和离线预缓存，可部署到 GitHub Pages。

## 本地开发

需要 Node.js 20.19.5 以上版本，推荐 Node.js 22 和 pnpm 10。

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:8080`。

## 质量检查

```bash
pnpm test
pnpm typecheck
pnpm build
```

测试使用 Vitest 和 React Testing Library；生产构建由 Modern.js 内置的 Rsbuild/Rspack 完成。

## 题库结构

题库统一聚合于 `src/data/catalog/index.ts`，内容按领域和分类拆分：

- `src/data/catalog/leetcode/`：数组、字符串、链表、BFS / DFS、二叉树、排序
- `src/data/catalog/javascript/`：Promise、Common

首批目录包含 18 道 LeetCode 题目和 18 个 JavaScript 主题。条目的 `id` 会成为 `/questions/:questionId` 路由参数，因此必须唯一且保持稳定。

新增内容时，在对应分类文件中添加完整 `CatalogItem`。每条内容需要提供：

- 大类、子分类、标题、难度和标签
- 摘要、题目描述与核心思路
- 带函数级注释的 TypeScript 实现
- 至少两个易错点
- LeetCode 条目的时间复杂度和空间复杂度
- JavaScript 条目的 `sourceUrl`

JavaScript 内容参考
[`webpack/src/js`](https://github.com/kellywang1314/sourceCode/tree/master/webpack/src/js)
整理，页面讲解和 TypeScript 示例需重新编写，条目必须保留具体文件或目录的来源链接。

新增后执行：

```bash
pnpm test src/data/catalog/catalog.test.ts src/data/catalog/codeSamples.test.ts
pnpm build
```

SSG 路径和离线预缓存路径会从 `catalogItems` 自动生成。

## 搜索与导航

桌面端使用 248px 常驻侧栏，移动端使用分类抽屉。搜索支持题名、标签、摘要、核心思路以及大类和子分类名称。

筛选状态写入 URL：

- `domain`：`leetcode` 或 `javascript`
- `category`：当前子分类
- `q`：搜索词
- `scope=all`：全站搜索；省略时搜索当前分类

例如：

```text
/?domain=leetcode&category=array&q=哈希
```

未知大类、分类或不匹配的组合会回退到 LeetCode 全部。

## 路由

路由集中定义在 `src/modern.routes.ts`。`src/routes/` 仅用于满足 Modern.js 的路由入口识别，不包含任何约定式页面。

当前路由：

- `/`
- `/questions/:questionId`
- `*`

## PWA

生产构建生成：

- `manifest.webmanifest`
- `sw.js`
- `register-sw.js`
- 192px 和 512px PNG 图标

支持 PWA 的浏览器触发 `beforeinstallprompt` 后，页头会显示安装按钮。Service Worker 会预缓存首页、36 个详情直达页和构建资源。

`pnpm build` 的本地产物位于 `dist`。

## GitHub Pages

仓库已配置 `.github/workflows/deploy.yml`。在 GitHub 仓库设置中将 Pages Source 设为 `GitHub Actions`，推送到 `main` 后自动执行测试、类型检查和部署。

手动验证 Pages 产物：

```bash
MODERNJS_DEPLOY=ghPages pnpm exec modern deploy
```

输出目录为 `.output`。

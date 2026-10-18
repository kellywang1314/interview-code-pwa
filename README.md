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

## 新增题目

在 `src/data/questions.ts` 的 `questions` 数组中添加完整题目对象。`id` 会成为 `/questions/:questionId` 路由参数，因此必须唯一且保持稳定。

每道题需要提供：

- 标题、分类、难度和标签
- 摘要、题目描述与核心思路
- 带函数级注释的 TypeScript 实现
- 时间复杂度、空间复杂度和易错点

新增后执行：

```bash
pnpm test src/data/questions.test.ts
pnpm build
```

SSG 路径和离线预缓存路径都会从题目数据自动生成。

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

支持 PWA 的浏览器触发 `beforeinstallprompt` 后，页头会显示安装按钮。Service Worker 会预缓存首页、三道题目直达页和构建资源。

## GitHub Pages

仓库已配置 `.github/workflows/deploy.yml`。在 GitHub 仓库设置中将 Pages Source 设为 `GitHub Actions`，推送到 `main` 后自动执行测试、类型检查和部署。

手动验证 Pages 产物：

```bash
MODERNJS_DEPLOY=ghPages pnpm exec modern deploy
```

输出目录为 `.output`。

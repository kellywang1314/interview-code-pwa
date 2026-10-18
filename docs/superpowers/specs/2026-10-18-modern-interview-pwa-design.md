# Modern.js 面试代码速查 PWA 设计

## 目标

将当前未完成的 VitePress/Vue 原型迁移为 Modern.js 3、React 和 TypeScript 应用，继续实现适合手机快速翻阅的面试题速查 PWA。

完成后的应用需要：

- 使用 Modern.js 的官方应用工具链。
- 使用 Rsbuild 和 Rspack 构建，不保留 Vite/VitePress。
- 使用集中式配置路由，不使用目录约定生成路由。
- 支持题目目录、题目详情、404 和离线访问。
- 支持 GitHub Pages 子路径部署。
- 在 360px、390px 和 412px 宽度下保持可读、可点击且无页面横向溢出。

## 非目标

- 不引入服务端数据库、用户系统或在线编辑能力。
- 不实现在线代码执行器。
- 不为三道初始题目引入 CMS 或复杂 Markdown 编译链。
- 不保留 VitePress 与 Modern.js 两套运行时。

## 技术架构

应用使用以下技术栈：

- Modern.js 3 提供应用运行时、开发服务器和生产构建命令。
- React 与 TypeScript 实现页面和组件。
- Modern.js 内置 Rsbuild，并由 Rspack 完成打包。
- `rsbuild-plugin-pwa` 通过 Modern.js 的 `builderPlugins` 接入，生成 Web App Manifest、Service Worker 和离线缓存。
- Vitest、React Testing Library 和 jsdom 执行数据与组件测试。

`modern.config.ts` 是唯一构建配置入口。项目不再保留 `.vitepress/`、VitePress 依赖或 Vite PWA 插件。

## 路由设计

所有路由集中定义在 `src/modern.routes.ts`。该文件直接返回配置路由，不合并 `fileRoutes`，因此目录结构不会隐式生成路由。

路由表包含：

| URL | 页面 | 说明 |
| --- | --- | --- |
| `/` | `pages/HomePage.tsx` | 分类导航和题目列表 |
| `/questions/:questionId` | `pages/QuestionPage.tsx` | 根据题目 ID 渲染详情 |
| `*` | `pages/NotFoundPage.tsx` | 未知路径或无效题目 |

页面文件统一位于 `src/pages/`。公共页面外壳位于 `src/layouts/AppLayout.tsx`，通过配置式父子路由挂载。

## 数据与组件

`src/data/questions.ts` 是题目数据的唯一来源。每道题包含：

- `id`
- `title`
- `category`
- `categoryId`
- `difficulty`
- `tags`
- `summary`
- `description`
- `approach`
- `code`
- `complexity`
- `pitfalls`

初始数据沿用两数之和、反转链表和二叉树层序遍历。代码正文保存为字符串，由只读代码块渲染。

组件边界：

- `AppHeader`：站点标题、返回首页入口和主题切换。
- `CategoryNav`：分类快速定位。
- `QuestionList`：按分类渲染题目。
- `QuestionListItem`：完整可点击的单道题目行。
- `QuestionMeta`：难度与标签信息。
- `CodeBlock`：可横向滚动的 TypeScript 代码。
- `InstallPrompt`：浏览器满足条件时提供 PWA 安装入口。

组件只接收展示所需数据，不直接查找全局题目列表。页面负责根据路由参数取得题目，并将数据传入组件。

## 页面与交互

视觉方向为安静、紧凑的工具型界面。使用白色和炭灰作为主要表面色，青绿色表示焦点和交互状态，珊瑚色区分题目难度。页面不使用渐变、装饰性大卡片或营销式首屏。

移动端采用单列布局：

- 页面左右留白 16px。
- 可点击区域最小高度 44px，题目行最小高度 56px。
- 标签可换行，代码块在自身容器内横向滚动。
- 顶部和底部兼容安全区域。
- 桌面端限制正文最大宽度，并提供稳定的目录扫描体验。

主题选择写入 `localStorage`，首次访问遵循系统配色。未获得安装事件时不显示无效的安装按钮。

## PWA 与部署

Manifest 使用 `/interview-code-pwa/` 作为生产环境 `start_url` 和 `scope`。开发环境保持根路径，避免本地调试路径混乱。

Service Worker 预缓存构建生成的 HTML、JavaScript、CSS、图标和字体。题目均来自本地静态数据，因此断网后可以继续访问已构建页面。更新策略使用自动更新，但避免在用户阅读时强制刷新页面。

GitHub Actions 使用 pnpm 安装依赖、运行测试和构建，并将 Modern.js 静态产物部署到 GitHub Pages。

## 错误处理

- 未知 URL 进入 404 页面。
- 动态路由存在但 `questionId` 无法匹配时，也显示 404 内容。
- PWA 注册失败只记录开发环境警告，不阻断页面。
- 安装能力不可用时隐藏安装入口。
- 题目目录完整性由测试保证，包括 ID 唯一、分类顺序和必填正文。

## 测试与验证

开发采用测试先行：

1. 数据测试覆盖分组顺序、ID 唯一性和题目查找。
2. 路由测试覆盖首页、有效题目和无效题目。
3. 组件测试覆盖题目列表、详情内容和安装入口状态。
4. 完整执行类型检查、单元测试和生产构建。
5. 启动生产预览，在 360px、390px、412px 和桌面宽度验证布局。
6. 检查 Manifest、Service Worker、图标和离线访问。

## 迁移策略

迁移采用一次性替换，避免维护双栈：

1. 先用测试固定现有题目数据行为。
2. 替换依赖与构建配置。
3. 创建配置式路由、页面和组件。
4. 迁移三道 Markdown 题目到类型化数据。
5. 接入 PWA 和部署配置。
6. 完成验证后删除 VitePress 文件与旧 Markdown。

迁移不改写题目算法内容，只改变应用框架、展示结构和构建方式。

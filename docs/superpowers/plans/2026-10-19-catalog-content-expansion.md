# Promise 与 AI 题库扩充 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 补齐源仓库 13 道 Promise 题，并将 AI 拆分为 AI Coding 与 Agent 开发两个二级分类。

**Architecture:** 继续使用静态 `CatalogItem[]` 作为唯一数据源，由 `catalogSections` 聚合并自动驱动导航、搜索和 SSG。Promise 保持一个聚合文件；AI 按两个知识域拆成两个文件，已有 AI 条目只迁移分类 ID，不改变稳定条目 ID。

**Tech Stack:** TypeScript、React、Modern.js、Vitest、SSG、Workbox PWA

---

## 文件结构

- 修改 `src/data/catalog/javascript/promise.ts`：最终包含 13 个 Promise 条目。
- 新建 `src/data/catalog/ai/coding.ts`：保存 3 个 AI Coding 条目。
- 重命名并修改 `src/data/catalog/ai/common.ts` 为 `src/data/catalog/ai/agentDevelopment.ts`：保存现有 8 个 Agent 开发条目。
- 修改 `src/data/catalog/types.ts`：替换 AI 分类 ID。
- 修改 `src/data/catalog/index.ts`：注册两个 AI 二级分类。
- 修改 `src/data/catalog/catalog.test.ts`：锁定最终分类、ID 和数量。
- 修改 `src/data/catalog/search.test.ts`：覆盖 Promise 与 AI 新关键词。
- 修改 `src/pages/HomePage.test.tsx`：验证 AI Coding 分类导航。

### Task 1: 用测试锁定 Promise 13 题

**Files:**
- Modify: `src/data/catalog/catalog.test.ts`
- Modify: `src/data/catalog/search.test.ts`

- [ ] **Step 1: 新增 Promise 最终 ID 清单**

在 `catalog.test.ts` 增加：

```ts
const promiseEntryIds = [
  'promise-race',
  'promise-image-loader',
  'promise-timer-sequence',
  'promise-core',
  'promise-all',
  'promise-resolve',
  'promise-finally',
  'promise-concurrency-limit',
  'promise-retry',
  'promise-serial',
  'promise-ajax',
  'promise-output-order',
  'promise-traffic-light',
];
```

该顺序遵守“简单 -> 中等”，同难度保持源文件中的条目顺序。

- [ ] **Step 2: 断言 Promise 清单与最终数量**

```ts
it('contains all source Promise entries', () => {
  expect(
    findCatalogItemsByCategory('promise').map(item => item.id),
  ).toEqual(promiseEntryIds);
});
```

将总量断言更新为最终联合状态：

```ts
expect(catalogItems).toHaveLength(89);
expect(findCatalogItemsByDomain('javascript')).toHaveLength(21);
expect(findCatalogItemsByDomain('ai')).toHaveLength(11);
```

- [ ] **Step 3: 增加 Promise 搜索用例**

在搜索参数化用例中加入：

```ts
['Promise 实现', 'promise-core'],
['并发限制', 'promise-concurrency-limit'],
['Ajax', 'promise-ajax'],
['红绿灯', 'promise-traffic-light'],
```

- [ ] **Step 4: 运行测试确认 RED**

Run:

```bash
pnpm test src/data/catalog/catalog.test.ts src/data/catalog/search.test.ts
```

Expected: FAIL，提示 Promise 分类仍只有 6 个可见条目，且缺少 5 个新 ID。

### Task 2: 补齐 Promise 数据

**Files:**
- Modify: `src/data/catalog/javascript/promise.ts`

- [ ] **Step 1: 让核心实现与并发限制进入目录**

将以下两个条目的 `difficulty` 从 `困难` 改为 `中等`：

```ts
id: 'promise-core'
id: 'promise-concurrency-limit'
```

`promise-core` 的代码必须覆盖：

```ts
type PromiseState = 'pending' | 'fulfilled' | 'rejected';

class InterviewPromise<T> {
  // executor、resolve、reject、then 均提供函数级注释
}

/**
 * 按 Promise/A+ 规则吸收回调返回值，并拒绝链式循环引用。
 */
function resolvePromiseResult<T>(
  promise: InterviewPromise<T>,
  result: unknown,
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason: unknown) => void,
): void {
  // thenable 读取保护、只调用一次、递归吸收
}
```

- [ ] **Step 2: 新增图片加载条目**

新增 `promise-image-loader`，难度简单，来源：

```text
https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/onLoadIamge.js
```

代码入口：

```ts
/**
 * 加载图片并在成功时返回 HTMLImageElement。
 */
function loadImage(sourceUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`图片加载失败: ${sourceUrl}`));
    image.src = sourceUrl;
  });
}
```

- [ ] **Step 3: 新增定时器串行条目**

新增 `promise-timer-sequence`，难度简单，来源 `setTimeout.js`。代码提供 `delay` 和 `printNumbersSerially`，使用 `for...of` 与 `await`，解释 `var` 闭包和并行创建定时器的区别。

- [ ] **Step 4: 新增 Ajax 封装条目**

新增 `promise-ajax`，难度中等，来源 `promsieAjax.js`。代码定义：

```ts
interface AjaxOptions {
  method?: string;
  body?: Document | XMLHttpRequestBodyInit | null;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

/**
 * 用 Promise 封装 XMLHttpRequest。
 */
function requestWithPromise(
  url: string,
  options: AjaxOptions = {},
): Promise<XMLHttpRequest> {
  // 处理 2xx/304、网络错误、超时和请求头
}
```

- [ ] **Step 5: 新增输出顺序题**

新增 `promise-output-order`，难度中等，来源 `promsie输出面试题.js`。代码用纯函数返回预期输出数组，说明同步任务、微任务和宏任务的执行顺序，避免测试运行时产生计时器副作用。

- [ ] **Step 6: 新增红绿灯条目**

新增 `promise-traffic-light`，难度中等，来源 `red-green-yellow.js`。代码使用任务函数数组和可停止循环：

```ts
interface TrafficLightStep {
  color: string;
  durationMs: number;
}

/**
 * 按顺序执行一轮红绿灯任务。
 */
async function runTrafficLightCycle(
  steps: TrafficLightStep[],
  onChange: (color: string) => void,
): Promise<void> {
  // 逐项等待
}
```

- [ ] **Step 7: 运行 Promise 目录与代码编译测试**

Run:

```bash
pnpm test src/data/catalog/catalog.test.ts src/data/catalog/search.test.ts src/data/catalog/codeSamples.test.ts
```

Expected: Promise 清单相关断言 PASS；联合总数断言仍因 AI 尚未实现而 FAIL。

- [ ] **Step 8: 提交 Promise 实现**

```bash
git add src/data/catalog/javascript/promise.ts src/data/catalog/catalog.test.ts src/data/catalog/search.test.ts
git commit -m "feat: complete promise catalog"
```

### Task 3: 用测试锁定 AI 二级分类

**Files:**
- Modify: `src/data/catalog/catalog.test.ts`
- Modify: `src/data/catalog/search.test.ts`
- Modify: `src/pages/HomePage.test.tsx`

- [ ] **Step 1: 替换 AI 分类与条目清单断言**

```ts
const aiCodingEntryIds = [
  'daily-ai-coding-workflow',
  'ai-generated-code-quality',
  'ai-coding-tools-comparison',
];

const agentDevelopmentEntryIds = [
  'prompt-engineering-patterns',
  'llm-context-window',
  'rag-core-flow',
  'embedding-vector-search',
  'function-calling',
  'ai-agent-loop',
  'hallucination-mitigation',
  'fine-tuning-vs-rag',
];
```

分类顺序最终为：

```ts
[
  'array',
  'string',
  'linked-list',
  'traversal',
  'binary-tree',
  'sort',
  'promise',
  'common',
  'ai-coding',
  'agent-development',
]
```

- [ ] **Step 2: 增加首页导航用例**

```ts
it('shows AI Coding entries from the AI navigation', () => {
  renderHomePage('/?domain=ai&category=ai-coding');

  expect(screen.getByText('3 个结果')).toBeVisible();
  expect(
    screen.getByRole('link', { name: /你的日常 AI 工作流是什么/ }),
  ).toBeVisible();
});
```

- [ ] **Step 3: 增加 AI 搜索用例**

```ts
['日常 AI 工作流', 'daily-ai-coding-workflow'],
['代码质量', 'ai-generated-code-quality'],
['AI 工具', 'ai-coding-tools-comparison'],
```

- [ ] **Step 4: 运行测试确认 RED**

Run:

```bash
pnpm test src/data/catalog/catalog.test.ts src/data/catalog/search.test.ts src/pages/HomePage.test.tsx
```

Expected: FAIL，提示新分类 ID 和 3 个新增条目不存在。

### Task 4: 实现 AI 分类与内容

**Files:**
- Create: `src/data/catalog/ai/coding.ts`
- Move: `src/data/catalog/ai/common.ts` to `src/data/catalog/ai/agentDevelopment.ts`
- Modify: `src/data/catalog/types.ts`
- Modify: `src/data/catalog/index.ts`

- [ ] **Step 1: 更新分类类型**

将：

```ts
| 'ai-common';
```

替换为：

```ts
| 'ai-coding'
| 'agent-development';
```

- [ ] **Step 2: 迁移现有 Agent 条目**

将 `aiCommonItems` 重命名为 `agentDevelopmentItems`，把 8 个条目的：

```ts
categoryId: 'ai-common'
```

统一改为：

```ts
categoryId: 'agent-development'
```

- [ ] **Step 3: 新增日常 AI 工作流条目**

创建 `daily-ai-coding-workflow`，核心回答固定为：

1. 明确需求、边界和验收标准。
2. 提供相关代码、项目规范和错误信息。
3. 先让 AI 给出方案、权衡和风险。
4. 小步生成代码并人工审查 diff。
5. 运行测试、类型检查和构建，根据结果迭代。

代码示例定义 `AiWorkflowStage` 和 `createAiWorkflowChecklist()`，函数添加注释并返回上述五步。

- [ ] **Step 4: 新增 AI 代码质量条目**

创建 `ai-generated-code-quality`，回答覆盖上下文质量、增量修改、人工审查、自动化测试、安全检查和最终责任。代码示例定义：

```ts
interface AiCodeQualityGate {
  name: string;
  passed: boolean;
}

/**
 * 判断 AI 生成代码是否通过全部质量门禁。
 */
function passesAiCodeQualityGates(
  gates: AiCodeQualityGate[],
): boolean {
  return gates.length > 0 && gates.every(gate => gate.passed);
}
```

- [ ] **Step 5: 新增 AI 工具对比条目**

创建 `ai-coding-tools-comparison`，按“IDE Agent、对话模型、代码补全、搜索/文档工具”描述适用场景，不绑定单一厂商结论。代码示例定义工具能力和按任务筛选函数。

- [ ] **Step 6: 注册两个 AI 分类**

在 `index.ts` 中导入两个数组，并将 AI section 改为：

```ts
{
  id: 'ai',
  label: 'AI',
  categories: [
    {
      id: 'ai-coding',
      label: 'AI Coding',
      items: createDisplayItems(aiCodingItems),
    },
    {
      id: 'agent-development',
      label: 'Agent 开发',
      items: createDisplayItems(agentDevelopmentItems),
    },
  ],
}
```

- [ ] **Step 7: 运行 AI 定向测试**

Run:

```bash
pnpm test src/data/catalog/catalog.test.ts src/data/catalog/search.test.ts src/pages/HomePage.test.tsx src/data/catalog/codeSamples.test.ts
```

Expected: PASS。

- [ ] **Step 8: 提交 AI 实现**

```bash
git add src/data/catalog/ai src/data/catalog/types.ts src/data/catalog/index.ts src/data/catalog/catalog.test.ts src/data/catalog/search.test.ts src/pages/HomePage.test.tsx
git commit -m "feat: split ai catalog categories"
```

### Task 5: 全量验证与发布产物

**Files:**
- Verify: all changed files

- [ ] **Step 1: 运行全量测试**

Run:

```bash
pnpm test
```

Expected: 所有测试 PASS。

- [ ] **Step 2: 运行类型检查**

Run:

```bash
pnpm typecheck
```

Expected: exit 0。

- [ ] **Step 3: 运行 GitHub Pages 构建**

Run:

```bash
MODERNJS_DEPLOY=ghPages pnpm exec modern deploy
```

Expected: 构建成功，并生成 90 个 HTML（首页 + 89 个详情页）。

- [ ] **Step 4: 检查关键 SSG 路由**

```bash
test -e dist/html/index/questions/promise-core/index.html
test -e dist/html/index/questions/promise-concurrency-limit/index.html
test -e dist/html/index/questions/promise-ajax/index.html
test -e dist/html/index/questions/daily-ai-coding-workflow/index.html
test -e dist/html/index/questions/ai-generated-code-quality/index.html
```

Expected: 全部 exit 0。

- [ ] **Step 5: 检查 diff**

Run:

```bash
git diff --check
git status --short --branch
```

Expected: 无空白错误，只保留用户已有的未跟踪 `app-install-qr.png`。


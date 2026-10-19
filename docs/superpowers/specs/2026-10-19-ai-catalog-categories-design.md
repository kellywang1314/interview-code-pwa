# AI 二级分类设计

## 目标

将 AI 一级分类下现有的“常问问题”拆分为两个更清晰的二级分类：

1. `AI Coding`：面向日常开发工作流、代码质量和工具选型。
2. `Agent 开发`：面向 LLM、RAG、工具调用和 Agent 系统设计。

## 分类与条目

### AI Coding

分类 ID 使用 `ai-coding`，新增 3 道题：

| 条目 ID | 标题 |
| --- | --- |
| `daily-ai-coding-workflow` | 你的日常 AI 工作流是什么？ |
| `ai-generated-code-quality` | 如何保证 AI 生成代码的质量？ |
| `ai-coding-tools-comparison` | 你使用哪些 AI 工具？各自的优势是什么？ |

三道题需要给出可用于面试作答的结构化答案，同时提供可独立编译的 TypeScript 示例。代码中的函数和方法使用驼峰命名并添加函数级注释。

### Agent 开发

分类 ID 使用 `agent-development`。现有 8 道 AI 技术题全部迁入该分类：

- `prompt-engineering-patterns`
- `llm-context-window`
- `rag-core-flow`
- `embedding-vector-search`
- `function-calling`
- `ai-agent-loop`
- `hallucination-mitigation`
- `fine-tuning-vs-rag`

现有条目 ID、标题和详情页 URL 保持不变，只修改 `categoryId`。

## 数据组织

- 用 `src/data/catalog/ai/coding.ts` 保存 AI Coding 条目。
- 用 `src/data/catalog/ai/agentDevelopment.ts` 保存 Agent 开发条目。
- 删除原来的 `src/data/catalog/ai/common.ts`，避免一个文件承载两个知识域。
- `CatalogCategoryId` 删除 `ai-common`，新增 `ai-coding` 和 `agent-development`。
- AI 导航顺序固定为 `AI Coding`、`Agent 开发`。

## 展示与搜索

- 两个分类继续使用全站统一的“简单 -> 中等”排序规则。
- AI Coding 显示 3 道题，Agent 开发显示 8 道题，AI 一级分类共 11 道题。
- 全站搜索可通过“工作流”“代码质量”“AI 工具”“RAG”“Agent”等关键词命中对应条目。
- URL 查询参数使用新的分类 ID；原 `ai-common` 查询参数不再保留兼容逻辑，因为该分类尚未发布到主分支。

## 测试与验收

- 目录测试锁定 AI 两个二级分类的顺序、标签和条目 ID。
- 首页测试验证从导航切换到 `AI Coding` 后显示 3 道题。
- 搜索测试覆盖三个新增主题。
- 所有代码片段通过独立 TypeScript 严格编译。
- 全量测试、类型检查和 GitHub Pages 构建通过。
- SSG 为 3 个新增条目生成详情页，现有 8 个 AI 详情页地址保持不变。


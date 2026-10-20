import type { CatalogItem } from '../types';

export const aiCodingItems = [
  {
    id: 'daily-ai-coding-workflow',
    domainId: 'ai',
    categoryId: 'ai-coding',
    title: '你的日常 AI 工作流是什么？',
    difficulty: '简单',
    tags: ['AI Coding', '日常 AI 工作流', '研发流程'],
    summary: '把 AI 放进需求澄清、方案设计、编码审查和自动化验证闭环。',
    description:
      '回答重点不是罗列工具，而是说明如何让 AI 参与研发流程，同时保留人工决策、风险判断和最终验收。',
    approach:
      '我通常分五步：先明确任务边界和验收标准；再提供相关代码、项目规范与错误信息；让 AI 先给方案、权衡和风险；确认后小步生成代码并人工审查 diff；最后运行测试、类型检查和构建，根据真实结果继续迭代。AI 负责提效，人负责决策和验收。',
    code: `interface AiWorkflowStage {
  name: string;
  owner: 'human' | 'ai' | 'shared';
  action: string;
}

/**
 * 创建日常 AI 辅助开发的五步检查清单。
 */
function createAiWorkflowChecklist(): AiWorkflowStage[] {
  return [
    {
      name: '明确任务',
      owner: 'human',
      action: '定义需求、边界和验收标准',
    },
    {
      name: '提供上下文',
      owner: 'human',
      action: '提供相关代码、项目规范和错误信息',
    },
    {
      name: '先出方案',
      owner: 'shared',
      action: '让 AI 给出方案、权衡和风险',
    },
    {
      name: '人工审查',
      owner: 'shared',
      action: '小步生成代码并逐项审查 diff',
    },
    {
      name: '自动化验证',
      owner: 'shared',
      action: '运行测试、类型检查和构建并根据结果迭代',
    },
  ];
}`,
    pitfalls: [
      '只回答使用了哪些工具，无法体现对研发质量和风险的控制。',
      '不能把 AI 输出直接当成最终结论，需求决策、代码审查和验收仍由人负责。',
    ],
  },
  {
    id: 'ai-generated-code-quality',
    domainId: 'ai',
    categoryId: 'ai-coding',
    title: '如何保证 AI 生成代码的质量？',
    difficulty: '简单',
    tags: ['AI Coding', '代码质量', '质量门禁'],
    summary: '通过高质量上下文、增量修改、人工审查和自动化门禁控制风险。',
    description:
      'AI 生成代码的质量不能只靠提示词，需要把项目约束、审查流程、测试体系和安全检查组合成可重复的工程闭环。',
    approach:
      '先提供准确上下文和明确验收标准，要求 AI 做最小增量修改；人工重点审查业务逻辑、边界条件、依赖和安全风险；再用单元测试、类型检查、Lint、构建和必要的端到端测试验证。最终责任始终属于提交代码的人。',
    code: `interface AiCodeQualityGate {
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
}`,
    pitfalls: [
      '测试通过不代表业务语义正确，仍需人工核对需求、边界和异常路径。',
      '不要接受大范围无关重构，增量越大越难发现 AI 引入的隐藏回归。',
    ],
  },
  {
    id: 'ai-coding-tools-comparison',
    domainId: 'ai',
    categoryId: 'ai-coding',
    title: '你使用哪些 AI 工具？各自的优势是什么？',
    difficulty: '简单',
    tags: ['AI Coding', 'AI 工具', '工具选型'],
    summary: '按任务选择 IDE Agent、对话模型、代码补全或搜索文档工具。',
    description:
      '回答工具题时应围绕能力边界和适用场景，而不是只罗列厂商名称。不同工具适合跨文件执行、方案讨论、局部补全或事实检索。',
    approach:
      'IDE Agent 适合理解仓库并执行多文件任务；对话模型适合方案推演、解释和复盘；代码补全适合低延迟的局部编码；搜索与文档工具适合获取最新、可引用的事实。实际工作中根据任务风险、上下文范围和验证成本组合使用。',
    code: `type AiCodingToolType =
  | 'ideAgent'
  | 'chatModel'
  | 'codeCompletion'
  | 'searchDocs';

interface AiCodingTool {
  type: AiCodingToolType;
  capabilities: string[];
}

/**
 * 按任务所需能力筛选合适的 AI 工具。
 */
function selectAiCodingTools(
  tools: AiCodingTool[],
  requiredCapability: string,
): AiCodingTool[] {
  return tools.filter(tool =>
    tool.capabilities.includes(requiredCapability),
  );
}`,
    pitfalls: [
      '不要把工具能力等同于结果可靠性，任何工具输出都需要与任务风险匹配的验证。',
      '工具对比应说明适用场景和限制，避免脱离上下文给出单一厂商结论。',
    ],
  },
] satisfies CatalogItem[];

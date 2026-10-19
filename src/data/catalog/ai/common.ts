import type { CatalogItem } from '../types';

export const aiCommonItems = [
  {
    id: 'rag-core-flow',
    domainId: 'ai',
    categoryId: 'ai-common',
    title: 'RAG 核心流程',
    difficulty: '中等',
    tags: ['RAG', '检索增强生成', '知识库'],
    summary: '先检索相关知识，再把证据和问题一起交给模型生成答案。',
    description:
      '说明 RAG 是什么，以及从用户问题到最终回答的核心链路。面试中通常会追问切分、召回、重排、拼接上下文和答案校验。',
    approach:
      'RAG 的关键不是让模型记住所有知识，而是把外部知识按需检索进上下文。典型流程是文档切分、向量化入库、问题向量化、召回候选片段、重排、组装 Prompt、生成答案并引用来源。',
    code: `interface RetrievedChunk {
  id: string;
  title: string;
  content: string;
}

/**
 * 根据问题和检索片段构造 RAG 回答提示词。
 */
function buildRagPrompt(
  question: string,
  chunks: RetrievedChunk[],
): string {
  const evidence = chunks
    .map(
      (chunk, index) =>
        \`[\${index + 1}] \${chunk.title}\\n\${chunk.content}\`,
    )
    .join('\\n\\n');

  return [
    '你是严谨的面试助手，只能基于给定资料回答。',
    '如果资料不足，请直接说明无法确认。',
    \`资料：\\n\${evidence}\`,
    \`问题：\${question}\`,
  ].join('\\n\\n');
}`,
    pitfalls: [
      'RAG 不是简单把全文塞进 Prompt，必须控制切分粒度、召回质量和上下文预算。',
      '模型生成答案时仍可能幻觉，最好要求引用来源并做答案校验。',
    ],
  },
  {
    id: 'embedding-vector-search',
    domainId: 'ai',
    categoryId: 'ai-common',
    title: 'Embedding 与向量检索',
    difficulty: '中等',
    tags: ['Embedding', '向量检索', '相似度'],
    summary: '把文本映射为向量，用相似度在语义空间里找到相关内容。',
    description:
      '解释 Embedding 的作用，以及为什么向量检索能支持语义搜索、RAG 召回和相似问题匹配。',
    approach:
      'Embedding 模型会把文本编码为高维向量。检索时先把查询也编码成向量，再用余弦相似度、点积或向量数据库的 ANN 索引找最近邻，最后把候选结果交给重排或生成模块。',
    code: `interface VectorDocument {
  id: string;
  text: string;
  vector: number[];
}

/**
 * 计算两个向量的余弦相似度。
 */
function cosineSimilarity(leftVector: number[], rightVector: number[]): number {
  let dotProduct = 0;
  let leftNorm = 0;
  let rightNorm = 0;

  for (let index = 0; index < leftVector.length; index += 1) {
    dotProduct += leftVector[index] * rightVector[index];
    leftNorm += leftVector[index] ** 2;
    rightNorm += rightVector[index] ** 2;
  }

  if (leftNorm === 0 || rightNorm === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(leftNorm) * Math.sqrt(rightNorm));
}

/**
 * 返回与查询向量最相似的前 k 个文档。
 */
function searchSimilarDocuments(
  queryVector: number[],
  documents: VectorDocument[],
  topK: number,
): VectorDocument[] {
  return [...documents]
    .sort(
      (leftDocument, rightDocument) =>
        cosineSimilarity(queryVector, rightDocument.vector) -
        cosineSimilarity(queryVector, leftDocument.vector),
    )
    .slice(0, topK);
}`,
    pitfalls: [
      '向量相似不等于答案正确，召回结果通常还需要重排和业务过滤。',
      '不同 Embedding 模型的向量维度和语义空间不同，不能混用。',
    ],
  },
  {
    id: 'prompt-engineering-patterns',
    domainId: 'ai',
    categoryId: 'ai-common',
    title: 'Prompt Engineering 常见模式',
    difficulty: '简单',
    tags: ['Prompt', '提示词', '结构化输出'],
    summary: '明确角色、任务、约束、输入和输出格式，减少模型理解偏差。',
    description:
      '梳理高质量 Prompt 的常见组成，以及面试中如何解释零样本、少样本、约束输出和分步推理。',
    approach:
      '把 Prompt 拆成角色、目标、背景、约束、输入数据、输出格式和示例。复杂任务优先要求结构化输出，并明确禁止臆测、要求给出依据。',
    code: `interface PromptOptions {
  role: string;
  task: string;
  input: string;
  constraints: string[];
  outputFormat: string;
}

/**
 * 构造包含角色、任务、约束和输出格式的结构化提示词。
 */
function buildStructuredPrompt(options: PromptOptions): string {
  return [
    \`角色：\${options.role}\`,
    \`任务：\${options.task}\`,
    \`输入：\${options.input}\`,
    \`约束：\\n\${options.constraints.map(item => \`- \${item}\`).join('\\n')}\`,
    \`输出格式：\${options.outputFormat}\`,
  ].join('\\n\\n');
}`,
    pitfalls: [
      'Prompt 越长不一定越好，关键是消除歧义并给出可执行约束。',
      '要求 JSON 输出时要同时说明字段、类型和缺失信息的处理方式。',
    ],
  },
  {
    id: 'function-calling',
    domainId: 'ai',
    categoryId: 'ai-common',
    title: 'Function Calling / Tool Calling',
    difficulty: '中等',
    tags: ['Tool Calling', '函数调用', '结构化参数'],
    summary: '让模型选择工具并生成结构化参数，由程序真正执行外部动作。',
    description:
      '解释 Function Calling 的边界：模型不直接调用接口，而是输出工具名和参数，应用层负责校验、执行和回填结果。',
    approach:
      '先声明可用工具的名称、描述和参数 schema。模型根据用户意图选择工具并生成参数。服务端校验参数后调用真实 API，再把工具结果返回给模型继续生成面向用户的回答。',
    code: `interface ToolCall {
  name: string;
  arguments: Record<string, string>;
}

/**
 * 从模型输出中解析工具调用结构。
 */
function parseToolCall(rawText: string): ToolCall | null {
  try {
    const value = JSON.parse(rawText) as Partial<ToolCall>;

    if (
      typeof value.name !== 'string' ||
      typeof value.arguments !== 'object' ||
      value.arguments === null
    ) {
      return null;
    }

    return {
      name: value.name,
      arguments: value.arguments as Record<string, string>,
    };
  } catch {
    return null;
  }
}`,
    pitfalls: [
      '工具参数必须在服务端再次校验，不能直接信任模型输出。',
      '工具调用适合确定性外部动作，不适合让模型绕过权限或直接执行危险操作。',
    ],
  },
  {
    id: 'ai-agent-loop',
    domainId: 'ai',
    categoryId: 'ai-common',
    title: 'Agent 和普通 LLM 调用的区别',
    difficulty: '中等',
    tags: ['Agent', '规划', '工具调用'],
    summary: 'Agent 会围绕目标循环规划、执行工具、观察结果并决定下一步。',
    description:
      '说明 Agent 不只是一次模型调用，而是模型、工具、记忆、状态和控制循环组合成的任务执行系统。',
    approach:
      '普通 LLM 调用通常是输入到输出的一次生成。Agent 会维护任务状态，反复执行“思考/计划 -> 调工具 -> 观察结果 -> 更新状态”的循环，直到达到停止条件或需要用户介入。',
    code: `interface AgentState {
  goal: string;
  observations: string[];
  steps: number;
}

type AgentAction =
  | { type: 'callTool'; toolName: string; query: string }
  | { type: 'finish'; answer: string };

/**
 * 根据当前状态决定 Agent 下一步动作。
 */
function decideNextAgentAction(state: AgentState): AgentAction {
  if (state.steps >= 3 || state.observations.length >= 2) {
    return {
      type: 'finish',
      answer: state.observations.join('\\n'),
    };
  }

  return {
    type: 'callTool',
    toolName: 'searchKnowledgeBase',
    query: state.goal,
  };
}`,
    pitfalls: [
      'Agent 更强也更不可控，必须设置最大步数、权限边界和失败回退。',
      '不要把所有任务都做成 Agent，简单问答用一次 LLM 调用更稳定、更便宜。',
    ],
  },
  {
    id: 'hallucination-mitigation',
    domainId: 'ai',
    categoryId: 'ai-common',
    title: '大模型幻觉怎么缓解',
    difficulty: '中等',
    tags: ['幻觉', '可靠性', '答案校验'],
    summary: '用检索证据、约束输出、引用来源和后置校验降低幻觉概率。',
    description:
      '回答为什么大模型会幻觉，以及工程上如何在问答、客服、知识库场景里控制风险。',
    approach:
      '幻觉来自模型按概率生成而非查库执行。常见缓解方法包括 RAG、要求引用来源、答案和证据一致性校验、低温度生成、限定回答范围、灰度评测和人工兜底。',
    code: `interface GroundedAnswerCheck {
  accepted: boolean;
  missingClaims: string[];
}

/**
 * 检查答案中的关键句是否能在资料片段中找到支持。
 */
function checkAnswerGrounding(
  answerClaims: string[],
  sourceSnippets: string[],
): GroundedAnswerCheck {
  const missingClaims = answerClaims.filter(
    claim =>
      !sourceSnippets.some(snippet =>
        snippet.toLowerCase().includes(claim.toLowerCase()),
      ),
  );

  return {
    accepted: missingClaims.length === 0,
    missingClaims,
  };
}`,
    pitfalls: [
      'Prompt 里写“不要幻觉”不等于能消除幻觉，必须配合证据和校验。',
      '低温度只能降低随机性，不能保证事实正确。',
    ],
  },
  {
    id: 'fine-tuning-vs-rag',
    domainId: 'ai',
    categoryId: 'ai-common',
    title: '微调和 RAG 怎么选',
    difficulty: '中等',
    tags: ['微调', 'RAG', '模型选型'],
    summary: '知识频繁更新优先 RAG，风格或能力迁移才考虑微调。',
    description:
      '区分微调和 RAG 的适用边界，解释什么时候应该改模型参数，什么时候应该外挂知识库。',
    approach:
      'RAG 适合企业知识、文档问答、内容经常变化且需要引用来源的场景。微调适合固定风格、固定格式、领域表达习惯或特定任务能力迁移，但更新成本和评测成本更高。',
    code: `type AiKnowledgeStrategy = 'rag' | 'fineTune' | 'promptOnly';

interface StrategyInput {
  knowledgeChangesOften: boolean;
  needsSourceCitation: boolean;
  needsStableWritingStyle: boolean;
}

/**
 * 根据业务特征选择 RAG、微调或纯 Prompt 方案。
 */
function chooseKnowledgeStrategy(input: StrategyInput): AiKnowledgeStrategy {
  if (input.knowledgeChangesOften || input.needsSourceCitation) {
    return 'rag';
  }
  if (input.needsStableWritingStyle) {
    return 'fineTune';
  }

  return 'promptOnly';
}`,
    pitfalls: [
      '微调不是给模型灌最新知识的首选方案，知识更新通常更适合 RAG。',
      'RAG 和微调可以组合使用，但要分别评估召回质量和生成质量。',
    ],
  },
  {
    id: 'llm-context-window',
    domainId: 'ai',
    categoryId: 'ai-common',
    title: '上下文窗口与 Token 预算',
    difficulty: '简单',
    tags: ['Token', '上下文窗口', '成本控制'],
    summary: '模型一次只能处理有限 Token，需要裁剪、摘要或分块输入。',
    description:
      '解释上下文窗口是什么，为什么长对话、长文档和 RAG 都要做 Token 预算控制。',
    approach:
      '上下文窗口包含系统提示词、历史消息、检索片段和期望输出。工程上通常会保留系统指令和最近对话，对旧消息做摘要，对文档做分块和 TopK 控制。',
    code: `interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * 粗略估算文本 Token 数量。
 */
function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * 在预算内保留系统消息和最近的对话消息。
 */
function trimMessagesToBudget(
  messages: ChatMessage[],
  tokenBudget: number,
): ChatMessage[] {
  const systemMessages = messages.filter(message => message.role === 'system');
  const conversationMessages = messages.filter(
    message => message.role !== 'system',
  );
  const selectedMessages: ChatMessage[] = [...systemMessages];
  let usedTokens = systemMessages.reduce(
    (total, message) => total + estimateTokenCount(message.content),
    0,
  );

  for (let index = conversationMessages.length - 1; index >= 0; index -= 1) {
    const message = conversationMessages[index];
    const messageTokens = estimateTokenCount(message.content);

    if (usedTokens + messageTokens > tokenBudget) {
      break;
    }

    selectedMessages.splice(systemMessages.length, 0, message);
    usedTokens += messageTokens;
  }

  return selectedMessages;
}`,
    pitfalls: [
      '上下文窗口变大不代表可以无限塞资料，噪音过多会降低模型关注关键证据的能力。',
      'Token 估算应以实际模型 tokenizer 为准，字符数只能作为粗略近似。',
    ],
  },
] satisfies CatalogItem[];

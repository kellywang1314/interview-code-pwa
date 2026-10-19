import {
  findCatalogItemById,
  type CatalogItem,
} from '../catalog';

export type { QuestionDifficulty } from '../catalog';

export type Question = Omit<CatalogItem, 'categoryId' | 'complexity'> & {
  category: string;
  categoryId: string;
  complexity: {
    time: string;
    space: string;
  };
};

export interface QuestionGroup {
  category: string;
  categoryId: string;
  questions: Question[];
}

const legacyCategoryByItemId: Record<
  string,
  { category: string; categoryId: string }
> = {
  'two-sum': {
    category: '数组与哈希',
    categoryId: 'array-hash',
  },
  'reverse-linked-list': {
    category: '链表',
    categoryId: 'linked-list',
  },
  'level-order-traversal': {
    category: '二叉树',
    categoryId: 'binary-tree',
  },
};

/**
 * 读取旧页面仍在展示的目录条目。
 */
function requireCatalogItem(itemId: string): CatalogItem {
  const item = findCatalogItemById(itemId);

  if (!item) {
    throw new Error(`目录条目不存在：${itemId}`);
  }

  return item;
}

/**
 * 将统一目录条目转换为旧页面模型。
 */
function toLegacyQuestion(item: CatalogItem): Question {
  const legacyCategory = legacyCategoryByItemId[item.id];

  return {
    ...item,
    category: legacyCategory.category,
    categoryId: legacyCategory.categoryId,
    complexity: item.complexity ?? {
      time: '不适用',
      space: '不适用',
    },
  };
}

export const questions: Question[] = [
  'two-sum',
  'reverse-linked-list',
  'level-order-traversal',
].map(requireCatalogItem).map(toLegacyQuestion);

/**
 * 按分类分组题目，并保持分类首次出现的顺序。
 */
export function getQuestionGroups(items: Question[]): QuestionGroup[] {
  const groups = new Map<string, QuestionGroup>();

  items.forEach(question => {
    const currentGroup = groups.get(question.categoryId);

    if (currentGroup) {
      currentGroup.questions.push(question);
      return;
    }

    groups.set(question.categoryId, {
      category: question.category,
      categoryId: question.categoryId,
      questions: [question],
    });
  });

  return Array.from(groups.values());
}

/**
 * 按稳定 ID 查找兼容旧页面模型的题目。
 */
export function findQuestionById(questionId: string): Question | undefined {
  const item = findCatalogItemById(questionId);

  return item
    ? questions.find(question => question.id === item.id)
    : undefined;
}

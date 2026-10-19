import { commonItems } from './javascript/common';
import { promiseItems } from './javascript/promise';
import { arrayItems } from './leetcode/array';
import { binaryTreeItems } from './leetcode/binaryTree';
import { linkedListItems } from './leetcode/linkedList';
import { sortItems } from './leetcode/sort';
import { stringItems } from './leetcode/string';
import { traversalItems } from './leetcode/traversal';
import type {
  CatalogCategoryId,
  CatalogDomainId,
  CatalogItem,
  CatalogSection,
  QuestionDifficulty,
} from './types';

export type {
  CatalogCategory,
  CatalogCategoryId,
  CatalogDomainId,
  CatalogItem,
  CatalogSection,
  QuestionDifficulty,
} from './types';

const difficultyOrder: Record<QuestionDifficulty, number> = {
  简单: 0,
  中等: 1,
  困难: 2,
};

/**
 * 判断题目是否进入当前面试速查目录。
 */
function shouldShowCatalogItem(item: CatalogItem): boolean {
  return item.difficulty !== '困难';
}

/**
 * 按题目难度从简单到中等稳定排序。
 */
function compareCatalogItemsByDifficulty(
  leftItem: CatalogItem,
  rightItem: CatalogItem,
): number {
  return (
    difficultyOrder[leftItem.difficulty] -
    difficultyOrder[rightItem.difficulty]
  );
}

/**
 * 生成最终展示用题目列表，过滤困难题并保持同难度内原始顺序。
 */
function createDisplayItems(items: CatalogItem[]): CatalogItem[] {
  return [...items]
    .filter(shouldShowCatalogItem)
    .sort(compareCatalogItemsByDifficulty);
}

export const catalogSections: CatalogSection[] = [
  {
    id: 'leetcode',
    label: 'LeetCode',
    categories: [
      { id: 'array', label: '数组', items: createDisplayItems(arrayItems) },
      { id: 'string', label: '字符串', items: createDisplayItems(stringItems) },
      {
        id: 'linked-list',
        label: '链表',
        items: createDisplayItems(linkedListItems),
      },
      {
        id: 'traversal',
        label: 'BFS / DFS',
        items: createDisplayItems(traversalItems),
      },
      {
        id: 'binary-tree',
        label: '二叉树',
        items: createDisplayItems(binaryTreeItems),
      },
      { id: 'sort', label: '排序', items: createDisplayItems(sortItems) },
    ],
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    categories: [
      {
        id: 'promise',
        label: 'Promise',
        items: createDisplayItems(promiseItems),
      },
      { id: 'common', label: 'Common', items: createDisplayItems(commonItems) },
    ],
  },
];

export const catalogItems: CatalogItem[] = catalogSections.flatMap(section =>
  section.categories.flatMap(category => category.items),
);

/**
 * 按稳定 ID 查找单个目录条目。
 */
export function findCatalogItemById(
  itemId: string,
): CatalogItem | undefined {
  return catalogItems.find(item => item.id === itemId);
}

/**
 * 返回指定大类下的全部目录条目，并保持分类与条目顺序。
 */
export function findCatalogItemsByDomain(
  domainId: CatalogDomainId,
): CatalogItem[] {
  return catalogItems.filter(item => item.domainId === domainId);
}

/**
 * 返回指定分类下的全部目录条目，并保持原始顺序。
 */
export function findCatalogItemsByCategory(
  categoryId: CatalogCategoryId,
): CatalogItem[] {
  return catalogItems.filter(item => item.categoryId === categoryId);
}

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
} from './types';

export type {
  CatalogCategory,
  CatalogCategoryId,
  CatalogDomainId,
  CatalogItem,
  CatalogSection,
  QuestionDifficulty,
} from './types';

export const catalogSections: CatalogSection[] = [
  {
    id: 'leetcode',
    label: 'LeetCode',
    categories: [
      { id: 'array', label: '数组', items: arrayItems },
      { id: 'string', label: '字符串', items: stringItems },
      { id: 'linked-list', label: '链表', items: linkedListItems },
      { id: 'traversal', label: 'BFS / DFS', items: traversalItems },
      { id: 'binary-tree', label: '二叉树', items: binaryTreeItems },
      { id: 'sort', label: '排序', items: sortItems },
    ],
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    categories: [
      { id: 'promise', label: 'Promise', items: promiseItems },
      { id: 'common', label: 'Common', items: commonItems },
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

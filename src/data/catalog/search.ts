import { catalogSections } from './index';
import type {
  CatalogCategoryId,
  CatalogDomainId,
  CatalogItem,
} from './types';

export type CatalogSearchScope = 'current' | 'all';

export interface CatalogFilterState {
  domainId: CatalogDomainId;
  categoryId?: CatalogCategoryId;
  query: string;
  scope: CatalogSearchScope;
}

const domainLabels = new Map(
  catalogSections.map(section => [section.id, section.label]),
);

const categoryLabels = new Map(
  catalogSections.flatMap(section =>
    section.categories.map(category => [category.id, category.label]),
  ),
);

/**
 * 将搜索文本规范化为适合不区分大小写匹配的形式。
 */
function normalizeSearchText(value: string): string {
  return value.trim().toLocaleLowerCase();
}

/**
 * 在题名、标签、摘要、思路和分类元数据中搜索目录条目。
 */
export function searchCatalog(
  items: CatalogItem[],
  query: string,
): CatalogItem[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter(item => {
    const searchableText = [
      item.title,
      ...item.tags,
      item.summary,
      item.approach,
      domainLabels.get(item.domainId) ?? '',
      categoryLabels.get(item.categoryId) ?? '',
    ]
      .join(' ')
      .toLocaleLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

/**
 * 根据当前分类范围或全站范围过滤并搜索目录条目。
 */
export function filterCatalog(
  items: CatalogItem[],
  state: CatalogFilterState,
): CatalogItem[] {
  const scopedItems =
    state.scope === 'all'
      ? items
      : items.filter(
          item =>
            item.domainId === state.domainId &&
            (!state.categoryId ||
              item.categoryId === state.categoryId),
        );

  return searchCatalog(scopedItems, state.query);
}

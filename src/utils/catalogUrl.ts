import { catalogSections } from '../data/catalog';
import type {
  CatalogFilterState,
  CatalogSearchScope,
} from '../data/catalog/search';
import type {
  CatalogCategoryId,
  CatalogDomainId,
} from '../data/catalog/types';

export const DEFAULT_CATALOG_STATE: CatalogFilterState = {
  domainId: 'leetcode',
  query: '',
  scope: 'current',
};

const categoryDomainIds = new Map<CatalogCategoryId, CatalogDomainId>(
  catalogSections.flatMap(section =>
    section.categories.map(category => [category.id, section.id]),
  ),
);

const domainIds = new Set<CatalogDomainId>(
  catalogSections.map(section => section.id),
);

/**
 * 判断字符串是否为受支持的目录大类标识。
 */
function isCatalogDomainId(
  value: string | null,
): value is CatalogDomainId {
  return value !== null && domainIds.has(value as CatalogDomainId);
}

/**
 * 判断字符串是否为受支持的目录分类标识。
 */
function isCatalogCategoryId(
  value: string | null,
): value is CatalogCategoryId {
  return (
    value !== null &&
    categoryDomainIds.has(value as CatalogCategoryId)
  );
}

/**
 * 判断字符串是否为受支持的目录搜索范围。
 */
function isCatalogSearchScope(
  value: string | null,
): value is CatalogSearchScope {
  return value === 'current' || value === 'all';
}

/**
 * 从查询字符串解析目录筛选状态，非法组合统一回退默认状态。
 */
export function parseCatalogUrl(search: string): CatalogFilterState {
  const params = new URLSearchParams(search);
  const domainParam = params.get('domain');
  const categoryParam = params.get('category');
  const scopeParam = params.get('scope');

  if (
    (domainParam !== null && !isCatalogDomainId(domainParam)) ||
    (categoryParam !== null &&
      !isCatalogCategoryId(categoryParam)) ||
    (scopeParam !== null && !isCatalogSearchScope(scopeParam))
  ) {
    return { ...DEFAULT_CATALOG_STATE };
  }

  const domainId = domainParam ?? DEFAULT_CATALOG_STATE.domainId;
  const categoryId = categoryParam ?? undefined;

  if (
    categoryId &&
    (!domainParam ||
      categoryDomainIds.get(categoryId) !== domainId)
  ) {
    return { ...DEFAULT_CATALOG_STATE };
  }

  return {
    domainId,
    ...(categoryId ? { categoryId } : {}),
    query: params.get('q')?.trim() ?? '',
    scope: scopeParam ?? DEFAULT_CATALOG_STATE.scope,
  };
}

/**
 * 将目录筛选状态序列化为稳定且可分享的查询字符串。
 */
export function serializeCatalogUrl(
  state: CatalogFilterState,
): string {
  const params = new URLSearchParams();

  if (
    state.domainId !== DEFAULT_CATALOG_STATE.domainId ||
    state.categoryId
  ) {
    params.set('domain', state.domainId);
  }

  if (state.categoryId) {
    params.set('category', state.categoryId);
  }

  const query = state.query.trim();
  if (query) {
    params.set('q', query);
  }

  if (state.scope !== DEFAULT_CATALOG_STATE.scope) {
    params.set('scope', state.scope);
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

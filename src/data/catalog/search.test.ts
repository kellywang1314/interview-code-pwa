import { describe, expect, it } from 'vitest';

import { catalogItems } from './index';
import { filterCatalog, searchCatalog } from './search';

describe('catalog search', () => {
  it.each([
    ['两数', 'two-sum'],
    ['哈希表', 'two-sum'],
    ['一次遍历', 'two-sum'],
    ['promise.all', 'promise-all'],
    ['链表', 'reverse-linked-list'],
    ['BFS / DFS', 'number-of-islands'],
    ['JAVASCRIPT', 'promise-all'],
  ])('searches "%s" across catalog metadata', (query, itemId) => {
    expect(
      searchCatalog(catalogItems, query).map(item => item.id),
    ).toContain(itemId);
  });

  it('normalizes surrounding whitespace and letter case', () => {
    expect(
      searchCatalog(catalogItems, '  PROMISE.ALL  ').map(
        item => item.id,
      ),
    ).toContain('promise-all');
  });

  it('returns every item for an empty query', () => {
    expect(searchCatalog(catalogItems, '   ')).toEqual(catalogItems);
  });

  it('combines domain and category filters in the current scope', () => {
    const result = filterCatalog(catalogItems, {
      domainId: 'leetcode',
      categoryId: 'linked-list',
      query: '',
      scope: 'current',
    });

    expect(result).toHaveLength(11);
    expect(
      result.every(item => item.categoryId === 'linked-list'),
    ).toBe(true);
  });

  it('ignores current category filters in the all scope', () => {
    const result = filterCatalog(catalogItems, {
      domainId: 'leetcode',
      categoryId: 'array',
      query: 'Promise.all',
      scope: 'all',
    });

    expect(result.map(item => item.id)).toEqual(['promise-all']);
  });
});

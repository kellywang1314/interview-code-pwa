import { describe, expect, it } from 'vitest';

import {
  catalogItems,
  catalogSections,
  findCatalogItemById,
  findCatalogItemsByCategory,
  findCatalogItemsByDomain,
} from './index';

const javascriptSourcePrefix =
  'https://github.com/kellywang1314/sourceCode/';

describe('catalog', () => {
  it('contains two domains and eight categories in the planned order', () => {
    expect(catalogSections.map(section => section.id)).toEqual([
      'leetcode',
      'javascript',
    ]);
    expect(
      catalogSections.flatMap(section =>
        section.categories.map(category => category.id),
      ),
    ).toEqual([
      'array',
      'string',
      'linked-list',
      'traversal',
      'binary-tree',
      'sort',
      'promise',
      'common',
    ]);
  });

  it('contains 36 entries split evenly between both domains', () => {
    expect(catalogItems).toHaveLength(36);
    expect(findCatalogItemsByDomain('leetcode')).toHaveLength(18);
    expect(findCatalogItemsByDomain('javascript')).toHaveLength(18);
  });

  it('keeps every entry id unique', () => {
    const ids = catalogItems.map(item => item.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains complete renderable content', () => {
    catalogItems.forEach(item => {
      expect(item.id.trim()).not.toBe('');
      expect(item.domainId.trim()).not.toBe('');
      expect(item.categoryId.trim()).not.toBe('');
      expect(item.title.trim()).not.toBe('');
      expect(item.difficulty.trim()).not.toBe('');
      expect(item.tags.length).toBeGreaterThan(0);
      expect(item.summary.trim()).not.toBe('');
      expect(item.description.trim()).not.toBe('');
      expect(item.approach.trim()).not.toBe('');
      expect(item.code.trim()).not.toBe('');
      expect(item.code).toContain('/**');
      expect(item.pitfalls.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('provides complete complexity for every LeetCode entry', () => {
    findCatalogItemsByDomain('leetcode').forEach(item => {
      expect(item.complexity?.time).toMatch(/^O\(.+\)$/);
      expect(item.complexity?.space).toMatch(/^O\(.+\)$/);
    });
  });

  it('points every JavaScript entry to the specified source repository', () => {
    findCatalogItemsByDomain('javascript').forEach(item => {
      expect(item.sourceUrl).toMatch(
        /^https:\/\/github\.com\/kellywang1314\/sourceCode\/(blob|tree)\/master\/webpack\/src\/js\/(promise|common)(\/|$)/,
      );
      expect(item.sourceUrl).toContain(javascriptSourcePrefix);
    });
  });

  it('finds entries by stable id, domain, and category', () => {
    expect(findCatalogItemById('two-sum')?.title).toBe('两数之和');
    expect(findCatalogItemById('missing-entry')).toBeUndefined();
    expect(
      findCatalogItemsByCategory('array').map(item => item.id),
    ).toEqual(['two-sum', 'three-sum', 'merge-intervals']);
    expect(
      findCatalogItemsByCategory('promise').every(
        item => item.domainId === 'javascript',
      ),
    ).toBe(true);
  });
});

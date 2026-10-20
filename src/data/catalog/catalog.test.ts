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
const hot100ArrayEntryIds = [
  'two-sum',
  'move-zeroes',
  'longest-consecutive-sequence',
  'container-with-most-water',
  'three-sum',
  'subarray-sum-equals-k',
  'maximum-subarray',
  'merge-intervals',
  'rotate-array',
  'product-of-array-except-self',
  'set-matrix-zeroes',
  'spiral-matrix',
  'rotate-image',
  'search-a-2d-matrix-ii',
];
const hot100StringEntryIds = [
  'longest-substring-without-repeating-characters',
  'find-all-anagrams-in-a-string',
  'longest-palindromic-substring',
  'group-anagrams',
];
const hot100LinkedListEntryIds = [
  'intersection-of-two-linked-lists',
  'reverse-linked-list',
  'palindrome-linked-list',
  'linked-list-cycle',
  'merge-two-sorted-lists',
  'linked-list-cycle-ii',
  'add-two-numbers',
  'remove-nth-node-from-end-of-list',
  'swap-nodes-in-pairs',
  'copy-list-with-random-pointer',
  'lru-cache',
];
const hot100TraversalEntryIds = [
  'number-of-islands',
  'rotting-oranges',
  'course-schedule',
  'implement-trie-prefix-tree',
  'permutations',
  'subsets',
  'letter-combinations-of-a-phone-number',
  'combination-sum',
  'generate-parentheses',
  'word-search',
  'palindrome-partitioning',
];
const hot100BinaryTreeEntryIds = [
  'binary-tree-inorder-traversal',
  'maximum-depth-of-binary-tree',
  'invert-binary-tree',
  'symmetric-tree',
  'diameter-of-binary-tree',
  'convert-sorted-array-to-binary-search-tree',
  'level-order-traversal',
  'validate-binary-search-tree',
  'kth-smallest-element-in-a-bst',
  'binary-tree-right-side-view',
  'flatten-binary-tree-to-linked-list',
  'construct-binary-tree-from-preorder-and-inorder-traversal',
  'path-sum-iii',
  'lowest-common-ancestor-of-binary-tree',
];
const promiseEntryIds = [
  'promise-race',
  'promise-image-loader',
  'promise-timer-sequence',
  'promise-core',
  'promise-all',
  'promise-resolve',
  'promise-finally',
  'promise-concurrency-limit',
  'promise-retry',
  'promise-serial',
  'promise-ajax',
  'promise-output-order',
  'promise-traffic-light',
];
const aiCodingEntryIds = [
  'daily-ai-coding-workflow',
  'ai-generated-code-quality',
  'ai-coding-tools-comparison',
];
const agentDevelopmentEntryIds = [
  'prompt-engineering-patterns',
  'llm-context-window',
  'rag-core-flow',
  'embedding-vector-search',
  'function-calling',
  'ai-agent-loop',
  'hallucination-mitigation',
  'fine-tuning-vs-rag',
];

const difficultyOrder = {
  简单: 0,
  中等: 1,
  困难: 2,
};

describe('catalog', () => {
  it('contains three domains and ten categories in the planned order', () => {
    expect(catalogSections.map(section => section.id)).toEqual([
      'leetcode',
      'javascript',
      'ai',
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
      'ai-coding',
      'agent-development',
    ]);
  });

  it('contains the expanded Hot 100 array and string entries', () => {
    expect(findCatalogItemsByCategory('array').map(item => item.id)).toEqual(
      hot100ArrayEntryIds,
    );
    expect(findCatalogItemsByCategory('string').map(item => item.id)).toEqual(
      hot100StringEntryIds,
    );
  });

  it('contains the expanded Hot 100 linked list and DFS entries', () => {
    expect(
      findCatalogItemsByCategory('linked-list').map(item => item.id),
    ).toEqual(hot100LinkedListEntryIds);
    expect(
      findCatalogItemsByCategory('traversal').map(item => item.id),
    ).toEqual(hot100TraversalEntryIds);
  });

  it('contains the expanded Hot 100 binary tree entries', () => {
    expect(
      findCatalogItemsByCategory('binary-tree').map(item => item.id),
    ).toEqual(hot100BinaryTreeEntryIds);
  });

  it('contains all source Promise entries', () => {
    expect(
      findCatalogItemsByCategory('promise').map(item => item.id),
    ).toEqual(promiseEntryIds);
  });

  it('contains the planned AI Coding and Agent development entries', () => {
    const aiSection = catalogSections.find(section => section.id === 'ai');

    expect(aiSection?.label).toBe('AI');
    expect(
      aiSection?.categories.map(category => category.label),
    ).toEqual(['AI Coding', 'Agent 开发']);
    expect(
      findCatalogItemsByCategory('ai-coding').map(item => item.id),
    ).toEqual(aiCodingEntryIds);
    expect(
      findCatalogItemsByCategory('agent-development').map(item => item.id),
    ).toEqual(agentDevelopmentEntryIds);
  });

  it('contains 89 easy and medium entries after hiding hard entries', () => {
    expect(catalogItems).toHaveLength(89);
    expect(findCatalogItemsByDomain('leetcode')).toHaveLength(57);
    expect(findCatalogItemsByDomain('javascript')).toHaveLength(21);
    expect(findCatalogItemsByDomain('ai')).toHaveLength(11);
    expect(catalogItems.every(item => item.difficulty !== '困难')).toBe(
      true,
    );
  });

  it('sorts entries by easy then medium difficulty in every category', () => {
    catalogSections.forEach(section => {
      section.categories.forEach(category => {
        const categoryDifficultyOrder = category.items.map(
          item => difficultyOrder[item.difficulty],
        );

        expect(categoryDifficultyOrder).toEqual(
          [...categoryDifficultyOrder].sort((left, right) => left - right),
        );
      });
    });
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
      expect(item.complexity?.time).toMatch(/O\(.+\)/);
      expect(item.complexity?.space).toMatch(/O\(.+\)/);
    });
  });

  it('documents average and worst-case quickselect complexity', () => {
    expect(
      findCatalogItemById('kth-largest-element-in-an-array')?.complexity
        ?.time,
    ).toBe('平均 O(n)，最坏 O(n²)');
  });

  it('preserves the migrated two-sum tags', () => {
    expect(findCatalogItemById('two-sum')?.tags).toEqual([
      '哈希表',
      '一次遍历',
    ]);
  });

  it('preserves the migrated reverse-linked-list tags', () => {
    expect(findCatalogItemById('reverse-linked-list')?.tags).toEqual([
      '双指针',
      '迭代',
    ]);
  });

  it('preserves the migrated level-order-traversal tags', () => {
    expect(findCatalogItemById('level-order-traversal')?.tags).toEqual([
      '广度优先',
      '队列',
    ]);
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
    ).toEqual(hot100ArrayEntryIds);
    expect(
      findCatalogItemsByCategory('promise').every(
        item => item.domainId === 'javascript',
      ),
    ).toBe(true);
    expect(findCatalogItemById('rag-core-flow')?.title).toBe(
      'RAG 核心流程',
    );
  });
});

# Catalog Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a searchable LeetCode and JavaScript catalog with a persistent desktop sidebar, mobile category drawer, 36 initial entries, and restorable URL state.

**Architecture:** Split content into typed domain files aggregated by `src/data/catalog/index.ts`. Keep filtering and URL parsing in pure utilities, then let `HomePage` own filter state and pass results to presentational components. A shared `CatalogLayout` renders the desktop sidebar or mobile drawer around both list and detail routes.

**Tech Stack:** Modern.js 3.10, React 19, TypeScript 5.9, Rsbuild/Rspack, Vitest, React Testing Library

---

## Target File Structure

```text
src/
├── components/catalog/
│   ├── CatalogLayout.test.tsx
│   ├── CatalogLayout.tsx
│   ├── CatalogSearch.tsx
│   ├── CatalogSidebar.tsx
│   └── EmptySearchResult.tsx
├── data/catalog/
│   ├── catalog.test.ts
│   ├── index.ts
│   ├── search.test.ts
│   ├── search.ts
│   ├── types.ts
│   ├── leetcode/
│   │   ├── array.ts
│   │   ├── binaryTree.ts
│   │   ├── linkedList.ts
│   │   ├── sort.ts
│   │   ├── string.ts
│   │   └── traversal.ts
│   └── javascript/
│       ├── common.ts
│       └── promise.ts
├── pages/
│   ├── HomePage.test.tsx
│   ├── HomePage.tsx
│   ├── QuestionPage.test.tsx
│   └── QuestionPage.tsx
└── utils/
    ├── catalogUrl.test.ts
    └── catalogUrl.ts
```

### Task 1: Define The Catalog Model

**Files:**
- Create: `src/data/catalog/types.ts`
- Create: `src/data/catalog/catalog.test.ts`
- Create: `src/data/catalog/index.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Ignore visual brainstorming state**

Add `.superpowers/` to `.gitignore`.

- [ ] **Step 2: Write the failing catalog contract test**

```ts
import { describe, expect, it } from 'vitest';
import { catalogItems, catalogSections, findCatalogItemById } from './index';

describe('catalog', () => {
  it('contains the planned domains and categories', () => {
    expect(catalogSections.map(section => section.id)).toEqual([
      'leetcode',
      'javascript',
    ]);
    expect(catalogSections[0].categories.map(category => category.id)).toEqual([
      'array',
      'string',
      'linked-list',
      'traversal',
      'binary-tree',
      'sort',
    ]);
    expect(catalogSections[1].categories.map(category => category.id)).toEqual([
      'promise',
      'common',
    ]);
  });

  it('contains 36 uniquely addressable entries', () => {
    const ids = catalogItems.map(item => item.id);
    expect(catalogItems).toHaveLength(36);
    expect(new Set(ids).size).toBe(ids.length);
    expect(findCatalogItemById('two-sum')?.title).toBe('两数之和');
  });
});
```

- [ ] **Step 3: Run the test and verify RED**

Run: `pnpm test src/data/catalog/catalog.test.ts`

Expected: FAIL because the catalog modules do not exist.

- [ ] **Step 4: Define shared types**

```ts
export type CatalogDomainId = 'leetcode' | 'javascript';
export type CatalogCategoryId =
  | 'array'
  | 'string'
  | 'linked-list'
  | 'traversal'
  | 'binary-tree'
  | 'sort'
  | 'promise'
  | 'common';
export type QuestionDifficulty = '简单' | '中等' | '困难';

export interface CatalogItem {
  id: string;
  domainId: CatalogDomainId;
  categoryId: CatalogCategoryId;
  title: string;
  difficulty: QuestionDifficulty;
  tags: string[];
  summary: string;
  description: string;
  approach: string;
  code: string;
  pitfalls: string[];
  complexity?: { time: string; space: string };
  sourceUrl?: string;
}

export interface CatalogCategory {
  id: CatalogCategoryId;
  label: string;
  items: CatalogItem[];
}

export interface CatalogSection {
  id: CatalogDomainId;
  label: string;
  categories: CatalogCategory[];
}
```

- [ ] **Step 5: Add the aggregate API**

Export `catalogSections`, flattened `catalogItems`, `findCatalogItemById`, and category lookup helpers from `src/data/catalog/index.ts`.

- [ ] **Step 6: Run the contract test**

Run: `pnpm test src/data/catalog/catalog.test.ts`

Expected: FAIL only because the content files and 36 entries are not populated yet.

### Task 2: Add The LeetCode Catalog

**Files:**
- Create: `src/data/catalog/leetcode/array.ts`
- Create: `src/data/catalog/leetcode/string.ts`
- Create: `src/data/catalog/leetcode/linkedList.ts`
- Create: `src/data/catalog/leetcode/traversal.ts`
- Create: `src/data/catalog/leetcode/binaryTree.ts`
- Create: `src/data/catalog/leetcode/sort.ts`
- Delete: `src/data/questions.ts`
- Delete: `src/data/questions.test.ts`

- [ ] **Step 1: Move the existing three entries**

Move `two-sum`, `reverse-linked-list`, and `level-order-traversal` into their corresponding category files and add `domainId` and new `categoryId` values.

- [ ] **Step 2: Add the remaining Hot 100 entries**

Populate exactly these entries:

```ts
export const leetcodeEntryIds = [
  'two-sum',
  'three-sum',
  'merge-intervals',
  'longest-substring-without-repeating-characters',
  'longest-palindromic-substring',
  'group-anagrams',
  'reverse-linked-list',
  'merge-two-sorted-lists',
  'linked-list-cycle',
  'number-of-islands',
  'rotting-oranges',
  'course-schedule',
  'level-order-traversal',
  'maximum-depth-of-binary-tree',
  'lowest-common-ancestor-of-binary-tree',
  'sort-colors',
  'kth-largest-element-in-an-array',
  'sort-list',
] as const;
```

Each entry must have a camelCase TypeScript implementation with a function-level comment, complete explanation, complexity, and at least two pitfalls.

- [ ] **Step 3: Run catalog tests**

Run: `pnpm test src/data/catalog/catalog.test.ts`

Expected: the LeetCode domain has 18 entries; total catalog count still fails until JavaScript content exists.

### Task 3: Add The JavaScript Catalog

**Files:**
- Create: `src/data/catalog/javascript/promise.ts`
- Create: `src/data/catalog/javascript/common.ts`

- [ ] **Step 1: Add Promise topics**

Populate exactly:

```ts
export const promiseEntryIds = [
  'promise-core',
  'promise-all',
  'promise-race',
  'promise-resolve',
  'promise-finally',
  'promise-concurrency-limit',
  'promise-retry',
  'promise-serial',
] as const;
```

- [ ] **Step 2: Add Common topics**

Populate exactly:

```ts
export const commonEntryIds = [
  'call-apply-bind',
  'compose-functions',
  'async-await-principle',
  'iterator-protocol',
  'memoize-function',
  'publish-subscribe',
  'type-detection',
  'function-currying',
  'deep-clone',
  'debounce-throttle',
] as const;
```

Every JavaScript entry must include a rewritten TypeScript example, at least two pitfalls, and a `sourceUrl` pointing to the relevant file or source directory under:

```text
https://github.com/kellywang1314/sourceCode/tree/master/webpack/src/js
```

- [ ] **Step 3: Verify the complete catalog**

Run: `pnpm test src/data/catalog/catalog.test.ts`

Expected: PASS with 18 LeetCode entries, 18 JavaScript entries, and 36 unique IDs.

- [ ] **Step 4: Commit catalog content**

```bash
git add .gitignore src/data/catalog src/data/questions.ts src/data/questions.test.ts
git commit -m "feat: add categorized interview catalog"
```

### Task 4: Add Search And URL State

**Files:**
- Create: `src/data/catalog/search.test.ts`
- Create: `src/data/catalog/search.ts`
- Create: `src/utils/catalogUrl.test.ts`
- Create: `src/utils/catalogUrl.ts`

- [ ] **Step 1: Write failing search tests**

```ts
it('searches title, tags, summary, approach, and category labels', () => {
  expect(searchCatalog(catalogItems, '两数').map(item => item.id)).toContain(
    'two-sum',
  );
  expect(searchCatalog(catalogItems, '哈希表').map(item => item.id)).toContain(
    'two-sum',
  );
  expect(searchCatalog(catalogItems, 'promise.all').map(item => item.id)).toContain(
    'promise-all',
  );
});

it('combines domain and category filters', () => {
  const result = filterCatalog(catalogItems, {
    domainId: 'leetcode',
    categoryId: 'linked-list',
    query: '',
    scope: 'current',
  });
  expect(result.every(item => item.categoryId === 'linked-list')).toBe(true);
});
```

- [ ] **Step 2: Write failing URL tests**

```ts
expect(parseCatalogUrl('?domain=javascript&category=promise&q=all')).toEqual({
  domainId: 'javascript',
  categoryId: 'promise',
  query: 'all',
  scope: 'current',
});
expect(parseCatalogUrl('?domain=bad&category=bad')).toEqual(DEFAULT_CATALOG_STATE);
```

- [ ] **Step 3: Run tests and verify RED**

Run: `pnpm test src/data/catalog/search.test.ts src/utils/catalogUrl.test.ts`

Expected: FAIL because the functions do not exist.

- [ ] **Step 4: Implement normalized filtering**

`searchCatalog` lowercases and trims the query, then searches title, tags, summary, approach, domain label, and category label. `filterCatalog` applies domain/category only when `scope === 'current'`.

- [ ] **Step 5: Implement URL parsing and serialization**

Expose:

```ts
export const DEFAULT_CATALOG_STATE: CatalogFilterState;
export function parseCatalogUrl(search: string): CatalogFilterState;
export function serializeCatalogUrl(state: CatalogFilterState): string;
```

Unknown combinations return `DEFAULT_CATALOG_STATE`.

- [ ] **Step 6: Verify GREEN**

Run: `pnpm test src/data/catalog/search.test.ts src/utils/catalogUrl.test.ts`

Expected: all search and URL tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/data/catalog/search.ts src/data/catalog/search.test.ts src/utils/catalogUrl.ts src/utils/catalogUrl.test.ts
git commit -m "feat: add catalog search state"
```

### Task 5: Build The Responsive Catalog Navigation

**Files:**
- Create: `src/components/catalog/CatalogLayout.test.tsx`
- Create: `src/components/catalog/CatalogLayout.tsx`
- Create: `src/components/catalog/CatalogSearch.tsx`
- Create: `src/components/catalog/CatalogSidebar.tsx`
- Create: `src/components/catalog/EmptySearchResult.tsx`
- Modify: `src/layouts/AppLayout.tsx`
- Modify: `src/components/AppHeader.tsx`
- Modify: `src/styles/global.css`

- [ ] **Step 1: Write failing navigation tests**

Cover:

```tsx
expect(screen.getByRole('navigation', { name: '题库分类' })).toBeVisible();
fireEvent.click(screen.getByRole('button', { name: '打开分类导航' }));
expect(screen.getByRole('dialog', { name: '题库分类' })).toBeVisible();
fireEvent.keyDown(document, { key: 'Escape' });
expect(screen.queryByRole('dialog', { name: '题库分类' })).not.toBeInTheDocument();
```

Also verify category clicks call `onFilterChange` with the selected domain and category.

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm test src/components/catalog/CatalogLayout.test.tsx`

Expected: FAIL because catalog navigation components do not exist.

- [ ] **Step 3: Implement sidebar content**

`CatalogSidebar` renders domain headings, category counts, active states, search input, and current/global search scope.

- [ ] **Step 4: Implement responsive layout**

At 960px and wider, render a 248px sticky sidebar. Below 960px, render an icon button and modal drawer with focus restoration, Escape handling, overlay close, and background scroll lock.

- [ ] **Step 5: Add focused catalog styles**

Remove the oversized home introduction from the effective first viewport. Keep direct Hex-compatible theme variables, 44px controls, visible focus, no gradients, and no nested cards.

- [ ] **Step 6: Verify navigation tests**

Run: `pnpm test src/components/catalog/CatalogLayout.test.tsx`

Expected: PASS with no React warnings.

### Task 6: Connect Home Page Filtering

**Files:**
- Modify: `src/pages/HomePage.test.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/components/QuestionList.tsx`
- Modify: `src/components/QuestionListItem.tsx`

- [ ] **Step 1: Add failing page tests**

Test URL initialization, live title search, category selection, global search, result count, and empty-state recovery.

```tsx
fireEvent.change(screen.getByRole('searchbox'), {
  target: { value: 'Promise.all' },
});
expect(screen.getByRole('link', { name: /Promise\.all/ })).toBeVisible();
expect(screen.queryByRole('link', { name: /两数之和/ })).not.toBeInTheDocument();
```

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm test src/pages/HomePage.test.tsx`

Expected: FAIL because the page does not own catalog filter state.

- [ ] **Step 3: Implement filter state**

Initialize from `location.search`, update with `history.replaceState`, filter via pure catalog utilities, and retain the active category when clearing the query.

- [ ] **Step 4: Add keyboard behavior**

`/` focuses the search input outside editable elements. Escape clears search; if the drawer is open, the drawer consumes Escape first.

- [ ] **Step 5: Verify GREEN**

Run: `pnpm test src/pages/HomePage.test.tsx`

Expected: all list filtering and recovery tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/catalog src/components/QuestionList.tsx src/components/QuestionListItem.tsx src/components/AppHeader.tsx src/layouts/AppLayout.tsx src/pages/HomePage.tsx src/pages/HomePage.test.tsx src/styles/global.css
git commit -m "feat: add searchable catalog sidebar"
```

### Task 7: Adapt Detail Pages And Offline Routes

**Files:**
- Modify: `src/pages/QuestionPage.test.tsx`
- Modify: `src/pages/QuestionPage.tsx`
- Modify: `modern.config.ts`

- [ ] **Step 1: Add failing detail tests**

Verify LeetCode renders complexity and JavaScript renders a source link while omitting complexity:

```tsx
renderQuestionPage('/questions/promise-all');
expect(screen.getByRole('link', { name: '查看参考来源' })).toHaveAttribute(
  'href',
  expect.stringContaining('github.com/kellywang1314/sourceCode'),
);
expect(screen.queryByRole('heading', { name: '复杂度' })).not.toBeInTheDocument();
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm test src/pages/QuestionPage.test.tsx`

Expected: FAIL because the page still depends on the old question model.

- [ ] **Step 3: Implement optional detail sections**

Use `findCatalogItemById`. Render complexity only when present and render an external source link with `rel="noreferrer"` when `sourceUrl` exists.

- [ ] **Step 4: Generate all SSG and PWA routes**

Update `modern.config.ts` to derive 36 concrete routes and Workbox manifest entries from `catalogItems`.

- [ ] **Step 5: Verify detail and build**

Run: `pnpm test src/pages/QuestionPage.test.tsx && pnpm typecheck && pnpm build`

Expected: tests and build pass; output contains all 36 detail HTML files.

- [ ] **Step 6: Commit**

```bash
git add src/pages/QuestionPage.tsx src/pages/QuestionPage.test.tsx modern.config.ts
git commit -m "feat: support catalog detail types"
```

### Task 8: Complete Verification

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document catalog authoring**

Update paths, category model, URL search parameters, and the source attribution rule.

- [ ] **Step 2: Run all automated checks**

Run:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
MODERNJS_DEPLOY=ghPages pnpm exec modern deploy
```

Expected: all commands exit 0 and `.output` contains Manifest, Service Worker, icons, homepage, and 36 detail pages.

- [ ] **Step 3: Verify responsive navigation**

At 360px, 390px, 412px, 960px, and 1440px verify:

- no page-level horizontal overflow;
- desktop sidebar stays visible and 248px wide;
- mobile drawer opens, traps focus, closes by Escape and overlay;
- search updates without submission;
- query parameters restore state after reload;
- direct detail routes retain navigation access;
- code blocks scroll internally.

- [ ] **Step 4: Commit documentation**

```bash
git add README.md
git commit -m "docs: explain catalog navigation"
```

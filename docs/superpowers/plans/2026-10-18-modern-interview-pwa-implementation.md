# Modern.js Interview PWA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unfinished VitePress prototype with a mobile-first Modern.js 3 React PWA that uses config-based routing and remains available offline.

**Architecture:** Modern.js owns the application runtime and delegates builds to its integrated Rsbuild/Rspack toolchain. `src/modern.routes.ts` is the only route table, `src/data/questions.ts` is the only content catalog, and focused React components render the home and detail pages. SSG emits concrete HTML routes while an Rsbuild PWA plugin adds installability and offline caching.

**Tech Stack:** Modern.js 3.10, React 19, TypeScript 5.9, Rsbuild/Rspack, Vitest, React Testing Library, rsbuild-plugin-pwa, pnpm

---

## Target File Structure

```text
.
├── .github/workflows/deploy.yml
├── modern.config.ts
├── package.json
├── public/
│   ├── app-icon-192.png
│   └── app-icon-512.png
├── src/
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   ├── CodeBlock.tsx
│   │   ├── InstallPrompt.tsx
│   │   ├── QuestionList.tsx
│   │   ├── QuestionListItem.tsx
│   │   └── QuestionMeta.tsx
│   ├── data/
│   │   ├── questions.test.ts
│   │   └── questions.ts
│   ├── layouts/AppLayout.tsx
│   ├── pages/
│   │   ├── HomePage.test.tsx
│   │   ├── HomePage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── QuestionPage.test.tsx
│   │   └── QuestionPage.tsx
│   ├── styles/global.css
│   ├── modern-app-env.d.ts
│   ├── modern.routes.ts
│   └── modern.runtime.ts
├── tsconfig.json
└── vitest.config.ts
```

### Task 1: Replace The VitePress Toolchain

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `vitest.config.ts`
- Modify: `.gitignore`
- Create: `modern.config.ts`
- Create: `src/modern-app-env.d.ts`

- [ ] **Step 1: Replace dependencies and scripts**

Use Modern.js 3.10 packages at the same version and React 19:

```json
{
  "scripts": {
    "dev": "modern dev",
    "start": "modern dev",
    "build": "modern build",
    "serve": "modern serve",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@modern-js/app-tools": "^3.10.0",
    "@modern-js/plugin-ssg": "^3.10.0",
    "@modern-js/runtime": "^3.10.0",
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^7.0.1",
    "@testing-library/react": "^16.3.3",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "jsdom": "^30.1.3",
    "rsbuild-plugin-pwa": "^2.10.0",
    "typescript": "^5.9.3",
    "vitest": "^5.0.5"
  }
}
```

- [ ] **Step 2: Install the new dependency graph**

Run: `pnpm install`

Expected: installation exits with code 0 and `pnpm-lock.yaml` no longer contains VitePress or Vue as direct project dependencies.

- [ ] **Step 3: Configure TypeScript and Vitest**

Set `jsx` to `react-jsx`, include `src/**/*.ts`, `src/**/*.tsx`, `modern.config.ts`, and `vitest.config.ts`, and use a jsdom test environment with `src/test/setup.ts`.

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] **Step 4: Add the minimal Modern.js configuration**

```ts
import { appTools, defineConfig } from '@modern-js/app-tools';
import { ssgPlugin } from '@modern-js/plugin-ssg';

export default defineConfig({
  plugins: [appTools(), ssgPlugin()],
});
```

- [ ] **Step 5: Verify the toolchain baseline**

Run: `pnpm typecheck && pnpm test -- --passWithNoTests`

Expected: both commands exit with code 0.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml tsconfig.json vitest.config.ts .gitignore modern.config.ts src/modern-app-env.d.ts src/test/setup.ts
git commit -m "build: migrate to Modern.js toolchain"
```

### Task 2: Expand The Typed Question Catalog

**Files:**
- Move: `src/questions.test.ts` to `src/data/questions.test.ts`
- Move: `src/questions.ts` to `src/data/questions.ts`

- [ ] **Step 1: Write failing catalog tests**

Add tests for grouping, unique IDs, complete content, and lookup:

```ts
it('finds a question by id', () => {
  expect(findQuestionById('two-sum')?.title).toBe('两数之和');
  expect(findQuestionById('missing-question')).toBeUndefined();
});

it('contains complete renderable content', () => {
  questions.forEach(question => {
    expect(question.description.trim()).not.toBe('');
    expect(question.approach.trim()).not.toBe('');
    expect(question.code).toContain('function');
    expect(question.pitfalls.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm test src/data/questions.test.ts`

Expected: FAIL because the expanded fields and `findQuestionById` do not exist.

- [ ] **Step 3: Add the expanded model and lookup**

```ts
export interface Question {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  difficulty: QuestionDifficulty;
  tags: string[];
  summary: string;
  description: string;
  approach: string;
  code: string;
  complexity: {
    time: string;
    space: string;
  };
  pitfalls: string[];
}

/** Finds a question by its stable URL identifier. */
export function findQuestionById(questionId: string): Question | undefined {
  return questions.find(question => question.id === questionId);
}
```

Populate the new fields from the three existing Markdown files without changing their algorithm behavior.

- [ ] **Step 4: Verify GREEN**

Run: `pnpm test src/data/questions.test.ts`

Expected: all catalog tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/questions.ts src/data/questions.test.ts
git commit -m "feat: add typed interview question content"
```

### Task 3: Add Config-Based Routing

**Files:**
- Create: `src/modern.routes.ts`
- Create: `src/layouts/AppLayout.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/QuestionPage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Create: `src/modern.runtime.ts`

- [ ] **Step 1: Define the route table**

Use config routes only and ignore the `fileRoutes` argument:

```ts
import { defineRoutes } from '@modern-js/runtime/config-routes';

export default defineRoutes(({ layout, page, $ }) => [
  layout('layouts/AppLayout.tsx', '', [
    page('pages/HomePage.tsx', '/'),
    page('pages/QuestionPage.tsx', 'questions/:questionId'),
    $('pages/NotFoundPage.tsx', '*'),
  ]),
]);
```

- [ ] **Step 2: Add the layout and route page shells**

`AppLayout` renders `<Outlet />`; `QuestionPage` reads `questionId` with `useParams`; `NotFoundPage` links back to `/`.

Every exported function receives a function-level JSDoc comment.

- [ ] **Step 3: Inspect generated routes**

Run: `pnpm exec modern routes`

Expected: `dist/routes-inspect.json` contains `/`, `/questions/:questionId`, and `*`, with no convention-generated page routes.

- [ ] **Step 4: Add explicit SSG routes**

Import the question IDs into `modern.config.ts` and configure:

```ts
output: {
  ssg: {
    routes: [
      '/',
      ...questions.map(question => `/questions/${question.id}`),
    ],
  },
},
```

- [ ] **Step 5: Run a production build**

Run: `pnpm build`

Expected: Modern.js builds every concrete question path without route or hydration errors.

- [ ] **Step 6: Commit**

```bash
git add modern.config.ts src/modern.routes.ts src/modern.runtime.ts src/layouts src/pages
git commit -m "feat: add Modern.js config routes"
```

### Task 4: Build The Mobile Question Index

**Files:**
- Create: `src/pages/HomePage.test.tsx`
- Create: `src/components/QuestionList.tsx`
- Create: `src/components/QuestionListItem.tsx`
- Create: `src/components/QuestionMeta.tsx`
- Modify: `src/pages/HomePage.tsx`

- [ ] **Step 1: Write the failing home page test**

```tsx
it('renders grouped question links', () => {
  render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: '数组与哈希' })).toBeVisible();
  expect(screen.getByRole('link', { name: /两数之和/ })).toHaveAttribute(
    'href',
    '/questions/two-sum',
  );
  expect(screen.getAllByRole('link')).toHaveLength(3);
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `pnpm test src/pages/HomePage.test.tsx`

Expected: FAIL because the grouped list is not rendered.

- [ ] **Step 3: Implement the index components**

`HomePage` calls `getQuestionGroups(questions)`. `QuestionList` renders one section per group. `QuestionListItem` uses Modern.js `Link` and makes the full row clickable. `QuestionMeta` maps difficulty to a stable CSS class.

- [ ] **Step 4: Verify GREEN**

Run: `pnpm test src/pages/HomePage.test.tsx`

Expected: the home page test passes with no React warnings.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/pages/HomePage.test.tsx src/components/QuestionList.tsx src/components/QuestionListItem.tsx src/components/QuestionMeta.tsx
git commit -m "feat: add mobile question index"
```

### Task 5: Build The Detail Page, Header, And Theme

**Files:**
- Create: `src/pages/QuestionPage.test.tsx`
- Create: `src/components/AppHeader.tsx`
- Create: `src/components/CodeBlock.tsx`
- Create: `src/components/InstallPrompt.tsx`
- Modify: `src/pages/QuestionPage.tsx`
- Modify: `src/layouts/AppLayout.tsx`
- Create: `src/styles/global.css`

- [ ] **Step 1: Write failing detail tests**

Render the detail content through a memory router:

```tsx
it('renders a known question', () => {
  renderQuestionPage('/questions/two-sum');

  expect(screen.getByRole('heading', { name: '两数之和' })).toBeVisible();
  expect(screen.getByText('O(n)', { selector: 'code' })).toBeVisible();
  expect(screen.getByText(/先查询再写入/)).toBeVisible();
});

it('renders not found content for an unknown question', () => {
  renderQuestionPage('/questions/unknown');

  expect(screen.getByRole('heading', { name: '题目不存在' })).toBeVisible();
});
```

- [ ] **Step 2: Run tests and verify RED**

Run: `pnpm test src/pages/QuestionPage.test.tsx`

Expected: FAIL because the detail and not-found states are missing.

- [ ] **Step 3: Implement the detail page**

Use `findQuestionById`, render semantic sections for approach, code, complexity, and pitfalls, and reuse `QuestionMeta`.

`CodeBlock` accepts `code` and `language` props and renders a stable scroll container without changing layout size.

- [ ] **Step 4: Implement theme persistence**

```ts
/** Applies and persists the selected color theme. */
export function applyTheme(theme: ColorTheme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('colorTheme', theme);
}
```

Initialize from `localStorage`, then `prefers-color-scheme`. Use an icon button with an accessible label.

- [ ] **Step 5: Add mobile-first styles**

Implement 16px mobile gutters, 44px controls, 56px question rows, safe-area padding, wrapped metadata, horizontally scrolling code, visible keyboard focus, and a restrained white/charcoal/teal/coral palette. Use direct hex values and no gradients.

- [ ] **Step 6: Verify tests and type checking**

Run: `pnpm test && pnpm typecheck`

Expected: all tests pass and TypeScript reports no errors.

- [ ] **Step 7: Commit**

```bash
git add src/pages src/components src/layouts src/styles
git commit -m "feat: add question reading experience"
```

### Task 6: Add PWA Assets And GitHub Pages Deployment

**Files:**
- Modify: `modern.config.ts`
- Create: `public/app-icon-192.png`
- Create: `public/app-icon-512.png`
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`

- [ ] **Step 1: Configure the repository base path**

For production builds set both:

```ts
server: {
  baseUrl: '/interview-code-pwa',
},
output: {
  assetPrefix: '/interview-code-pwa',
},
```

Keep `/` in local development by deriving the value from `NODE_ENV`.

- [ ] **Step 2: Configure `rsbuild-plugin-pwa`**

Register `pluginPWA` through `builderPlugins`. Configure a standalone manifest, 192px and 512px PNG icons, `start_url` and `scope` under the repository base path, and an auto-update service worker that precaches generated assets.

- [ ] **Step 3: Add app icons**

Generate square bitmap icons with a high-contrast code-bracket mark, then verify their exact dimensions:

Run: `sips -g pixelWidth -g pixelHeight public/app-icon-192.png public/app-icon-512.png`

Expected: one image is 192x192 and the other is 512x512.

- [ ] **Step 4: Add GitHub Actions deployment**

Use Node 22, pnpm 10, `pnpm install --frozen-lockfile`, `pnpm test`, `pnpm typecheck`, and `MODERNJS_DEPLOY=ghPages pnpm exec modern deploy`. Upload the generated `.output` directory with `actions/upload-pages-artifact`.

- [ ] **Step 5: Document local and deployment workflows**

Document `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm build`, adding a typed question, PWA installation, and GitHub Pages setup.

- [ ] **Step 6: Verify generated PWA output**

Run: `pnpm test && pnpm typecheck && pnpm build`

Expected: all checks pass and the build contains the manifest, service worker, icons, homepage, and three concrete question pages.

- [ ] **Step 7: Commit**

```bash
git add modern.config.ts public .github/workflows/deploy.yml README.md
git commit -m "feat: add offline PWA deployment"
```

### Task 7: Remove The Old Stack And Verify Browsers

**Files:**
- Delete: `.vitepress/`
- Delete: `questions/`
- Delete: `src/questions.ts`
- Delete: `src/questions.test.ts`
- Modify: `.gitignore`

- [ ] **Step 1: Delete obsolete VitePress and Markdown files**

Remove only files replaced by the Modern.js implementation. Keep design and implementation documents.

- [ ] **Step 2: Verify no old stack references remain**

Run: `grep -R "vitepress\\|vite-plugin-pwa\\|from 'vue'" --exclude-dir=node_modules --exclude=pnpm-lock.yaml .`

Expected: no source or configuration matches.

- [ ] **Step 3: Run the complete automated verification**

Run: `pnpm test && pnpm typecheck && pnpm build`

Expected: all tests pass, type checking succeeds, and Modern.js completes the production build.

- [ ] **Step 4: Start the production preview**

Run: `pnpm serve -- --host 127.0.0.1`

Expected: the application is available locally without browser console errors.

- [ ] **Step 5: Verify desktop and mobile layouts**

Use Playwright at 360x800, 390x844, 412x915, and 1440x900. Confirm:

- No page-level horizontal overflow.
- Question rows remain at least 56px high.
- Theme and install controls do not shift the header.
- Code scrolls within its own block.
- Direct question URLs render correctly.
- Unknown routes show the 404 page.
- Manifest and service worker requests succeed.

- [ ] **Step 6: Commit final cleanup**

```bash
git add -A
git commit -m "chore: remove VitePress prototype"
```

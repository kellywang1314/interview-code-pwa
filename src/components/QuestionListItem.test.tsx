import { MemoryRouter } from '@modern-js/runtime/router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { CatalogItem } from '../data/catalog';
import { QuestionListItem } from './QuestionListItem';

/** 创建一个用于列表项渲染测试的目录条目。 */
function createCatalogItem(): CatalogItem {
  return {
    id: 'promise-all',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise.all 并发控制',
    difficulty: '中等',
    tags: ['Promise', '并发'],
    summary: '展示 Promise.all 的并发执行和失败短路行为。',
    description: '详情页保留完整题目说明。',
    approach: '使用 Promise.all 聚合多个异步任务。',
    code: 'Promise.all([]);',
    pitfalls: ['注意失败短路。'],
  };
}

describe('QuestionListItem', () => {
  it('renders a compact searchable row with purpose summary but no tags', () => {
    render(
      <MemoryRouter>
        <QuestionListItem
          question={createCatalogItem()}
          sequence={3}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('03')).toBeVisible();
    expect(
      screen.getByRole('link', { name: /Promise\.all 并发控制/ }),
    ).toBeVisible();
    expect(screen.getByText('中等')).toBeVisible();
    expect(
      screen.getByText('展示 Promise.all 的并发执行和失败短路行为。'),
    ).toBeVisible();
    expect(screen.queryByText('Promise')).not.toBeInTheDocument();
    expect(screen.queryByText('并发')).not.toBeInTheDocument();
  });
});

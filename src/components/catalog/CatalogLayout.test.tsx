import { MemoryRouter } from '@modern-js/runtime/router';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CatalogFilterState } from '../../data/catalog/search';
import { CatalogLayout } from './CatalogLayout';

/** 渲染带有路由上下文的目录布局。 */
function renderCatalogLayout(
  onFilterChange = vi.fn<(state: CatalogFilterState) => void>(),
) {
  return {
    onFilterChange,
    ...render(
      <MemoryRouter initialEntries={['/']}>
        <CatalogLayout onFilterChange={onFilterChange}>
          <main>目录正文</main>
        </CatalogLayout>
      </MemoryRouter>,
    ),
  };
}

describe('CatalogLayout', () => {
  beforeEach(() => {
    document.body.style.overflow = '';
    localStorage.setItem('colorTheme', 'light');
  });

  it('renders category navigation and reports category selection', () => {
    const { onFilterChange } = renderCatalogLayout();
    const navigation = screen.getByRole('navigation', {
      name: '题库分类',
    });

    fireEvent.click(
      within(navigation).getByRole('button', {
        name: '链表 11',
      }),
    );

    expect(onFilterChange).toHaveBeenCalledWith({
      domainId: 'leetcode',
      categoryId: 'linked-list',
      query: '',
      scope: 'current',
    });
  });

  it('opens the mobile drawer and closes it with Escape', async () => {
    renderCatalogLayout();
    const openButton = screen.getByRole('button', {
      name: '打开分类导航',
    });

    fireEvent.click(openButton);

    const dialog = screen.getByRole('dialog', {
      name: '题库分类',
    });
    expect(dialog).toBeVisible();
    expect(document.body.style.overflow).toBe('hidden');

    await waitFor(() => {
      expect(
        within(dialog).getByRole('button', {
          name: '关闭分类导航',
        }),
      ).toHaveFocus();
    });

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(
      screen.queryByRole('dialog', { name: '题库分类' }),
    ).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(openButton).toHaveFocus();
  });

  it('closes the mobile drawer from its overlay', () => {
    renderCatalogLayout();

    fireEvent.click(
      screen.getByRole('button', { name: '打开分类导航' }),
    );
    fireEvent.click(
      screen.getByRole('button', { name: '关闭分类导航遮罩' }),
    );

    expect(
      screen.queryByRole('dialog', { name: '题库分类' }),
    ).not.toBeInTheDocument();
  });
});

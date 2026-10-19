import {
  MemoryRouter,
  useLocation,
} from '@modern-js/runtime/router';
import {
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CatalogLayout } from '../components/catalog/CatalogLayout';
import HomePage from './HomePage';

/** 显示当前路由查询字符串，便于验证可恢复的筛选状态。 */
function LocationProbe() {
  const location = useLocation();
  return <output aria-label="当前查询参数">{location.search}</output>;
}

/** 在完整目录布局中渲染指定首页 URL。 */
function renderHomePage(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <CatalogLayout>
        <HomePage />
        <LocationProbe />
      </CatalogLayout>
    </MemoryRouter>,
  );
}

describe('HomePage', () => {
  it('restores domain and category filters from the URL', () => {
    renderHomePage(
      '/?domain=javascript&category=promise',
    );

    expect(
      screen.getByRole('heading', { name: 'Promise' }),
    ).toBeVisible();
    expect(screen.getByText('8 个结果')).toBeVisible();
    expect(
      screen.getByRole('link', { name: /Promise\.all/ }),
    ).toBeVisible();
    expect(
      screen.queryByRole('link', { name: /两数之和/ }),
    ).not.toBeInTheDocument();
  });

  it('searches live and writes the query to the URL', () => {
    renderHomePage('/?domain=javascript');

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Promise.all' },
    });

    expect(
      screen.getByRole('link', { name: /Promise\.all/ }),
    ).toBeVisible();
    expect(screen.getByText('1 个结果')).toBeVisible();
    expect(
      screen.getByLabelText('当前查询参数'),
    ).toHaveTextContent(
      '?domain=javascript&q=Promise.all',
    );
  });

  it('combines category selection with current-scope search', () => {
    renderHomePage();
    const navigation = screen.getByRole('navigation', {
      name: '题库分类',
    });

    fireEvent.click(
      within(navigation).getByRole('button', {
        name: '字符串 5',
      }),
    );

    expect(screen.getByText('5 个结果')).toBeVisible();
    expect(
      screen.getByRole('link', {
        name: /无重复字符的最长子串/,
      }),
    ).toBeVisible();
    expect(
      screen.queryByRole('link', { name: /两数之和/ }),
    ).not.toBeInTheDocument();
  });

  it('can recover an empty current search by switching to all', () => {
    renderHomePage('/?domain=leetcode&category=array');

    fireEvent.change(screen.getByRole('searchbox'), {
      target: { value: 'Promise.all' },
    });

    expect(
      screen.getByRole('heading', { name: '没有匹配结果' }),
    ).toBeVisible();
    fireEvent.click(
      screen.getByRole('button', {
        name: '切换到全站搜索',
      }),
    );

    expect(
      screen.getByRole('link', { name: /Promise\.all/ }),
    ).toBeVisible();
    expect(screen.getByText('1 个结果')).toBeVisible();
  });

  it('supports search focus and clearing keyboard shortcuts', () => {
    renderHomePage('/?q=%E5%93%88%E5%B8%8C');
    const searchbox = screen.getByRole('searchbox');

    fireEvent.keyDown(document, { key: '/' });
    expect(searchbox).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(searchbox).toHaveValue('');
    expect(
      screen.getByRole('link', { name: /两数之和/ }),
    ).toBeVisible();
  });
});

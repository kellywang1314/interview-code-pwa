import { MemoryRouter, Route, Routes } from '@modern-js/runtime/router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import QuestionPage from './QuestionPage';

/** Renders the question route at a specific in-memory URL. */
function renderQuestionPage(pathname: string) {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <Routes>
        <Route path="/questions/:questionId" element={<QuestionPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('QuestionPage', () => {
  it('renders a known question', () => {
    renderQuestionPage('/questions/two-sum');

    expect(screen.getByRole('heading', { name: '两数之和' })).toBeVisible();
    expect(
      screen.getByRole('heading', { name: '复杂度' }),
    ).toBeVisible();
    expect(screen.getAllByText('O(n)', { selector: 'code' })).toHaveLength(2);
    expect(screen.getByText(/先查询再写入/)).toBeVisible();
  });

  it('renders a JavaScript source without an empty complexity section', () => {
    renderQuestionPage('/questions/promise-all');

    expect(
      screen.getByRole('heading', { name: 'Promise.all' }),
    ).toBeVisible();
    expect(
      screen.getByRole('link', { name: '查看参考来源' }),
    ).toHaveAttribute(
      'href',
      expect.stringContaining(
        'github.com/kellywang1314/sourceCode',
      ),
    );
    expect(
      screen.queryByRole('heading', { name: '复杂度' }),
    ).not.toBeInTheDocument();
  });

  it('renders not found content for an unknown question', () => {
    renderQuestionPage('/questions/unknown');

    expect(
      screen.getByRole('heading', { name: '题目不存在' }),
    ).toBeVisible();
  });
});

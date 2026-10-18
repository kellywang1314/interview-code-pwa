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
    expect(screen.getAllByText('O(n)', { selector: 'code' })).toHaveLength(2);
    expect(screen.getByText(/先查询再写入/)).toBeVisible();
  });

  it('renders not found content for an unknown question', () => {
    renderQuestionPage('/questions/unknown');

    expect(
      screen.getByRole('heading', { name: '题目不存在' }),
    ).toBeVisible();
  });
});

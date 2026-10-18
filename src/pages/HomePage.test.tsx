import { MemoryRouter } from '@modern-js/runtime/router';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders grouped question links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { name: '数组与哈希' }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /两数之和/ })).toHaveAttribute(
      'href',
      '/questions/two-sum',
    );
    expect(screen.getAllByRole('link')).toHaveLength(3);
  });
});

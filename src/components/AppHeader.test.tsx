import { MemoryRouter } from '@modern-js/runtime/router';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.setItem('colorTheme', 'light');
    document.documentElement.dataset.theme = 'light';
  });

  it('toggles and persists the color theme', () => {
    render(
      <MemoryRouter>
        <AppHeader />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: '切换到深色主题' }));

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('colorTheme')).toBe('dark');
    expect(
      screen.getByRole('button', { name: '切换到浅色主题' }),
    ).toBeVisible();
  });
});

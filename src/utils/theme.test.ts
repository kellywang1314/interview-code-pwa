import { beforeEach, describe, expect, it } from 'vitest';

import { applyTheme, resolveTheme } from './theme';

describe('theme utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('prefers a saved theme over the system preference', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('uses the system preference without a saved theme', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('applies and persists the selected theme', () => {
    applyTheme('dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('colorTheme')).toBe('dark');
  });
});

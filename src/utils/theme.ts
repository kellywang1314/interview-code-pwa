export type ColorTheme = 'light' | 'dark';

/** Resolves the initial color theme from saved and system preferences. */
export function resolveTheme(
  savedTheme: string | null,
  prefersDark: boolean,
): ColorTheme {
  if (savedTheme === 'light' || savedTheme === 'dark') {
    return savedTheme;
  }

  return prefersDark ? 'dark' : 'light';
}

/** Applies and persists the selected color theme. */
export function applyTheme(theme: ColorTheme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('colorTheme', theme);
}

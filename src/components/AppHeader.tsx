import { Link } from '@modern-js/runtime/router';
import { Code2, Menu, Moon, Search, Sun } from 'lucide-react';
import {
  type RefObject,
  useEffect,
  useState,
} from 'react';

import {
  applyTheme,
  resolveTheme,
  type ColorTheme,
} from '../utils/theme';
import { InstallPrompt } from './InstallPrompt';

interface AppHeaderProps {
  drawerTriggerRef?: RefObject<HTMLButtonElement | null>;
  onFocusSearch?: () => void;
  onOpenCatalog?: () => void;
}

/** Renders persistent application navigation and controls. */
export function AppHeader({
  drawerTriggerRef,
  onFocusSearch,
  onOpenCatalog,
}: AppHeaderProps = {}) {
  const [theme, setTheme] = useState<ColorTheme>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    return resolveTheme(
      localStorage.getItem('colorTheme'),
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
    );
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  /** Switches between the light and dark color themes. */
  function handleToggleTheme() {
    setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
  }

  const nextThemeLabel =
    theme === 'light' ? '切换到深色主题' : '切换到浅色主题';

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link className="brand-link" to="/">
          <span aria-hidden="true" className="brand-link__mark">
            <Code2 size={20} strokeWidth={2.2} />
          </span>
          <span>代码速查</span>
        </Link>
        <div className="app-header__tools">
          {onOpenCatalog ? (
            <button
              aria-label="打开分类导航"
              className="icon-button app-header__mobile-tool"
              onClick={onOpenCatalog}
              ref={drawerTriggerRef}
              title="打开分类导航"
              type="button"
            >
              <Menu aria-hidden="true" size={19} />
            </button>
          ) : null}
          {onFocusSearch ? (
            <button
              aria-label="搜索题库"
              className="icon-button app-header__mobile-tool"
              onClick={onFocusSearch}
              title="搜索题库"
              type="button"
            >
              <Search aria-hidden="true" size={18} />
            </button>
          ) : null}
          <InstallPrompt />
          <button
            aria-label={nextThemeLabel}
            className="icon-button"
            onClick={handleToggleTheme}
            title={nextThemeLabel}
            type="button"
          >
            {theme === 'light' ? (
              <Moon aria-hidden="true" size={18} />
            ) : (
              <Sun aria-hidden="true" size={18} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

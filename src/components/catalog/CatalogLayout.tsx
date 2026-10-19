import {
  useLocation,
  useNavigate,
} from '@modern-js/runtime/router';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { X } from 'lucide-react';

import type { CatalogFilterState } from '../../data/catalog/search';
import {
  parseCatalogUrl,
  serializeCatalogUrl,
} from '../../utils/catalogUrl';
import { AppHeader } from '../AppHeader';
import { CatalogSidebar } from './CatalogSidebar';

interface CatalogLayoutProps {
  children: ReactNode;
  onFilterChange?: (state: CatalogFilterState) => void;
}

interface CatalogLayoutContextValue {
  filterState: CatalogFilterState;
  focusSearch: () => void;
  setFilterState: (state: CatalogFilterState) => void;
}

const CatalogLayoutContext =
  createContext<CatalogLayoutContextValue | null>(null);

/** 读取共享目录布局中的筛选状态与操作。 */
export function useCatalogLayout(): CatalogLayoutContextValue {
  const context = useContext(CatalogLayoutContext);

  if (!context) {
    throw new Error('useCatalogLayout must be used within CatalogLayout');
  }

  return context;
}

/** 渲染共享桌面侧栏、移动抽屉和页面内容区域。 */
export function CatalogLayout({
  children,
  onFilterChange,
}: CatalogLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const drawerCloseRef = useRef<HTMLButtonElement>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const shouldFocusMobileSearchRef = useRef(false);
  const filterState = useMemo(
    () => parseCatalogUrl(location.search),
    [location.search],
  );

  /** 将下一筛选状态写入 URL，并通知受控测试或外部调用方。 */
  function setFilterState(nextState: CatalogFilterState) {
    onFilterChange?.(nextState);
    navigate({
      pathname: '/',
      search: serializeCatalogUrl(nextState),
    });
  }

  /** 打开移动目录抽屉，并记录焦点恢复目标。 */
  function openDrawer(focusSearch = false) {
    shouldFocusMobileSearchRef.current = focusSearch;
    setIsDrawerOpen(true);
  }

  /** 关闭移动目录抽屉并把焦点还给触发按钮。 */
  function closeDrawer() {
    setIsDrawerOpen(false);
    drawerTriggerRef.current?.focus();
  }

  /** 聚焦当前可用的搜索输入框。 */
  function focusSearch() {
    const isDesktop = window.matchMedia
      ? window.matchMedia('(min-width: 960px)').matches
      : window.innerWidth >= 960;

    if (isDesktop) {
      desktopSearchRef.current?.focus();
      return;
    }

    openDrawer(true);
  }

  useEffect(() => {
    if (!isDrawerOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    if (shouldFocusMobileSearchRef.current) {
      mobileSearchRef.current?.focus();
      shouldFocusMobileSearchRef.current = false;
    } else {
      drawerCloseRef.current?.focus();
    }

    /** 在抽屉内处理 Escape 和焦点循环。 */
    function handleDrawerKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeDrawer();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const drawer = drawerCloseRef.current?.closest(
        '[role="dialog"]',
      );
      const focusableElements = drawer
        ? Array.from(
            drawer.querySelectorAll<HTMLElement>(
              'button:not([disabled]), input:not([disabled]), a[href]',
            ),
          )
        : [];

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener('keydown', handleDrawerKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleDrawerKeyDown);
    };
  }, [isDrawerOpen]);

  const contextValue = useMemo(
    () => ({ filterState, focusSearch, setFilterState }),
    [filterState],
  );

  return (
    <CatalogLayoutContext.Provider value={contextValue}>
      <AppHeader
        drawerTriggerRef={drawerTriggerRef}
        onFocusSearch={focusSearch}
        onOpenCatalog={() => openDrawer()}
      />

      <div className="catalog-layout">
        <aside className="catalog-layout__sidebar">
          <CatalogSidebar
            filterState={filterState}
            inputRef={desktopSearchRef}
            onFilterChange={setFilterState}
          />
        </aside>
        <div className="catalog-layout__content">{children}</div>
      </div>

      {isDrawerOpen ? (
        <div className="catalog-drawer">
          <button
            aria-label="关闭分类导航遮罩"
            className="catalog-drawer__overlay"
            onClick={closeDrawer}
            type="button"
          />
          <section
            aria-label="题库分类"
            aria-modal="true"
            className="catalog-drawer__panel"
            role="dialog"
          >
            <header className="catalog-drawer__header">
              <strong>题库分类</strong>
              <button
                aria-label="关闭分类导航"
                className="icon-button"
                onClick={closeDrawer}
                ref={drawerCloseRef}
                type="button"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </header>
            <CatalogSidebar
              filterState={filterState}
              inputRef={mobileSearchRef}
              onFilterChange={setFilterState}
              onNavigate={closeDrawer}
            />
          </section>
        </div>
      ) : null}
    </CatalogLayoutContext.Provider>
  );
}

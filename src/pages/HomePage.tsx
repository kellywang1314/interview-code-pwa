import { useEffect } from 'react';

import { QuestionList } from '../components/QuestionList';
import { EmptySearchResult } from '../components/catalog/EmptySearchResult';
import { useCatalogLayout } from '../components/catalog/CatalogLayout';
import { catalogItems, catalogSections } from '../data/catalog';
import { filterCatalog } from '../data/catalog/search';

/** 根据筛选状态返回当前目录范围的可读标题。 */
function getCatalogHeading(
  domainId: string,
  categoryId?: string,
): string {
  const section = catalogSections.find(item => item.id === domainId);
  const category = section?.categories.find(
    item => item.id === categoryId,
  );

  return category
    ? `${section?.label} / ${category.label}`
    : (section?.label ?? '题库目录');
}

/** 判断键盘事件是否来自可编辑元素。 */
function isEditableTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/** Renders the interview question index. */
export default function HomePage() {
  const { filterState, focusSearch, setFilterState } =
    useCatalogLayout();
  const filteredItems = filterCatalog(catalogItems, filterState);
  const heading = getCatalogHeading(
    filterState.domainId,
    filterState.categoryId,
  );

  useEffect(() => {
    /** 处理首页搜索聚焦和清空快捷键。 */
    function handleCatalogShortcut(event: KeyboardEvent) {
      if (
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !isEditableTarget(event.target)
      ) {
        event.preventDefault();
        focusSearch();
        return;
      }

      if (event.key === 'Escape' && filterState.query) {
        event.preventDefault();
        setFilterState({ ...filterState, query: '' });
      }
    }

    document.addEventListener('keydown', handleCatalogShortcut);
    return () =>
      document.removeEventListener('keydown', handleCatalogShortcut);
  }, [filterState, focusSearch, setFilterState]);

  return (
    <main className="page-shell home-page">
      <header className="catalog-summary">
        <div>
          <p className="catalog-summary__eyebrow">INTERVIEW INDEX</p>
          <h1>{heading}</h1>
        </div>
        <p className="catalog-summary__count">
          {filteredItems.length} 个结果
        </p>
      </header>

      {filteredItems.length > 0 ? (
        <QuestionList items={filteredItems} />
      ) : (
        <EmptySearchResult
          canSearchAll={filterState.scope === 'current'}
          onClearSearch={() =>
            setFilterState({ ...filterState, query: '' })
          }
          onSearchAll={() =>
            setFilterState({ ...filterState, scope: 'all' })
          }
        />
      )}
    </main>
  );
}

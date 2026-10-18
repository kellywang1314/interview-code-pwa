import type { RefObject } from 'react';

import { catalogSections } from '../../data/catalog';
import type { CatalogFilterState } from '../../data/catalog/search';
import { CatalogSearch } from './CatalogSearch';

interface CatalogSidebarProps {
  filterState: CatalogFilterState;
  inputRef?: RefObject<HTMLInputElement | null>;
  onFilterChange: (state: CatalogFilterState) => void;
  onNavigate?: () => void;
}

/** 渲染可复用于桌面侧栏与移动抽屉的目录导航。 */
export function CatalogSidebar({
  filterState,
  inputRef,
  onFilterChange,
  onNavigate,
}: CatalogSidebarProps) {
  /** 选择大类并回到该大类的全部条目。 */
  function handleDomainChange(
    domainId: CatalogFilterState['domainId'],
  ) {
    onFilterChange({
      domainId,
      query: filterState.query,
      scope: 'current',
    });
    onNavigate?.();
  }

  /** 选择子分类并保留当前搜索词。 */
  function handleCategoryChange(
    domainId: CatalogFilterState['domainId'],
    categoryId: NonNullable<CatalogFilterState['categoryId']>,
  ) {
    onFilterChange({
      domainId,
      categoryId,
      query: filterState.query,
      scope: 'current',
    });
    onNavigate?.();
  }

  return (
    <div className="catalog-sidebar">
      <CatalogSearch
        filterState={filterState}
        inputRef={inputRef}
        onFilterChange={onFilterChange}
      />

      <nav aria-label="题库分类" className="catalog-navigation">
        {catalogSections.map(section => {
          const isDomainActive =
            filterState.domainId === section.id &&
            !filterState.categoryId;
          const itemCount = section.categories.reduce(
            (count, category) => count + category.items.length,
            0,
          );

          return (
            <section
              className="catalog-navigation__section"
              key={section.id}
            >
              <button
                aria-label={`${section.label} ${itemCount}`}
                aria-pressed={isDomainActive}
                className="catalog-navigation__domain"
                onClick={() => handleDomainChange(section.id)}
                type="button"
              >
                <span>{section.label}</span>
                <span>{itemCount}</span>
              </button>

              <div className="catalog-navigation__categories">
                {section.categories.map(category => (
                  <button
                    aria-label={`${category.label} ${category.items.length}`}
                    aria-pressed={
                      filterState.domainId === section.id &&
                      filterState.categoryId === category.id
                    }
                    className="catalog-navigation__category"
                    key={category.id}
                    onClick={() =>
                      handleCategoryChange(section.id, category.id)
                    }
                    type="button"
                  >
                    <span>{category.label}</span>
                    <span>{category.items.length}</span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </nav>
    </div>
  );
}

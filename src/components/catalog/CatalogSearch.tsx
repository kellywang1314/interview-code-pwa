import { Search, X } from 'lucide-react';
import type { RefObject } from 'react';

import type { CatalogFilterState } from '../../data/catalog/search';

interface CatalogSearchProps {
  filterState: CatalogFilterState;
  inputRef?: RefObject<HTMLInputElement | null>;
  onFilterChange: (state: CatalogFilterState) => void;
}

/** 渲染目录关键词输入框和搜索范围切换控件。 */
export function CatalogSearch({
  filterState,
  inputRef,
  onFilterChange,
}: CatalogSearchProps) {
  /** 更新搜索关键词并保留当前分类与搜索范围。 */
  function handleQueryChange(query: string) {
    onFilterChange({ ...filterState, query });
  }

  /** 更新搜索范围并保留当前分类与关键词。 */
  function handleScopeChange(scope: CatalogFilterState['scope']) {
    onFilterChange({ ...filterState, scope });
  }

  return (
    <div className="catalog-search">
      <label className="catalog-search__field">
        <span className="sr-only">搜索题名或关键词</span>
        <Search aria-hidden="true" size={17} />
        <input
          autoComplete="off"
          onChange={event => handleQueryChange(event.target.value)}
          placeholder="题名、标签或思路"
          ref={inputRef}
          type="search"
          value={filterState.query}
        />
        {filterState.query ? (
          <button
            aria-label="清空搜索"
            className="catalog-search__clear"
            onClick={() => handleQueryChange('')}
            type="button"
          >
            <X aria-hidden="true" size={15} />
          </button>
        ) : (
          <kbd aria-label="快捷键">/</kbd>
        )}
      </label>

      <div aria-label="搜索范围" className="catalog-search__scope">
        <button
          aria-pressed={filterState.scope === 'current'}
          onClick={() => handleScopeChange('current')}
          type="button"
        >
          当前分类
        </button>
        <button
          aria-pressed={filterState.scope === 'all'}
          onClick={() => handleScopeChange('all')}
          type="button"
        >
          全站
        </button>
      </div>
    </div>
  );
}

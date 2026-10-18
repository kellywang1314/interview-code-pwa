import { SearchX } from 'lucide-react';

interface EmptySearchResultProps {
  canSearchAll: boolean;
  onClearSearch: () => void;
  onSearchAll: () => void;
}

/** 渲染搜索无结果状态与可直接执行的恢复操作。 */
export function EmptySearchResult({
  canSearchAll,
  onClearSearch,
  onSearchAll,
}: EmptySearchResultProps) {
  return (
    <section className="empty-search-result">
      <SearchX aria-hidden="true" size={24} />
      <h2>没有匹配结果</h2>
      <p>换一个关键词，或扩大搜索范围后再试。</p>
      <div className="empty-search-result__actions">
        <button onClick={onClearSearch} type="button">
          清空搜索词
        </button>
        {canSearchAll ? (
          <button onClick={onSearchAll} type="button">
            切换到全站搜索
          </button>
        ) : null}
      </div>
    </section>
  );
}

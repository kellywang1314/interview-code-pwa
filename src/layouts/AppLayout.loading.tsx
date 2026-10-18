/** Renders a stable shell while the initial route hydrates. */
export default function AppLayoutLoading() {
  return (
    <main className="page-shell app-loading" aria-live="polite">
      <span className="app-loading__mark" aria-hidden="true">
        {'</>'}
      </span>
      <p>正在加载题目…</p>
    </main>
  );
}

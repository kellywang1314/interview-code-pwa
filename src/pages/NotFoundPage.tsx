import { Link } from '@modern-js/runtime/router';

/** Renders a recovery path for unknown routes and question identifiers. */
export default function NotFoundPage() {
  return (
    <main className="page-shell not-found-page">
      <p className="not-found-page__code">404</p>
      <h1>题目不存在</h1>
      <p>这个地址没有对应的题目，返回目录继续查阅。</p>
      <Link className="text-link" to="/">
        返回题目目录
      </Link>
    </main>
  );
}

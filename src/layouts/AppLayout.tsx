import { Outlet } from '@modern-js/runtime/router';

import { CatalogLayout } from '../components/catalog/CatalogLayout';

/** Renders the shared application shell around configured routes. */
export default function AppLayout() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main-content">
        跳到正文
      </a>
      <CatalogLayout>
        <div className="catalog-route-column">
          <div id="main-content" tabIndex={-1}>
            <Outlet />
          </div>
          <footer className="app-footer">
            <p>为有限时间准备的高密度代码笔记。</p>
            <span>Modern.js · React · Offline</span>
          </footer>
        </div>
      </CatalogLayout>
    </div>
  );
}

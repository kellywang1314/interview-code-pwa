import { appTools, defineConfig } from '@modern-js/app-tools';
import { ssgPlugin } from '@modern-js/plugin-ssg';
import { pluginPWA } from 'rsbuild-plugin-pwa';

import { copyAppIconsPlugin } from './build/copyAppIconsPlugin';
import { catalogItems } from './src/data/catalog';

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/interview-code-pwa' : '';
const baseUrl = `${basePath}/`;
const ssgRoutes = [
  '/',
  ...catalogItems.map(item => `/questions/${item.id}`),
];
const routeRevision =
  process.env.GITHUB_SHA ?? process.env.npm_package_version ?? 'development';

export default defineConfig({
  plugins: [appTools(), ssgPlugin()],
  builderPlugins: [
    copyAppIconsPlugin(),
    pluginPWA({
      disabled: ({ environmentName }) => environmentName !== 'client',
      htmlTags: {
        appleTouchIcon: {
          href: `${basePath}/app-icon-192.png`,
          sizes: '192x192',
        },
        themeColor: '#17201e',
      },
      registerSw: {
        type: 'script',
        scope: baseUrl,
        features: {
          autoReloadPage: false,
          autoSkipWaiting: true,
        },
      },
      sw: {
        mode: 'generateSw',
        includeWebAppManifestIcons: true,
        workboxOptions: {
          additionalManifestEntries: ssgRoutes.map(route => ({
            revision: routeRevision,
            url: `${basePath}${route}`,
          })),
          cleanupOutdatedCaches: true,
          clientsClaim: true,
        },
      },
      webAppManifest: {
        content: {
          name: '代码速查',
          short_name: '代码速查',
          description: '适合移动端快速翻阅的高频编程面试题手册',
          start_url: baseUrl,
          scope: baseUrl,
          display: 'standalone',
          background_color: '#f4f5f2',
          theme_color: '#17201e',
          icons: [
            {
              src: `${basePath}/app-icon-192.png`,
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: `${basePath}/app-icon-512.png`,
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        minify: true,
      },
    }),
  ],
  server: {
    baseUrl: basePath || '/',
  },
  html: {
    title: '面试代码速查',
    tags: [
      {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href: `${basePath}/global.css`,
        },
        head: true,
        append: false,
        publicPath: false,
      },
    ],
  },
  output: {
    assetPrefix: basePath || '/',
    ssg: {
      routes: ssgRoutes,
    },
  },
});

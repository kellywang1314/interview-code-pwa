import type { pluginPWA } from 'rsbuild-plugin-pwa';

type RsbuildPlugin = ReturnType<typeof pluginPWA>;

/** Copies stable PWA icon filenames into the client output root. */
export function copyAppIconsPlugin(): RsbuildPlugin {
  return {
    name: 'copy-app-icons',
    setup(api) {
      api.modifyRsbuildConfig(config => ({
        ...config,
        output: {
          ...config.output,
          copy: [
            ...(Array.isArray(config.output?.copy) ? config.output.copy : []),
            {
              from: './src/assets/app-icon-192.png',
              to: './app-icon-192.png',
            },
            {
              from: './src/assets/app-icon-512.png',
              to: './app-icon-512.png',
            },
          ],
        },
      }));
    },
  };
}

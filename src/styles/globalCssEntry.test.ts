import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const projectRoot = resolve(__dirname, '../..');

/**
 * 读取项目内的源码文件内容。
 */
function readSourceFile(relativePath: string): string {
  return readFileSync(resolve(projectRoot, relativePath), 'utf8');
}

describe('global css entry', () => {
  it('links a stable global stylesheet from the HTML head', () => {
    const runtimeSource = readSourceFile('src/modern.runtime.ts');
    const appLayoutSource = readSourceFile('src/layouts/AppLayout.tsx');
    const modernConfigSource = readSourceFile('modern.config.ts');
    const copyAssetsSource = readSourceFile(
      'build/copyAppIconsPlugin.ts',
    );

    expect(runtimeSource).not.toContain("./styles/global.css");
    expect(appLayoutSource).not.toContain('../styles/global.css');
    expect(modernConfigSource).toContain(
      "href: `${basePath}/global.css`",
    );
    expect(modernConfigSource).toContain("rel: 'stylesheet'");
    expect(copyAssetsSource).toContain(
      "from: './src/styles/global.css'",
    );
    expect(copyAssetsSource).toContain("to: './global.css'");
  });
});

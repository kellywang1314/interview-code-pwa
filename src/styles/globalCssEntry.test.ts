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
  it('loads global styles from the runtime entry instead of an async route chunk', () => {
    const runtimeSource = readSourceFile('src/modern.runtime.ts');
    const appLayoutSource = readSourceFile('src/layouts/AppLayout.tsx');

    expect(runtimeSource).toContain("./styles/global.css");
    expect(appLayoutSource).not.toContain('../styles/global.css');
  });
});

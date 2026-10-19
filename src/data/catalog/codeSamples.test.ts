import ts from 'typescript';
import { describe, expect, it } from 'vitest';

import { catalogItems, findCatalogItemById } from './index';

const compilerOptions: ts.CompilerOptions = {
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  noEmit: true,
  skipLibCheck: true,
  strict: true,
  target: ts.ScriptTarget.ES2022,
};

/**
 * 将单个目录代码片段作为独立 TypeScript 源单元进行严格语义检查。
 */
function getCodeDiagnostics(
  itemId: string,
  code: string,
): readonly ts.Diagnostic[] {
  const fileName = `/catalog-code-samples/${itemId}.ts`;
  const defaultHost = ts.createCompilerHost(compilerOptions);
  const sourceFile = ts.createSourceFile(
    fileName,
    code,
    ts.ScriptTarget.ES2022,
    true,
    ts.ScriptKind.TS,
  );
  const host: ts.CompilerHost = {
    ...defaultHost,
    fileExists: currentFileName =>
      currentFileName === fileName || defaultHost.fileExists(currentFileName),
    getSourceFile: (currentFileName, languageVersion, onError) =>
      currentFileName === fileName
        ? sourceFile
        : defaultHost.getSourceFile(
            currentFileName,
            languageVersion,
            onError,
          ),
    readFile: currentFileName =>
      currentFileName === fileName
        ? code
        : defaultHost.readFile(currentFileName),
  };
  const program = ts.createProgram([fileName], compilerOptions, host);

  return [
    ...program.getSyntacticDiagnostics(sourceFile),
    ...program.getSemanticDiagnostics(sourceFile),
  ];
}

/**
 * 将 TypeScript 诊断转换为包含条目、位置和错误码的可读文本。
 */
function formatDiagnostic(itemId: string, diagnostic: ts.Diagnostic): string {
  const position =
    diagnostic.file && diagnostic.start !== undefined
      ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
      : undefined;
  const location = position
    ? `:${position.line + 1}:${position.character + 1}`
    : '';
  const message = ts.flattenDiagnosticMessageText(
    diagnostic.messageText,
    '\n',
  );

  return `[${itemId}${location}] TS${diagnostic.code}: ${message}`;
}

describe('catalog code samples', () => {
  it('strictly compiles every sample as an independent TypeScript source', () => {
    const diagnostics = catalogItems.flatMap(item =>
      getCodeDiagnostics(item.id, item.code).map(diagnostic =>
        formatDiagnostic(item.id, diagnostic),
      ),
    );

    expect(diagnostics).toEqual([]);
  });

  it('counts one very wide island without overflowing the call stack', () => {
    const item = findCatalogItemById('number-of-islands');
    expect(item).toBeDefined();

    const javascript = ts.transpileModule(item?.code ?? '', {
      compilerOptions: {
        module: ts.ModuleKind.None,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    // 这里只执行仓库内受信任的静态目录字符串，不接受任何外部输入。
    const createCountIslands = new Function(
      `${javascript}\nreturn countIslands;`,
    ) as () => (grid: string[][]) => number;
    const countIslands = createCountIslands();
    const grid = [new Array<string>(20_000).fill('1')];

    expect(countIslands(grid)).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';

import {
  DEFAULT_CATALOG_STATE,
  parseCatalogUrl,
  serializeCatalogUrl,
} from './catalogUrl';

describe('catalog URL state', () => {
  it('parses a valid current-category state', () => {
    expect(
      parseCatalogUrl(
        '?domain=javascript&category=promise&q=all',
      ),
    ).toEqual({
      domainId: 'javascript',
      categoryId: 'promise',
      query: 'all',
      scope: 'current',
    });
  });

  it('parses global search while retaining the selected category', () => {
    expect(
      parseCatalogUrl(
        '?domain=leetcode&category=array&q=promise&scope=all',
      ),
    ).toEqual({
      domainId: 'leetcode',
      categoryId: 'array',
      query: 'promise',
      scope: 'all',
    });
  });

  it('uses the default domain when only a query is present', () => {
    expect(parseCatalogUrl('?q=%E5%93%88%E5%B8%8C')).toEqual({
      ...DEFAULT_CATALOG_STATE,
      query: '哈希',
    });
  });

  it.each([
    '?domain=bad&category=bad',
    '?domain=leetcode&category=promise',
    '?domain=javascript&category=array',
    '?scope=bad',
  ])('falls back for an unknown parameter combination: %s', search => {
    expect(parseCatalogUrl(search)).toEqual(DEFAULT_CATALOG_STATE);
  });

  it('serializes only meaningful parameters in a stable order', () => {
    expect(
      serializeCatalogUrl({
        domainId: 'javascript',
        categoryId: 'promise',
        query: 'Promise.all',
        scope: 'all',
      }),
    ).toBe(
      '?domain=javascript&category=promise&q=Promise.all&scope=all',
    );
  });

  it('serializes the default state without a query string', () => {
    expect(serializeCatalogUrl(DEFAULT_CATALOG_STATE)).toBe('');
  });

  it('round-trips normalized state', () => {
    const search =
      '?domain=leetcode&category=linked-list&q=%E9%93%BE%E8%A1%A8';

    expect(serializeCatalogUrl(parseCatalogUrl(search))).toBe(
      '?domain=leetcode&category=linked-list&q=%E9%93%BE%E8%A1%A8',
    );
  });
});

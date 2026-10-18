export type CatalogDomainId = 'leetcode' | 'javascript';

export type CatalogCategoryId =
  | 'array'
  | 'string'
  | 'linked-list'
  | 'traversal'
  | 'binary-tree'
  | 'sort'
  | 'promise'
  | 'common';

export type QuestionDifficulty = '简单' | '中等' | '困难';

export interface CatalogItem {
  id: string;
  domainId: CatalogDomainId;
  categoryId: CatalogCategoryId;
  title: string;
  difficulty: QuestionDifficulty;
  tags: string[];
  summary: string;
  description: string;
  approach: string;
  code: string;
  pitfalls: string[];
  complexity?: {
    time: string;
    space: string;
  };
  sourceUrl?: string;
}

export interface CatalogCategory {
  id: CatalogCategoryId;
  label: string;
  items: CatalogItem[];
}

export interface CatalogSection {
  id: CatalogDomainId;
  label: string;
  categories: CatalogCategory[];
}

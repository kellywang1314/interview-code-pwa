import { useParams } from '@modern-js/runtime/router';
import { ExternalLink } from 'lucide-react';

import { CodeBlock } from '../components/CodeBlock';
import { QuestionMeta } from '../components/QuestionMeta';
import {
  catalogSections,
  findCatalogItemById,
} from '../data/catalog';
import type { CatalogCategoryId } from '../data/catalog';
import NotFoundPage from './NotFoundPage';

/** 根据分类标识返回详情页展示名称。 */
function getCategoryLabel(categoryId: CatalogCategoryId): string {
  return (
    catalogSections
      .flatMap(section => section.categories)
      .find(category => category.id === categoryId)?.label ??
    categoryId
  );
}

/** Renders a question selected by the current route. */
export default function QuestionPage() {
  const { questionId = '' } = useParams();
  const question = findCatalogItemById(questionId);

  if (!question) {
    return <NotFoundPage />;
  }

  return (
    <main className="page-shell question-page">
      <article>
        <header className="question-hero">
          <p className="question-hero__category">
            {getCategoryLabel(question.categoryId)}
          </p>
          <h1>{question.title}</h1>
          <p className="question-hero__summary">{question.summary}</p>
          <QuestionMeta
            difficulty={question.difficulty}
            tags={question.tags}
          />
        </header>

        <section className="question-section">
          <h2>题目描述</h2>
          <p>{question.description}</p>
        </section>

        <section className="question-section">
          <h2>核心思路</h2>
          <p>{question.approach}</p>
          {question.sourceUrl ? (
            <a
              className="source-link"
              href={question.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              查看参考来源
              <ExternalLink aria-hidden="true" size={15} />
            </a>
          ) : null}
        </section>

        <section className="question-section">
          <h2>TypeScript 实现</h2>
          <CodeBlock code={question.code} language="TypeScript" />
        </section>

        {question.complexity ? (
          <section className="question-section">
            <h2>复杂度</h2>
            <dl className="complexity-list">
              <div>
                <dt>时间复杂度</dt>
                <dd>
                  <code>{question.complexity.time}</code>
                </dd>
              </div>
              <div>
                <dt>空间复杂度</dt>
                <dd>
                  <code>{question.complexity.space}</code>
                </dd>
              </div>
            </dl>
          </section>
        ) : null}

        <section className="question-section">
          <h2>易错点</h2>
          <ul className="pitfall-list">
            {question.pitfalls.map(pitfall => (
              <li key={pitfall}>{pitfall}</li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}

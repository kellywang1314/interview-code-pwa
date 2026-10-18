import { useParams } from '@modern-js/runtime/router';

import { CodeBlock } from '../components/CodeBlock';
import { QuestionMeta } from '../components/QuestionMeta';
import { findQuestionById } from '../data/questions';
import NotFoundPage from './NotFoundPage';

/** Renders a question selected by the current route. */
export default function QuestionPage() {
  const { questionId = '' } = useParams();
  const question = findQuestionById(questionId);

  if (!question) {
    return <NotFoundPage />;
  }

  return (
    <main className="page-shell question-page">
      <article>
        <header className="question-hero">
          <p className="question-hero__category">{question.category}</p>
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
        </section>

        <section className="question-section">
          <h2>TypeScript 实现</h2>
          <CodeBlock code={question.code} language="TypeScript" />
        </section>

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

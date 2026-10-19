import { Link } from '@modern-js/runtime/router';

import type { CatalogItem } from '../data/catalog';
import { QuestionMeta } from './QuestionMeta';

interface QuestionListItemProps {
  question: CatalogItem;
  sequence: number;
}

/** Renders one fully clickable question row. */
export function QuestionListItem({
  question,
  sequence,
}: QuestionListItemProps) {
  return (
    <li className="question-row">
      <Link
        className="question-row__link"
        to={`/questions/${question.id}`}
      >
        <span className="question-row__sequence">
          {String(sequence).padStart(2, '0')}
        </span>
        <span className="question-row__body">
          <strong className="question-row__title">{question.title}</strong>
          <span className="question-row__summary">{question.summary}</span>
          <QuestionMeta
            difficulty={question.difficulty}
            tags={question.tags}
          />
        </span>
        <span aria-hidden="true" className="question-row__arrow">
          →
        </span>
      </Link>
    </li>
  );
}

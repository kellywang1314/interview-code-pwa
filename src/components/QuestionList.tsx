import type { QuestionGroup } from '../data/questions';
import { QuestionListItem } from './QuestionListItem';

interface QuestionListProps {
  groups: QuestionGroup[];
}

/** Renders question groups in their catalog order. */
export function QuestionList({ groups }: QuestionListProps) {
  let sequence = 0;

  return (
    <div className="question-groups">
      {groups.map(group => (
        <section
          className="question-group"
          id={group.categoryId}
          key={group.categoryId}
        >
          <header className="question-group__header">
            <h2>{group.category}</h2>
            <span>{group.questions.length} 题</span>
          </header>
          <ol className="question-group__list">
            {group.questions.map(question => {
              sequence += 1;

              return (
                <QuestionListItem
                  key={question.id}
                  question={question}
                  sequence={sequence}
                />
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

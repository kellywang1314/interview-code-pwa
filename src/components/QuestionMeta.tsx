import type { QuestionDifficulty } from '../data/questions';

interface QuestionMetaProps {
  difficulty: QuestionDifficulty;
  tags: string[];
}

const difficultyClassNames: Record<QuestionDifficulty, string> = {
  简单: 'question-meta__difficulty--easy',
  中等: 'question-meta__difficulty--medium',
  困难: 'question-meta__difficulty--hard',
};

/** Renders a question difficulty and its topic tags. */
export function QuestionMeta({ difficulty, tags }: QuestionMetaProps) {
  return (
    <div className="question-meta">
      <span
        className={`question-meta__difficulty ${difficultyClassNames[difficulty]}`}
      >
        {difficulty}
      </span>
      {tags.map(tag => (
        <span className="question-meta__tag" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}

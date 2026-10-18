import { QuestionList } from '../components/QuestionList';
import { getQuestionGroups, questions } from '../data/questions';

/** Renders the interview question index. */
export default function HomePage() {
  const groups = getQuestionGroups(questions);

  return (
    <main className="page-shell home-page">
      <section className="home-intro">
        <p className="home-intro__eyebrow">INTERVIEW FIELD NOTES</p>
        <h1>面试代码速查</h1>
        <p>
          高频算法的核心思路、复杂度与易错点。适合在面试前快速恢复解题手感。
        </p>
        <dl className="home-intro__stats">
          <div>
            <dt>题目</dt>
            <dd>{questions.length}</dd>
          </div>
          <div>
            <dt>分类</dt>
            <dd>{groups.length}</dd>
          </div>
        </dl>
      </section>
      <QuestionList groups={groups} />
    </main>
  );
}

import { describe, expect, it } from 'vitest';

import { findQuestionById, getQuestionGroups, questions } from './questions';

describe('question catalog', () => {
  it('groups questions in category order', () => {
    expect(getQuestionGroups(questions).map(group => group.category)).toEqual([
      '数组与哈希',
      '链表',
      '二叉树',
    ]);
  });

  it('keeps every question id unique', () => {
    const ids = questions.map(question => question.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it('finds a question by id', () => {
    expect(findQuestionById('two-sum')?.title).toBe('两数之和');
    expect(findQuestionById('missing-question')).toBeUndefined();
  });

  it('contains complete renderable content', () => {
    questions.forEach(question => {
      expect(question.description.trim()).not.toBe('');
      expect(question.approach.trim()).not.toBe('');
      expect(question.code).toContain('function');
      expect(question.complexity.time).toMatch(/^O\(.+\)$/);
      expect(question.complexity.space).toMatch(/^O\(.+\)$/);
      expect(question.pitfalls.length).toBeGreaterThan(0);
    });
  });
});

export type QuestionDifficulty = '简单' | '中等' | '困难';

export interface Question {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  difficulty: QuestionDifficulty;
  tags: string[];
  summary: string;
  description: string;
  approach: string;
  code: string;
  complexity: {
    time: string;
    space: string;
  };
  pitfalls: string[];
}

export interface QuestionGroup {
  category: string;
  categoryId: string;
  questions: Question[];
}

export const questions: Question[] = [
  {
    id: 'two-sum',
    title: '两数之和',
    category: '数组与哈希',
    categoryId: 'array-hash',
    difficulty: '简单',
    tags: ['哈希表', '一次遍历'],
    summary: '用哈希表记录已访问元素，在一次遍历中找到目标组合。',
    description:
      '给定整数数组 nums 和目标值 target，返回和为目标值的两个元素下标。同一个元素不能重复使用。',
    approach:
      '遍历数组时，用哈希表记录已经出现的值及其下标。处理当前值时，先检查补数是否存在；存在则直接返回两个下标，不存在再记录当前值。',
    code: `/**
 * 返回数组中和为目标值的两个元素下标。
 */
function twoSum(nums: number[], target: number): number[] {
  const indexByValue = new Map<number, number>();

  for (let index = 0; index < nums.length; index += 1) {
    const currentValue = nums[index];
    const expectedIndex = indexByValue.get(target - currentValue);

    if (expectedIndex !== undefined) {
      return [expectedIndex, index];
    }

    indexByValue.set(currentValue, index);
  }

  return [];
}`,
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
    pitfalls: [
      '必须先查询再写入，避免重复使用同一个元素。',
      '不能用布尔值判断下标是否命中，因为下标 0 是合法值。',
    ],
  },
  {
    id: 'reverse-linked-list',
    title: '反转链表',
    category: '链表',
    categoryId: 'linked-list',
    difficulty: '简单',
    tags: ['双指针', '迭代'],
    summary: '维护前驱与当前节点，逐个反转链表指针方向。',
    description: '给定单链表的头节点 head，反转链表并返回新的头节点。',
    approach:
      '同时维护前驱节点和当前节点。修改当前节点的 next 前，先保存原来的下一个节点，否则会丢失尚未处理的链表。',
    code: `class ListNode {
  value: number;
  next: ListNode | null;

  /** 创建一个单链表节点。 */
  constructor(value: number, next: ListNode | null = null) {
    this.value = value;
    this.next = next;
  }
}

/**
 * 迭代反转单链表并返回新的头节点。
 */
function reverseLinkedList(head: ListNode | null): ListNode | null {
  let previousNode: ListNode | null = null;
  let currentNode = head;

  while (currentNode) {
    const nextNode = currentNode.next;
    currentNode.next = previousNode;
    previousNode = currentNode;
    currentNode = nextNode;
  }

  return previousNode;
}`,
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
    pitfalls: [
      '反转指针前先保存 currentNode.next。',
      '循环结束后 previousNode 才是新的头节点。',
    ],
  },
  {
    id: 'level-order-traversal',
    title: '二叉树层序遍历',
    category: '二叉树',
    categoryId: 'binary-tree',
    difficulty: '中等',
    tags: ['广度优先', '队列'],
    summary: '按层消费队列中的节点，并收集每一层的访问结果。',
    description:
      '给定二叉树的根节点 root，返回节点值的层序遍历结果，即从左到右逐层访问所有节点。',
    approach:
      '使用队列执行广度优先遍历。每轮开始时记录当前队列长度，它就是当前层的节点数。只处理这批节点，并将子节点加入队尾。',
    code: `class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  /** 创建一个二叉树节点。 */
  constructor(
    value: number,
    left: TreeNode | null = null,
    right: TreeNode | null = null,
  ) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

/**
 * 按层返回二叉树中所有节点的值。
 */
function levelOrderTraversal(root: TreeNode | null): number[][] {
  if (!root) {
    return [];
  }

  const levels: number[][] = [];
  const queue: TreeNode[] = [root];
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const levelSize = queue.length - queueIndex;
    const currentLevel: number[] = [];

    for (let offset = 0; offset < levelSize; offset += 1) {
      const currentNode = queue[queueIndex];
      queueIndex += 1;
      currentLevel.push(currentNode.value);

      if (currentNode.left) {
        queue.push(currentNode.left);
      }

      if (currentNode.right) {
        queue.push(currentNode.right);
      }
    }

    levels.push(currentLevel);
  }

  return levels;
}`,
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
    pitfalls: [
      '每层开始时固定 levelSize，不要动态读取队列剩余长度。',
      '子节点入队顺序必须是先左后右。',
    ],
  },
];

/** Groups questions while preserving the first appearance of each category. */
export function getQuestionGroups(items: Question[]): QuestionGroup[] {
  const groups = new Map<string, QuestionGroup>();

  items.forEach(question => {
    const currentGroup = groups.get(question.categoryId);

    if (currentGroup) {
      currentGroup.questions.push(question);
      return;
    }

    groups.set(question.categoryId, {
      category: question.category,
      categoryId: question.categoryId,
      questions: [question],
    });
  });

  return Array.from(groups.values());
}

/** Finds a question by its stable URL identifier. */
export function findQuestionById(questionId: string): Question | undefined {
  return questions.find(question => question.id === questionId);
}

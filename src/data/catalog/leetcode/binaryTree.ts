import type { CatalogItem } from '../types';

export const binaryTreeItems = [
  {
    id: 'level-order-traversal',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '二叉树层序遍历',
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
    pitfalls: [
      '每层开始时固定 levelSize，不要动态读取队列剩余长度。',
      '子节点入队顺序必须是先左后右。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    id: 'maximum-depth-of-binary-tree',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '二叉树的最大深度',
    difficulty: '简单',
    tags: ['二叉树', '深度优先', '递归'],
    summary: '节点深度等于左右子树最大深度加一。',
    description:
      '给定二叉树根节点，返回从根节点到最远叶子节点路径上的节点数量。',
    approach:
      '空节点深度为 0；非空节点递归计算左右子树深度，取较大值后加上当前节点这一层。',
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
 * 返回二叉树从根到最远叶子的最大深度。
 */
function maxDepth(root: TreeNode | null): number {
  if (!root) {
    return 0;
  }

  return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1;
}`,
    pitfalls: [
      '深度按节点数计算，因此非空节点需要在子树深度上加一。',
      '极端退化树可能触发 JavaScript 调用栈限制，可改用迭代遍历。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
    },
  },
  {
    id: 'lowest-common-ancestor-of-binary-tree',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '二叉树的最近公共祖先',
    difficulty: '中等',
    tags: ['二叉树', '深度优先', '递归'],
    summary: '左右子树分别命中目标时，当前节点就是最近公共祖先。',
    description:
      '给定二叉树根节点和两个树中节点 p、q，返回同时包含两者的最低层祖先节点。',
    approach:
      '递归查找左右子树。当前节点是目标时直接返回；左右结果都非空说明目标分居两侧，返回当前节点，否则向上传递非空结果。',
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
 * 返回二叉树中两个节点的最近公共祖先。
 */
function lowestCommonAncestor(
  root: TreeNode | null,
  firstTarget: TreeNode,
  secondTarget: TreeNode,
): TreeNode | null {
  if (!root || root === firstTarget || root === secondTarget) {
    return root;
  }

  const leftResult = lowestCommonAncestor(
    root.left,
    firstTarget,
    secondTarget,
  );
  const rightResult = lowestCommonAncestor(
    root.right,
    firstTarget,
    secondTarget,
  );

  if (leftResult && rightResult) {
    return root;
  }

  return leftResult ?? rightResult;
}`,
    pitfalls: [
      '比较的是节点引用，不是可能重复的节点值。',
      '题目通常保证两个目标都在树中；若不保证，需要额外验证命中数量。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
    },
  },
] satisfies CatalogItem[];

import type { CatalogItem } from '../types';

export const binaryTreeItems = [
  {
    id: 'binary-tree-inorder-traversal',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '二叉树中序遍历',
    difficulty: '简单',
    tags: ['二叉树', '深度优先', '栈'],
    summary: '用栈模拟递归，按左子树、根节点、右子树的顺序访问。',
    description:
      '给定二叉树根节点，返回其中序遍历结果，即先访问左子树，再访问根节点，最后访问右子树。',
    approach:
      '维护 current 指针和栈。持续向左入栈，到空节点后弹出栈顶访问，再转向右子树，直到当前指针为空且栈为空。',
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
 * 返回二叉树的中序遍历结果。
 */
function inorderTraversal(root: TreeNode | null): number[] {
  const result: number[] = [];
  const stack: TreeNode[] = [];
  let current = root;

  while (current || stack.length > 0) {
    while (current) {
      stack.push(current);
      current = current.left;
    }

    const node = stack.pop() as TreeNode;
    result.push(node.value);
    current = node.right;
  }

  return result;
}`,
    pitfalls: [
      '中序遍历不是先访问根节点，必须先一路走到最左节点。',
      '循环条件要同时判断 current 和 stack，避免漏掉右子树。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
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
    id: 'invert-binary-tree',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '翻转二叉树',
    difficulty: '简单',
    tags: ['二叉树', '递归', '深度优先'],
    summary: '每个节点交换左右子树，再递归处理两个子节点。',
    description:
      '给定二叉树根节点，将整棵树左右镜像翻转并返回根节点。',
    approach:
      '对当前节点交换 left 与 right，再递归翻转交换后的左右子树。空节点直接返回 null。',
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
 * 翻转二叉树并返回根节点。
 */
function invertTree(root: TreeNode | null): TreeNode | null {
  if (!root) {
    return null;
  }

  const left = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(left);
  return root;
}`,
    pitfalls: [
      '交换左右子树前要保存其中一侧引用，避免覆盖后丢失原子树。',
      '该实现会原地修改输入树，若需要保留原树应新建节点。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
    },
  },
  {
    id: 'symmetric-tree',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '对称二叉树',
    difficulty: '简单',
    tags: ['二叉树', '递归', '双指针'],
    summary: '左右子树互为镜像：外侧对外侧，内侧对内侧。',
    description:
      '给定二叉树根节点，判断它是否轴对称。',
    approach:
      '定义 mirror(left, right) 判断两棵子树是否镜像。两个节点都空为 true，只有一个为空为 false，值相等时继续比较外侧与内侧。',
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
 * 判断两棵子树是否互为镜像。
 */
function isMirror(leftNode: TreeNode | null, rightNode: TreeNode | null): boolean {
  if (!leftNode && !rightNode) {
    return true;
  }
  if (!leftNode || !rightNode || leftNode.value !== rightNode.value) {
    return false;
  }

  return (
    isMirror(leftNode.left, rightNode.right) &&
    isMirror(leftNode.right, rightNode.left)
  );
}

/**
 * 判断二叉树是否轴对称。
 */
function isSymmetric(root: TreeNode | null): boolean {
  return isMirror(root?.left ?? null, root?.right ?? null);
}`,
    pitfalls: [
      '对称比较的是左子树左侧与右子树右侧，不是两个左节点直接比较。',
      '节点值相同还不够，子树结构也必须镜像一致。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
    },
  },
  {
    id: 'diameter-of-binary-tree',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '二叉树的直径',
    difficulty: '简单',
    tags: ['二叉树', '深度优先', '树形 DP'],
    summary: '每个节点的左右子树深度之和可以更新最长路径。',
    description:
      '给定二叉树根节点，返回任意两个节点之间最长路径的边数。',
    approach:
      'DFS 返回当前节点向下的最大深度。回溯时用左深度加右深度更新直径，最终返回最大边数。',
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
 * 返回二叉树任意两节点间最长路径的边数。
 */
function diameterOfBinaryTree(root: TreeNode | null): number {
  let longest = 0;

  /**
   * 返回当前节点向下到叶子的最大边数深度。
   */
  function getDepth(node: TreeNode | null): number {
    if (!node) {
      return 0;
    }

    const leftDepth = getDepth(node.left);
    const rightDepth = getDepth(node.right);
    longest = Math.max(longest, leftDepth + rightDepth);
    return Math.max(leftDepth, rightDepth) + 1;
  }

  getDepth(root);
  return longest;
}`,
    pitfalls: [
      '直径不一定经过根节点，必须在每个节点处尝试更新。',
      'LeetCode 口径返回边数，leftDepth + rightDepth 已经对应边数。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
    },
  },
  {
    id: 'convert-sorted-array-to-binary-search-tree',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '将有序数组转换为二叉搜索树',
    difficulty: '简单',
    tags: ['二叉搜索树', '分治', '数组'],
    summary: '每次选择中点作为根节点，左右区间递归构造子树。',
    description:
      '给定升序整数数组，将其转换为高度平衡的二叉搜索树。',
    approach:
      '递归处理闭区间 [left, right]。选择中点作为根，左半区间构造左子树，右半区间构造右子树。',
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
 * 将升序数组转换为高度平衡二叉搜索树。
 */
function sortedArrayToBST(nums: number[]): TreeNode | null {
  /**
   * 根据闭区间构造平衡搜索树。
   */
  function build(left: number, right: number): TreeNode | null {
    if (left > right) {
      return null;
    }

    const middle = Math.floor((left + right) / 2);
    return new TreeNode(
      nums[middle],
      build(left, middle - 1),
      build(middle + 1, right),
    );
  }

  return build(0, nums.length - 1);
}`,
    pitfalls: [
      '每次取中点才能保证高度尽量平衡。',
      '递归边界使用闭区间时，left > right 才表示空子树。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(log n)',
    },
  },
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
    id: 'validate-binary-search-tree',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '验证二叉搜索树',
    difficulty: '中等',
    tags: ['二叉搜索树', '递归', '区间约束'],
    summary: '向下传递取值上下界，每个节点必须落在合法开区间内。',
    description:
      '给定二叉树根节点，判断它是否是一棵合法的二叉搜索树。',
    approach:
      '递归时携带当前节点允许的最小值和最大值。左子树上界变为当前值，右子树下界变为当前值，所有比较都使用严格不等。',
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
 * 判断二叉树是否满足二叉搜索树约束。
 */
function isValidBST(root: TreeNode | null): boolean {
  /**
   * 校验节点值是否落在开区间内。
   */
  function validate(
    node: TreeNode | null,
    lowerBound: number | null,
    upperBound: number | null,
  ): boolean {
    if (!node) {
      return true;
    }
    if (
      (lowerBound !== null && node.value <= lowerBound) ||
      (upperBound !== null && node.value >= upperBound)
    ) {
      return false;
    }

    return (
      validate(node.left, lowerBound, node.value) &&
      validate(node.right, node.value, upperBound)
    );
  }

  return validate(root, null, null);
}`,
    pitfalls: [
      '不能只比较当前节点与直接子节点，整棵子树都要受祖先边界约束。',
      '二叉搜索树不允许重复值，比较应使用严格小于和严格大于。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
    },
  },
  {
    id: 'kth-smallest-element-in-a-bst',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '二叉搜索树中第 K 小的元素',
    difficulty: '中等',
    tags: ['二叉搜索树', '中序遍历', '栈'],
    summary: '二叉搜索树中序遍历有序，访问到第 k 个节点即可返回。',
    description:
      '给定二叉搜索树根节点和整数 k，返回树中第 k 小的节点值。',
    approach:
      '用迭代中序遍历按升序访问节点。每弹出一个节点就递减 k，当 k 变为 0 时返回当前值。',
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
 * 返回二叉搜索树中第 k 小的节点值。
 */
function kthSmallest(root: TreeNode | null, k: number): number {
  const stack: TreeNode[] = [];
  let current = root;
  let remaining = k;

  while (current || stack.length > 0) {
    while (current) {
      stack.push(current);
      current = current.left;
    }

    const node = stack.pop() as TreeNode;
    remaining -= 1;
    if (remaining === 0) {
      return node.value;
    }
    current = node.right;
  }

  throw new Error('k is out of range');
}`,
    pitfalls: [
      '只有二叉搜索树的中序遍历结果才天然升序。',
      'k 是从 1 开始计数，访问节点后再判断 remaining 是否为 0。',
    ],
    complexity: {
      time: 'O(h + k)',
      space: 'O(h)',
    },
  },
  {
    id: 'binary-tree-right-side-view',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '二叉树的右视图',
    difficulty: '中等',
    tags: ['二叉树', '广度优先', '层序遍历'],
    summary: '层序遍历时记录每层最后一个节点，它就是右侧可见节点。',
    description:
      '给定二叉树根节点，返回从右侧观察二叉树时从上到下能看到的节点值。',
    approach:
      '执行 BFS，每层处理固定数量节点。当前层最后一个被处理的节点值加入结果。',
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
 * 返回二叉树从右侧可见的节点值。
 */
function rightSideView(root: TreeNode | null): number[] {
  if (!root) {
    return [];
  }

  const result: number[] = [];
  const queue: TreeNode[] = [root];
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const levelSize = queue.length - queueIndex;

    for (let offset = 0; offset < levelSize; offset += 1) {
      const node = queue[queueIndex];
      queueIndex += 1;

      if (offset === levelSize - 1) {
        result.push(node.value);
      }
      if (node.left) {
        queue.push(node.left);
      }
      if (node.right) {
        queue.push(node.right);
      }
    }
  }

  return result;
}`,
    pitfalls: [
      '右视图不等于只沿 right 指针走，左子树深层节点也可能可见。',
      '每层节点数量要在处理该层前固定。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    id: 'flatten-binary-tree-to-linked-list',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '二叉树展开为链表',
    difficulty: '中等',
    tags: ['二叉树', '深度优先', '链表'],
    summary: '按反向前序遍历重连节点，使 right 指针形成链表。',
    description:
      '给定二叉树根节点，将其原地展开为单链表，展开顺序与前序遍历一致，所有 left 指针置空。',
    approach:
      '按右、左、根的顺序递归遍历，维护 previous 指向已经展开好的后继节点。处理当前节点时令 right 指向 previous，left 置空。',
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
 * 将二叉树原地展开为前序链表。
 */
function flatten(root: TreeNode | null): void {
  let previous: TreeNode | null = null;

  /**
   * 按反向前序重连当前子树。
   */
  function traverse(node: TreeNode | null): void {
    if (!node) {
      return;
    }

    traverse(node.right);
    traverse(node.left);
    node.right = previous;
    node.left = null;
    previous = node;
  }

  traverse(root);
}`,
    pitfalls: [
      '题目要求原地修改节点指针，不是返回新的数组或链表。',
      '若按正向前序处理，需要先保存左右子树，否则重连时会丢失节点。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(h)',
    },
  },
  {
    id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '从前序与中序遍历序列构造二叉树',
    difficulty: '中等',
    tags: ['二叉树', '递归', '哈希表'],
    summary: '前序首元素是根，中序位置决定左右子树规模。',
    description:
      '给定互不重复节点值的前序遍历和中序遍历结果，重建原二叉树。',
    approach:
      '用 Map 记录中序值到下标。递归时根据前序区间首元素确定根节点，再用根在中序中的位置拆分左右子树区间。',
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
 * 根据前序和中序遍历结果重建二叉树。
 */
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
  const inorderIndexByValue = new Map<number, number>();

  inorder.forEach((value, index) => {
    inorderIndexByValue.set(value, index);
  });

  /**
   * 根据前序和中序闭区间构造子树。
   */
  function build(
    preorderLeft: number,
    preorderRight: number,
    inorderLeft: number,
    inorderRight: number,
  ): TreeNode | null {
    if (preorderLeft > preorderRight || inorderLeft > inorderRight) {
      return null;
    }

    const rootValue = preorder[preorderLeft];
    const rootInorderIndex = inorderIndexByValue.get(rootValue);

    if (rootInorderIndex === undefined) {
      return null;
    }

    const leftSize = rootInorderIndex - inorderLeft;
    return new TreeNode(
      rootValue,
      build(
        preorderLeft + 1,
        preorderLeft + leftSize,
        inorderLeft,
        rootInorderIndex - 1,
      ),
      build(
        preorderLeft + leftSize + 1,
        preorderRight,
        rootInorderIndex + 1,
        inorderRight,
      ),
    );
  }

  return build(0, preorder.length - 1, 0, inorder.length - 1);
}`,
    pitfalls: [
      '必须用中序位置计算左子树大小，再映射到前序区间。',
      '该解法依赖节点值互不重复，否则无法用值唯一定位中序下标。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    id: 'path-sum-iii',
    domainId: 'leetcode',
    categoryId: 'binary-tree',
    title: '路径总和 III',
    difficulty: '中等',
    tags: ['二叉树', '前缀和', '深度优先'],
    summary: '用根到当前节点的前缀和统计以当前节点结尾的合法路径。',
    description:
      '给定二叉树根节点和目标和，统计路径和等于目标值的路径数量。路径必须向下，但不必从根节点开始或到叶子节点结束。',
    approach:
      'DFS 维护当前前缀和和前缀和出现次数。到达节点时，currentSum - targetSum 的出现次数就是以当前节点结尾的合法路径数。',
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
 * 统计二叉树中路径和等于目标值的向下路径数量。
 */
function pathSum(root: TreeNode | null, targetSum: number): number {
  const countByPrefixSum = new Map<number, number>([[0, 1]]);
  let count = 0;

  /**
   * 深度优先遍历并维护当前路径的前缀和。
   */
  function dfs(node: TreeNode | null, currentSum: number): void {
    if (!node) {
      return;
    }

    const nextSum = currentSum + node.value;
    count += countByPrefixSum.get(nextSum - targetSum) ?? 0;
    countByPrefixSum.set(
      nextSum,
      (countByPrefixSum.get(nextSum) ?? 0) + 1,
    );

    dfs(node.left, nextSum);
    dfs(node.right, nextSum);

    const nextCount = (countByPrefixSum.get(nextSum) ?? 1) - 1;
    if (nextCount === 0) {
      countByPrefixSum.delete(nextSum);
    } else {
      countByPrefixSum.set(nextSum, nextCount);
    }
  }

  dfs(root, 0);
  return count;
}`,
    pitfalls: [
      '路径可以从任意祖先节点后开始，不能只计算从根出发的路径。',
      '回溯离开当前节点时必须撤销当前前缀和计数，避免污染兄弟分支。',
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

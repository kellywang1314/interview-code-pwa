import type { CatalogItem } from '../types';

export const traversalItems = [
  {
    id: 'number-of-islands',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '岛屿数量',
    difficulty: '中等',
    tags: ['深度优先', '网格', '连通分量'],
    summary: '发现陆地后用 DFS 淹没整个连通块并累计岛屿数。',
    description:
      '给定由 1 表示陆地、0 表示水域的二维网格，计算上下左右相邻陆地形成的岛屿数量。',
    approach:
      '扫描每个单元格，遇到未访问陆地时计数加一，并用显式栈从该位置迭代执行深度优先遍历，将相连陆地标记为已访问。',
    code: `/**
 * 使用显式栈从指定位置迭代标记整座岛屿，避免递归调用栈溢出。
 */
function floodIsland(grid: string[][], row: number, column: number): void {
  if (
    row < 0 ||
    row >= grid.length ||
    column < 0 ||
    column >= grid[0].length ||
    grid[row][column] !== '1'
  ) {
    return;
  }

  const stack: Array<[number, number]> = [[row, column]];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  grid[row][column] = '0';

  while (stack.length > 0) {
    const [currentRow, currentColumn] = stack.pop() as [number, number];

    for (const [rowOffset, columnOffset] of directions) {
      const nextRow = currentRow + rowOffset;
      const nextColumn = currentColumn + columnOffset;

      if (
        nextRow >= 0 &&
        nextRow < grid.length &&
        nextColumn >= 0 &&
        nextColumn < grid[nextRow].length &&
        grid[nextRow][nextColumn] === '1'
      ) {
        grid[nextRow][nextColumn] = '0';
        stack.push([nextRow, nextColumn]);
      }
    }
  }
}

/**
 * 统计网格中的岛屿数量。
 */
function countIslands(grid: string[][]): number {
  if (grid.length === 0) {
    return 0;
  }

  let count = 0;

  for (let row = 0; row < grid.length; row += 1) {
    for (let column = 0; column < grid[row].length; column += 1) {
      if (grid[row][column] === '1') {
        count += 1;
        floodIsland(grid, row, column);
      }
    }
  }

  return count;
}`,
    pitfalls: [
      '超大连通块应使用显式栈执行 DFS，避免递归深度导致调用栈溢出。',
      '陆地应在压入栈时立即标记，避免同一位置被相邻单元格重复压栈。',
      '原地标记会修改输入；调用方需要保留网格时应先复制。',
    ],
    complexity: {
      time: 'O(m · n)',
      space: 'O(m · n)',
    },
  },
  {
    id: 'rotting-oranges',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '腐烂的橘子',
    difficulty: '中等',
    tags: ['广度优先', '网格', '多源 BFS'],
    summary: '将所有腐烂橘子同时入队，按层扩散并记录分钟数。',
    description:
      '网格中 0 为空、1 为新鲜橘子、2 为腐烂橘子。每分钟腐烂会向四邻扩散，求全部腐烂所需最少分钟。',
    approach:
      '先统计新鲜橘子并把所有腐烂橘子加入队列。多源 BFS 每处理一层代表一分钟，每腐烂一个新鲜橘子就减少计数。',
    code: `/**
 * 返回所有新鲜橘子腐烂所需的最少分钟。
 */
function orangesRotting(grid: number[][]): number {
  const queue: Array<[number, number]> = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let freshCount = 0;
  let queueIndex = 0;
  let minutes = 0;

  for (let row = 0; row < grid.length; row += 1) {
    for (let column = 0; column < grid[row].length; column += 1) {
      if (grid[row][column] === 2) {
        queue.push([row, column]);
      } else if (grid[row][column] === 1) {
        freshCount += 1;
      }
    }
  }

  while (queueIndex < queue.length && freshCount > 0) {
    const levelEnd = queue.length;

    while (queueIndex < levelEnd) {
      const [row, column] = queue[queueIndex];
      queueIndex += 1;

      for (const [rowOffset, columnOffset] of directions) {
        const nextRow = row + rowOffset;
        const nextColumn = column + columnOffset;

        if (
          nextRow >= 0 &&
          nextRow < grid.length &&
          nextColumn >= 0 &&
          nextColumn < grid[nextRow].length &&
          grid[nextRow][nextColumn] === 1
        ) {
          grid[nextRow][nextColumn] = 2;
          freshCount -= 1;
          queue.push([nextRow, nextColumn]);
        }
      }
    }

    minutes += 1;
  }

  return freshCount === 0 ? minutes : -1;
}`,
    pitfalls: [
      '初始腐烂橘子必须同时作为 BFS 起点，不能逐个独立扩散。',
      '没有新鲜橘子时答案是 0，而不是 1。',
    ],
    complexity: {
      time: 'O(m · n)',
      space: 'O(m · n)',
    },
  },
  {
    id: 'course-schedule',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '课程表',
    difficulty: '中等',
    tags: ['拓扑排序', '图', '广度优先'],
    summary: '持续移除入度为零的课程，判断能否处理全部节点。',
    description:
      '给定课程数量和先修关系，判断是否可以完成所有课程；先修关系构成的有向图不能包含环。',
    approach:
      '建立邻接表和入度数组，将所有入度为零的课程入队。每完成一门课就降低后继入度，新入度为零的课程继续入队。',
    code: `/**
 * 判断给定先修关系是否允许完成所有课程。
 */
function canFinishCourses(
  courseCount: number,
  prerequisites: number[][],
): boolean {
  const nextCourses = Array.from({ length: courseCount }, () => [] as number[]);
  const indegrees = new Array<number>(courseCount).fill(0);

  for (const [course, prerequisite] of prerequisites) {
    nextCourses[prerequisite].push(course);
    indegrees[course] += 1;
  }

  const queue: number[] = [];
  let queueIndex = 0;
  let completed = 0;

  for (let course = 0; course < courseCount; course += 1) {
    if (indegrees[course] === 0) {
      queue.push(course);
    }
  }

  while (queueIndex < queue.length) {
    const course = queue[queueIndex];
    queueIndex += 1;
    completed += 1;

    for (const nextCourse of nextCourses[course]) {
      indegrees[nextCourse] -= 1;
      if (indegrees[nextCourse] === 0) {
        queue.push(nextCourse);
      }
    }
  }

  return completed === courseCount;
}`,
    pitfalls: [
      '边的方向应从先修课程指向后续课程。',
      '不能只检查是否存在初始入度为零节点，必须确认最终处理数量等于课程总数。',
    ],
    complexity: {
      time: 'O(V + E)',
      space: 'O(V + E)',
    },
  },
  {
    id: 'implement-trie-prefix-tree',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '实现 Trie（前缀树）',
    difficulty: '中等',
    tags: ['字典树', '字符串', '树'],
    summary: '每个节点保存子节点映射和单词结束标记。',
    description:
      '实现 Trie，支持插入字符串、查找完整单词，以及判断是否存在指定前缀。',
    approach:
      '插入时沿字符逐层创建节点；完整单词查询要求最终节点存在且 isWord 为 true；前缀查询只要求路径存在。',
    code: `class TrieNode {
  children = new Map<string, TrieNode>();
  isWord = false;
}

class Trie {
  private readonly root = new TrieNode();

  /** 插入一个单词。 */
  insert(word: string): void {
    let current = this.root;

    for (const character of word) {
      let next = current.children.get(character);

      if (!next) {
        next = new TrieNode();
        current.children.set(character, next);
      }

      current = next;
    }

    current.isWord = true;
  }

  /** 判断完整单词是否存在。 */
  search(word: string): boolean {
    const node = this.findNode(word);
    return node?.isWord ?? false;
  }

  /** 判断是否存在指定前缀。 */
  startsWith(prefix: string): boolean {
    return this.findNode(prefix) !== null;
  }

  /** 返回路径末尾节点，不存在时返回 null。 */
  private findNode(value: string): TrieNode | null {
    let current = this.root;

    for (const character of value) {
      const next = current.children.get(character);

      if (!next) {
        return null;
      }

      current = next;
    }

    return current;
  }
}`,
    pitfalls: [
      'search 要检查单词结束标记，不能只判断路径存在。',
      'startsWith 不需要检查 isWord，只要前缀路径存在即可。',
    ],
    complexity: {
      time: 'O(k)',
      space: 'O(n · k)',
    },
  },
  {
    id: 'permutations',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '全排列',
    difficulty: '中等',
    tags: ['回溯', '数组', '排列'],
    summary: '逐层选择一个未使用数字，路径长度达到 n 时收集答案。',
    description:
      '给定不含重复数字的数组 nums，返回其所有可能的全排列。',
    approach:
      '用 used 数组记录每个位置是否已在当前路径中。DFS 每层枚举所有未使用数字，选择后递归，回溯时撤销选择。',
    code: `/**
 * 返回不含重复数字数组的所有全排列。
 */
function permute(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];
  const used = new Array<boolean>(nums.length).fill(false);

  /**
   * 从当前路径继续构造排列。
   */
  function backtrack(): void {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }

    for (let index = 0; index < nums.length; index += 1) {
      if (used[index]) {
        continue;
      }

      used[index] = true;
      path.push(nums[index]);
      backtrack();
      path.pop();
      used[index] = false;
    }
  }

  backtrack();
  return result;
}`,
    pitfalls: [
      '加入答案时必须复制 path，否则后续回溯会改掉已保存结果。',
      'used 标记需要在递归返回后恢复。',
    ],
    complexity: {
      time: 'O(n · n!)',
      space: 'O(n)',
    },
  },
  {
    id: 'subsets',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '子集',
    difficulty: '中等',
    tags: ['回溯', '数组', '组合'],
    summary: '每个递归节点都是一个子集，从下一个位置继续扩展。',
    description:
      '给定不含重复元素的数组 nums，返回该数组所有可能的子集。',
    approach:
      'DFS 参数 start 表示下一次可选择的起点。每进入一个节点先收集当前路径，再枚举 start 之后的元素继续扩展。',
    code: `/**
 * 返回数组的所有子集。
 */
function subsets(nums: number[]): number[][] {
  const result: number[][] = [];
  const path: number[] = [];

  /**
   * 从指定起点继续选择子集元素。
   */
  function backtrack(start: number): void {
    result.push([...path]);

    for (let index = start; index < nums.length; index += 1) {
      path.push(nums[index]);
      backtrack(index + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}`,
    pitfalls: [
      '当前路径本身就是合法子集，不能只在叶子节点收集。',
      '下一层要从 index + 1 开始，避免重复使用元素。',
    ],
    complexity: {
      time: 'O(n · 2^n)',
      space: 'O(n)',
    },
  },
  {
    id: 'letter-combinations-of-a-phone-number',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '电话号码的字母组合',
    difficulty: '中等',
    tags: ['回溯', '字符串', '映射'],
    summary: '按数字位逐层选择映射字母，组合长度等于数字长度时收集。',
    description:
      '给定包含数字 2-9 的字符串，返回它能表示的所有字母组合。',
    approach:
      '建立数字到字母的映射。DFS 的 depth 对应当前处理的数字位置，依次尝试该数字映射出的所有字母。',
    code: `const lettersByDigit: Record<string, string> = {
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz',
};

/**
 * 返回电话号码数字串对应的所有字母组合。
 */
function letterCombinations(digits: string): string[] {
  if (digits.length === 0) {
    return [];
  }

  const result: string[] = [];
  const path: string[] = [];

  /**
   * 处理指定数字位置。
   */
  function backtrack(depth: number): void {
    if (depth === digits.length) {
      result.push(path.join(''));
      return;
    }

    for (const letter of lettersByDigit[digits[depth]]) {
      path.push(letter);
      backtrack(depth + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}`,
    pitfalls: [
      '空字符串输入应返回空数组，不是包含空字符串的数组。',
      '数字 7 和 9 对应 4 个字母，不能假设每个数字都是 3 个字母。',
    ],
    complexity: {
      time: 'O(4^n · n)',
      space: 'O(n)',
    },
  },
  {
    id: 'combination-sum',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '组合总和',
    difficulty: '中等',
    tags: ['回溯', '数组', '剪枝'],
    summary: '排序后从当前下标继续选择，允许重复使用当前数字。',
    description:
      '给定无重复候选数组 candidates 和目标值 target，返回所有和为 target 的组合；同一数字可无限次使用。',
    approach:
      '先排序便于剪枝。DFS 参数 start 控制组合顺序；选择当前数字后递归仍传 index，表示该数字可以重复使用。',
    code: `/**
 * 按升序比较两个数字。
 */
function compareNumbers(left: number, right: number): number {
  return left - right;
}

/**
 * 返回所有和为目标值的候选数组合。
 */
function combinationSum(candidates: number[], target: number): number[][] {
  const sortedCandidates = [...candidates].sort(compareNumbers);
  const result: number[][] = [];
  const path: number[] = [];

  /**
   * 从指定起点继续构造剩余目标值。
   */
  function backtrack(start: number, remain: number): void {
    if (remain === 0) {
      result.push([...path]);
      return;
    }

    for (let index = start; index < sortedCandidates.length; index += 1) {
      const value = sortedCandidates[index];

      if (value > remain) {
        break;
      }

      path.push(value);
      backtrack(index, remain - value);
      path.pop();
    }
  }

  backtrack(0, target);
  return result;
}`,
    pitfalls: [
      '允许重复使用当前数字，递归起点应传 index 而不是 index + 1。',
      '排序后遇到 value > remain 可以直接停止当前循环。',
    ],
    complexity: {
      time: 'O(S)',
      space: 'O(target)',
    },
  },
  {
    id: 'generate-parentheses',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '括号生成',
    difficulty: '中等',
    tags: ['回溯', '字符串', '剪枝'],
    summary: '左括号数量不超过 n，右括号数量不超过左括号数量。',
    description:
      '给定括号对数 n，生成所有合法的括号组合。',
    approach:
      'DFS 中记录已经使用的左右括号数量。只要 left < n 就可以放左括号；只有 right < left 时才可以放右括号。',
    code: `/**
 * 生成指定对数的所有合法括号组合。
 */
function generateParenthesis(pairCount: number): string[] {
  const result: string[] = [];
  const path: string[] = [];

  /**
   * 继续放置左右括号。
   */
  function backtrack(leftCount: number, rightCount: number): void {
    if (path.length === pairCount * 2) {
      result.push(path.join(''));
      return;
    }

    if (leftCount < pairCount) {
      path.push('(');
      backtrack(leftCount + 1, rightCount);
      path.pop();
    }

    if (rightCount < leftCount) {
      path.push(')');
      backtrack(leftCount, rightCount + 1);
      path.pop();
    }
  }

  backtrack(0, 0);
  return result;
}`,
    pitfalls: [
      '任意前缀中右括号数量不能超过左括号数量。',
      '结果长度必须是 2n，不能只看左右括号数量是否相等。',
    ],
    complexity: {
      time: 'O(Cn · n)',
      space: 'O(n)',
    },
  },
  {
    id: 'word-search',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '单词搜索',
    difficulty: '中等',
    tags: ['回溯', '矩阵', '深度优先'],
    summary: '从匹配首字符的位置出发 DFS，访问过的格子临时标记。',
    description:
      '给定字符网格和单词，判断单词是否能由相邻单元格按顺序组成；同一格子不能重复使用。',
    approach:
      '枚举每个起点，DFS 检查当前位置是否匹配 word[index]。匹配后临时标记已访问，搜索四个方向，回溯时恢复字符。',
    code: `/**
 * 判断网格中是否存在指定单词路径。
 */
function exist(board: string[][], word: string): boolean {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  /**
   * 从指定格子匹配单词的指定位置。
   */
  function dfs(row: number, column: number, index: number): boolean {
    if (index === word.length) {
      return true;
    }
    if (
      row < 0 ||
      row >= board.length ||
      column < 0 ||
      column >= board[row].length ||
      board[row][column] !== word[index]
    ) {
      return false;
    }

    const original = board[row][column];
    board[row][column] = '#';

    for (const [rowOffset, columnOffset] of directions) {
      if (dfs(row + rowOffset, column + columnOffset, index + 1)) {
        board[row][column] = original;
        return true;
      }
    }

    board[row][column] = original;
    return false;
  }

  for (let row = 0; row < board.length; row += 1) {
    for (let column = 0; column < board[row].length; column += 1) {
      if (dfs(row, column, 0)) {
        return true;
      }
    }
  }

  return false;
}`,
    pitfalls: [
      '同一条路径中不能重复使用格子，需要临时标记已访问。',
      '回溯结束必须恢复原字符，否则会影响其他起点搜索。',
    ],
    complexity: {
      time: 'O(mn · 3^k)',
      space: 'O(k)',
    },
  },
  {
    id: 'palindrome-partitioning',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: '分割回文串',
    difficulty: '中等',
    tags: ['回溯', '字符串', '回文'],
    summary: '枚举每个切割终点，只在当前片段为回文时继续递归。',
    description:
      '给定字符串 s，将其分割成若干子串，使每个子串都是回文串，返回所有分割方案。',
    approach:
      'DFS 从 start 开始枚举 end。若 s[start..end] 为回文，则加入路径并递归处理 end + 1；到达字符串末尾时收集方案。',
    code: `/**
 * 判断字符串闭区间是否为回文。
 */
function isPalindromeRange(value: string, initialLeft: number, initialRight: number): boolean {
  let left = initialLeft;
  let right = initialRight;

  while (left < right) {
    if (value[left] !== value[right]) {
      return false;
    }
    left += 1;
    right -= 1;
  }

  return true;
}

/**
 * 返回字符串的所有回文分割方案。
 */
function partition(value: string): string[][] {
  const result: string[][] = [];
  const path: string[] = [];

  /**
   * 从指定下标继续切割字符串。
   */
  function backtrack(start: number): void {
    if (start === value.length) {
      result.push([...path]);
      return;
    }

    for (let end = start; end < value.length; end += 1) {
      if (!isPalindromeRange(value, start, end)) {
        continue;
      }

      path.push(value.slice(start, end + 1));
      backtrack(end + 1);
      path.pop();
    }
  }

  backtrack(0);
  return result;
}`,
    pitfalls: [
      '每次切割前都要确认当前片段是回文。',
      '保存方案时要复制 path，不能直接保存可变引用。',
    ],
    complexity: {
      time: 'O(n · 2^n)',
      space: 'O(n)',
    },
  },
  {
    id: 'n-queens',
    domainId: 'leetcode',
    categoryId: 'traversal',
    title: 'N 皇后',
    difficulty: '困难',
    tags: ['回溯', '棋盘', '剪枝'],
    summary: '逐行放置皇后，用列和两条对角线集合快速判断冲突。',
    description:
      '给定整数 n，返回所有不同的 n 皇后摆放方案，使任意两个皇后都不能互相攻击。',
    approach:
      '每一行选择一个列放置皇后。用 columns、diagonalA、diagonalB 记录已占用的列和对角线，合法时进入下一行。',
    code: `/**
 * 求解 n 皇后所有合法棋盘。
 */
function solveNQueens(size: number): string[][] {
  const result: string[][] = [];
  const board = Array.from({ length: size }, () => new Array<string>(size).fill('.'));
  const columns = new Set<number>();
  const diagonalA = new Set<number>();
  const diagonalB = new Set<number>();

  /**
   * 尝试在指定行放置皇后。
   */
  function backtrack(row: number): void {
    if (row === size) {
      result.push(board.map(rowValues => rowValues.join('')));
      return;
    }

    for (let column = 0; column < size; column += 1) {
      const firstKey = row - column;
      const secondKey = row + column;

      if (
        columns.has(column) ||
        diagonalA.has(firstKey) ||
        diagonalB.has(secondKey)
      ) {
        continue;
      }

      board[row][column] = 'Q';
      columns.add(column);
      diagonalA.add(firstKey);
      diagonalB.add(secondKey);
      backtrack(row + 1);
      diagonalB.delete(secondKey);
      diagonalA.delete(firstKey);
      columns.delete(column);
      board[row][column] = '.';
    }
  }

  backtrack(0);
  return result;
}`,
    pitfalls: [
      '每一行只能放一个皇后，因此递归层级天然对应行号。',
      '两条对角线可分别用 row - column 和 row + column 唯一标识。',
    ],
    complexity: {
      time: 'O(n!)',
      space: 'O(n²)',
    },
  },
] satisfies CatalogItem[];

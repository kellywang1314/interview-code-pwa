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
] satisfies CatalogItem[];

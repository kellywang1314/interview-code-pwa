import type { CatalogItem } from '../types';

export const arrayItems = [
  {
    id: 'two-sum',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '两数之和',
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
    pitfalls: [
      '必须先查询再写入，避免重复使用同一个元素。',
      '不能用布尔值判断下标是否命中，因为下标 0 是合法值。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    id: 'longest-consecutive-sequence',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '最长连续序列',
    difficulty: '中等',
    tags: ['哈希表', '数组', '连续序列'],
    summary: '用集合判断序列起点，只从起点向后扩展计数。',
    description:
      '给定未排序整数数组 nums，找出数字连续的最长序列长度。要求时间复杂度为 O(n)。',
    approach:
      '先把所有数字放入 Set。遍历每个数字时，只有当 value - 1 不存在时才把它当作序列起点，然后不断查找 value + 1、value + 2 并更新最长长度。',
    code: `/**
 * 返回未排序数组中最长连续数字序列的长度。
 */
function longestConsecutive(nums: number[]): number {
  const values = new Set(nums);
  let longest = 0;

  for (const value of values) {
    if (values.has(value - 1)) {
      continue;
    }

    let current = value;
    let length = 1;

    while (values.has(current + 1)) {
      current += 1;
      length += 1;
    }

    longest = Math.max(longest, length);
  }

  return longest;
}`,
    pitfalls: [
      '不能从每个数字都向后扩展，否则在连续长序列上会退化为 O(n²)。',
      '重复数字需要通过 Set 去重，否则长度统计会被重复值干扰。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    id: 'move-zeroes',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '移动零',
    difficulty: '简单',
    tags: ['数组', '双指针', '原地修改'],
    summary: '用写指针压缩非零元素，再把尾部补零。',
    description:
      '给定数组 nums，将所有 0 移动到数组末尾，同时保持非零元素的相对顺序，并且必须原地操作。',
    approach:
      '使用 insertIndex 表示下一个非零元素写入位置。先遍历数组写入所有非零值，再从 insertIndex 开始把剩余位置填为 0。',
    code: `/**
 * 原地将数组中的零移动到末尾，并保持非零元素相对顺序。
 */
function moveZeroes(nums: number[]): void {
  let insertIndex = 0;

  for (const value of nums) {
    if (value !== 0) {
      nums[insertIndex] = value;
      insertIndex += 1;
    }
  }

  for (let index = insertIndex; index < nums.length; index += 1) {
    nums[index] = 0;
  }
}`,
    pitfalls: [
      '不能直接删除或插入元素，否则容易改变相对顺序并增加额外开销。',
      '第二段补零必须从写指针位置开始，避免覆盖已经整理好的非零元素。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'container-with-most-water',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '盛最多水的容器',
    difficulty: '中等',
    tags: ['数组', '双指针', '贪心'],
    summary: '左右指针夹住容器，每次移动较短边尝试提升高度。',
    description:
      '给定非负整数数组 height，每个元素表示一条竖线高度，找出两条线与 x 轴能组成的最大盛水面积。',
    approach:
      '初始选择最宽的左右边界。面积由较短边决定，因此每轮计算面积后移动较短的一侧，才可能在宽度变小后获得更高的有效高度。',
    code: `/**
 * 返回两条竖线可以形成的最大容器面积。
 */
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let bestArea = 0;

  while (left < right) {
    const width = right - left;
    const currentHeight = Math.min(height[left], height[right]);
    bestArea = Math.max(bestArea, width * currentHeight);

    if (height[left] <= height[right]) {
      left += 1;
    } else {
      right -= 1;
    }
  }

  return bestArea;
}`,
    pitfalls: [
      '移动较高边不会提高当前短板，可能错过正确的剪枝方向。',
      '面积宽度是下标差 right - left，不是元素个数。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'three-sum',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '三数之和',
    difficulty: '中等',
    tags: ['数组', '双指针', '排序'],
    summary: '排序后固定一个数，再用左右指针寻找互补的两个数。',
    description:
      '给定整数数组 nums，返回所有和为 0 且不重复的三元组，三元组中的元素必须来自不同下标。',
    approach:
      '先排序，枚举第一个数。若当前值与前一个值相同则跳过；剩余区间用双指针收缩，并在命中后跳过左右两侧的重复值。',
    code: `/**
 * 按升序比较两个数字。
 */
function compareNumbers(left: number, right: number): number {
  return left - right;
}

/**
 * 返回数组中所有不重复且和为零的三元组。
 */
function threeSum(nums: number[]): number[][] {
  const sortedNums = [...nums].sort(compareNumbers);
  const results: number[][] = [];

  for (let first = 0; first < sortedNums.length - 2; first += 1) {
    if (first > 0 && sortedNums[first] === sortedNums[first - 1]) {
      continue;
    }
    if (sortedNums[first] > 0) {
      break;
    }

    let left = first + 1;
    let right = sortedNums.length - 1;

    while (left < right) {
      const sum = sortedNums[first] + sortedNums[left] + sortedNums[right];

      if (sum < 0) {
        left += 1;
      } else if (sum > 0) {
        right -= 1;
      } else {
        results.push([sortedNums[first], sortedNums[left], sortedNums[right]]);
        left += 1;
        right -= 1;

        while (left < right && sortedNums[left] === sortedNums[left - 1]) {
          left += 1;
        }
        while (left < right && sortedNums[right] === sortedNums[right + 1]) {
          right -= 1;
        }
      }
    }
  }

  return results;
}`,
    pitfalls: [
      '去重必须同时覆盖固定值、左指针值和右指针值。',
      '排序改变原数组时可能影响调用方，示例通过复制数组避免副作用。',
    ],
    complexity: {
      time: 'O(n²)',
      space: 'O(n)',
    },
  },
  {
    id: 'trapping-rain-water',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '接雨水',
    difficulty: '困难',
    tags: ['数组', '双指针', '前后缀'],
    summary: '维护左右最高墙，短板侧可确定当前位置接水量。',
    description:
      '给定柱子高度数组 height，计算下雨后这些柱子能接住多少单位的雨水。',
    approach:
      '左右指针向中间收缩，并记录 leftMax 与 rightMax。哪边最大高度更低，就能确定哪边当前位置的接水量，然后移动该侧指针。',
    code: `/**
 * 计算柱状高度图可以接住的雨水总量。
 */
function trap(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let totalWater = 0;

  while (left < right) {
    leftMax = Math.max(leftMax, height[left]);
    rightMax = Math.max(rightMax, height[right]);

    if (leftMax <= rightMax) {
      totalWater += leftMax - height[left];
      left += 1;
    } else {
      totalWater += rightMax - height[right];
      right -= 1;
    }
  }

  return totalWater;
}`,
    pitfalls: [
      '当前位置水量取决于左右最大值中的较小者，不是左右当前高度的较小者。',
      '先更新最大值再累加水量，可以避免出现负数接水量。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'subarray-sum-equals-k',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '和为 K 的子数组',
    difficulty: '中等',
    tags: ['数组', '前缀和', '哈希表'],
    summary: '记录前缀和出现次数，用当前前缀反查差值。',
    description:
      '给定整数数组 nums 和整数 k，统计数组中和为 k 的连续子数组个数。',
    approach:
      '遍历时维护 prefixSum。若此前存在 prefixSum - k，说明这些位置到当前位置之间的子数组和为 k。Map 中保存每个前缀和出现次数。',
    code: `/**
 * 统计数组中和为目标值的连续子数组数量。
 */
function subarraySum(nums: number[], target: number): number {
  const countByPrefixSum = new Map<number, number>([[0, 1]]);
  let prefixSum = 0;
  let count = 0;

  for (const value of nums) {
    prefixSum += value;
    count += countByPrefixSum.get(prefixSum - target) ?? 0;
    countByPrefixSum.set(
      prefixSum,
      (countByPrefixSum.get(prefixSum) ?? 0) + 1,
    );
  }

  return count;
}`,
    pitfalls: [
      '数组可能包含负数，不能用普通滑动窗口替代前缀和。',
      '前缀和 0 的初始次数必须设为 1，用来覆盖从下标 0 开始的子数组。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    id: 'sliding-window-maximum',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '滑动窗口最大值',
    difficulty: '困难',
    tags: ['数组', '单调队列', '滑动窗口'],
    summary: '用单调递减队列保存候选下标，队头始终是窗口最大值。',
    description:
      '给定整数数组 nums 和窗口大小 k，返回每个长度为 k 的滑动窗口中的最大值。',
    approach:
      '队列保存下标并保持对应值递减。新元素进入前弹出所有不大于它的队尾下标，窗口左侧过期下标从队头移除。',
    code: `/**
 * 返回每个固定大小滑动窗口中的最大值。
 */
function maxSlidingWindow(nums: number[], windowSize: number): number[] {
  const result: number[] = [];
  const indices: number[] = [];

  for (let index = 0; index < nums.length; index += 1) {
    while (indices.length > 0 && indices[0] <= index - windowSize) {
      indices.shift();
    }

    while (
      indices.length > 0 &&
      nums[indices[indices.length - 1]] <= nums[index]
    ) {
      indices.pop();
    }

    indices.push(index);

    if (index >= windowSize - 1) {
      result.push(nums[indices[0]]);
    }
  }

  return result;
}`,
    pitfalls: [
      '队列里保存下标而不是值，才能判断元素是否已经滑出窗口。',
      '维护递减队列时弹出小值不会丢答案，因为新元素更靠右且不小于它们。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(k)',
    },
  },
  {
    id: 'maximum-subarray',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '最大子数组和',
    difficulty: '中等',
    tags: ['数组', '动态规划', 'Kadane'],
    summary: '当前位置只关心是否接上前一段能让总和更大。',
    description:
      '给定整数数组 nums，找出一个具有最大和的连续子数组，并返回其最大和。',
    approach:
      '令 current 表示以当前位置结尾的最大子数组和。每个位置在“单独开始”和“接上前一段”之间取较大值，同时维护全局最大值。',
    code: `/**
 * 返回连续子数组可以取得的最大和。
 */
function maxSubArray(nums: number[]): number {
  let current = nums[0];
  let best = nums[0];

  for (let index = 1; index < nums.length; index += 1) {
    current = Math.max(nums[index], current + nums[index]);
    best = Math.max(best, current);
  }

  return best;
}`,
    pitfalls: [
      '不能把最大和初始为 0，否则全负数组会得到错误答案。',
      '状态必须表示以当前位置结尾，不能直接复用全局最大值向后转移。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'merge-intervals',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '合并区间',
    difficulty: '中等',
    tags: ['数组', '排序', '区间'],
    summary: '按起点排序后逐个合并与结果尾部重叠的区间。',
    description:
      '给定若干闭区间，合并所有互相重叠的区间，并返回互不重叠且覆盖范围相同的结果。',
    approach:
      '按区间起点升序排列。当前区间起点不大于已合并区间的终点时更新终点，否则将当前区间作为新的结果区间。',
    code: `/**
 * 按区间起点升序比较两个区间。
 */
function compareIntervals(left: number[], right: number[]): number {
  return left[0] - right[0];
}

/**
 * 合并所有重叠区间。
 */
function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length === 0) {
    return [];
  }

  const sortedIntervals = intervals
    .map(interval => [...interval])
    .sort(compareIntervals);
  const merged: number[][] = [sortedIntervals[0]];

  for (let index = 1; index < sortedIntervals.length; index += 1) {
    const current = sortedIntervals[index];
    const previous = merged[merged.length - 1];

    if (current[0] <= previous[1]) {
      previous[1] = Math.max(previous[1], current[1]);
    } else {
      merged.push(current);
    }
  }

  return merged;
}`,
    pitfalls: [
      '空数组需要提前返回，否则无法初始化结果。',
      '区间首尾相接也属于重叠，判断条件应使用小于等于。',
    ],
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
    },
  },
  {
    id: 'rotate-array',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '轮转数组',
    difficulty: '中等',
    tags: ['数组', '原地修改', '反转'],
    summary: '先整体反转，再分别反转前 k 段和后半段。',
    description:
      '给定数组 nums 和非负整数 k，将数组中的元素向右轮转 k 个位置，要求原地修改。',
    approach:
      '先对 k 取模。整体反转数组后，前 k 个元素正好是轮转到前面的部分，再分别反转前 k 段与剩余段恢复内部顺序。',
    code: `/**
 * 反转数组的闭区间部分。
 */
function reverseRange(nums: number[], initialLeft: number, initialRight: number): void {
  let left = initialLeft;
  let right = initialRight;

  while (left < right) {
    const temp = nums[left];
    nums[left] = nums[right];
    nums[right] = temp;
    left += 1;
    right -= 1;
  }
}

/**
 * 原地将数组向右轮转指定步数。
 */
function rotate(nums: number[], steps: number): void {
  const normalizedSteps = steps % nums.length;

  reverseRange(nums, 0, nums.length - 1);
  reverseRange(nums, 0, normalizedSteps - 1);
  reverseRange(nums, normalizedSteps, nums.length - 1);
}`,
    pitfalls: [
      'k 可能大于数组长度，必须先对长度取模。',
      '三次反转的区间边界容易写错，第二段从 normalizedSteps 开始。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'product-of-array-except-self',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '除自身以外数组的乘积',
    difficulty: '中等',
    tags: ['数组', '前缀积', '后缀积'],
    summary: '结果数组先存左侧乘积，再乘上右侧累积乘积。',
    description:
      '给定整数数组 nums，返回数组 answer，其中 answer[i] 等于 nums 中除 nums[i] 之外其余元素的乘积，不能使用除法。',
    approach:
      '第一次从左到右写入每个位置左侧所有元素乘积。第二次从右到左维护右侧乘积，并乘到结果数组上。',
    code: `/**
 * 返回每个位置除自身以外所有元素的乘积。
 */
function productExceptSelf(nums: number[]): number[] {
  const result = new Array<number>(nums.length).fill(1);
  let prefixProduct = 1;

  for (let index = 0; index < nums.length; index += 1) {
    result[index] = prefixProduct;
    prefixProduct *= nums[index];
  }

  let suffixProduct = 1;

  for (let index = nums.length - 1; index >= 0; index -= 1) {
    result[index] *= suffixProduct;
    suffixProduct *= nums[index];
  }

  return result;
}`,
    pitfalls: [
      '题目限制不能用除法，尤其要兼容数组中存在 0 的情况。',
      '后缀乘积必须先乘入结果，再乘当前元素，避免把自身算进去。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'first-missing-positive',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '缺失的第一个正数',
    difficulty: '困难',
    tags: ['数组', '原地哈希', '交换'],
    summary: '把值 x 放到下标 x - 1，最后找第一个不匹配位置。',
    description:
      '给定未排序整数数组 nums，找出其中没有出现的最小正整数，要求 O(n) 时间和 O(1) 额外空间。',
    approach:
      '不断把范围 [1, n] 内的数字放到它应该在的位置 value - 1。整理后第一个 nums[index] !== index + 1 的位置就是答案。',
    code: `/**
 * 返回数组中缺失的最小正整数。
 */
function firstMissingPositive(nums: number[]): number {
  for (let index = 0; index < nums.length; index += 1) {
    while (
      nums[index] >= 1 &&
      nums[index] <= nums.length &&
      nums[nums[index] - 1] !== nums[index]
    ) {
      const targetIndex = nums[index] - 1;
      const temp = nums[index];
      nums[index] = nums[targetIndex];
      nums[targetIndex] = temp;
    }
  }

  for (let index = 0; index < nums.length; index += 1) {
    if (nums[index] !== index + 1) {
      return index + 1;
    }
  }

  return nums.length + 1;
}`,
    pitfalls: [
      '交换前必须判断目标位置是否已经是相同值，否则重复数字会导致死循环。',
      '只有 1 到 n 范围内的数字才需要放回原位，其他值直接忽略。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'set-matrix-zeroes',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '矩阵置零',
    difficulty: '中等',
    tags: ['数组', '矩阵', '原地标记'],
    summary: '借用第一行和第一列记录需要清零的行列。',
    description:
      '给定 m x n 矩阵，若某个元素为 0，则将其所在行和列全部置为 0，要求原地修改。',
    approach:
      '先记录第一行和第一列是否原本需要清零。之后用 matrix[row][0] 与 matrix[0][col] 标记其他行列，最后按标记清零并处理首行首列。',
    code: `/**
 * 原地将包含零的行和列全部置零。
 */
function setZeroes(matrix: number[][]): void {
  const rowCount = matrix.length;
  const columnCount = matrix[0].length;
  let shouldClearFirstRow = false;
  let shouldClearFirstColumn = false;

  for (let column = 0; column < columnCount; column += 1) {
    if (matrix[0][column] === 0) {
      shouldClearFirstRow = true;
    }
  }

  for (let row = 0; row < rowCount; row += 1) {
    if (matrix[row][0] === 0) {
      shouldClearFirstColumn = true;
    }
  }

  for (let row = 1; row < rowCount; row += 1) {
    for (let column = 1; column < columnCount; column += 1) {
      if (matrix[row][column] === 0) {
        matrix[row][0] = 0;
        matrix[0][column] = 0;
      }
    }
  }

  for (let row = 1; row < rowCount; row += 1) {
    for (let column = 1; column < columnCount; column += 1) {
      if (matrix[row][0] === 0 || matrix[0][column] === 0) {
        matrix[row][column] = 0;
      }
    }
  }

  if (shouldClearFirstRow) {
    for (let column = 0; column < columnCount; column += 1) {
      matrix[0][column] = 0;
    }
  }

  if (shouldClearFirstColumn) {
    for (let row = 0; row < rowCount; row += 1) {
      matrix[row][0] = 0;
    }
  }
}`,
    pitfalls: [
      '第一行和第一列会被用作标记位，必须先保存它们自身是否需要清零。',
      '清零主体区域要从 1 开始遍历，最后再单独处理首行首列。',
    ],
    complexity: {
      time: 'O(mn)',
      space: 'O(1)',
    },
  },
  {
    id: 'spiral-matrix',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '螺旋矩阵',
    difficulty: '中等',
    tags: ['数组', '矩阵', '模拟'],
    summary: '维护上下左右四条边界，按层顺时针收缩。',
    description:
      '给定 m x n 矩阵，按照顺时针螺旋顺序返回矩阵中的所有元素。',
    approach:
      '用 top、bottom、left、right 表示当前未访问矩形边界。每轮依次遍历上边、右边、下边、左边，并在遍历后收缩对应边界。',
    code: `/**
 * 按顺时针螺旋顺序返回矩阵元素。
 */
function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let column = left; column <= right; column += 1) {
      result.push(matrix[top][column]);
    }
    top += 1;

    for (let row = top; row <= bottom; row += 1) {
      result.push(matrix[row][right]);
    }
    right -= 1;

    if (top <= bottom) {
      for (let column = right; column >= left; column -= 1) {
        result.push(matrix[bottom][column]);
      }
      bottom -= 1;
    }

    if (left <= right) {
      for (let row = bottom; row >= top; row -= 1) {
        result.push(matrix[row][left]);
      }
      left += 1;
    }
  }

  return result;
}`,
    pitfalls: [
      '遍历下边和左边前要重新检查边界，避免单行或单列被重复访问。',
      '每条边遍历后要立即收缩，否则下一轮会访问已处理区域。',
    ],
    complexity: {
      time: 'O(mn)',
      space: 'O(1)',
    },
  },
  {
    id: 'rotate-image',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '旋转图像',
    difficulty: '中等',
    tags: ['数组', '矩阵', '原地修改'],
    summary: '先沿主对角线转置，再反转每一行。',
    description:
      '给定 n x n 二维矩阵表示图像，将图像原地顺时针旋转 90 度。',
    approach:
      '顺时针旋转可以拆成两步：先交换 matrix[row][col] 与 matrix[col][row] 完成转置，再把每一行左右反转。',
    code: `/**
 * 原地将正方形矩阵顺时针旋转 90 度。
 */
function rotateImage(matrix: number[][]): void {
  const size = matrix.length;

  for (let row = 0; row < size; row += 1) {
    for (let column = row + 1; column < size; column += 1) {
      const temp = matrix[row][column];
      matrix[row][column] = matrix[column][row];
      matrix[column][row] = temp;
    }
  }

  for (const rowValues of matrix) {
    rowValues.reverse();
  }
}`,
    pitfalls: [
      '转置只需要遍历主对角线上方区域，否则交换两次会回到原状。',
      '顺时针旋转是转置后反转每一行，逆时针旋转的步骤不同。',
    ],
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
  },
  {
    id: 'search-a-2d-matrix-ii',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '搜索二维矩阵 II',
    difficulty: '中等',
    tags: ['数组', '矩阵', '搜索'],
    summary: '从右上角出发，大了左移，小了下移。',
    description:
      '给定行和列都升序排列的二维矩阵 matrix，判断目标值 target 是否存在。',
    approach:
      '从右上角开始。当前值大于 target 时排除当前列并左移；当前值小于 target 时排除当前行并下移。',
    code: `/**
 * 判断行列均升序的矩阵中是否存在目标值。
 */
function searchMatrix(matrix: number[][], target: number): boolean {
  let row = 0;
  let column = matrix[0].length - 1;

  while (row < matrix.length && column >= 0) {
    const value = matrix[row][column];

    if (value === target) {
      return true;
    }

    if (value > target) {
      column -= 1;
    } else {
      row += 1;
    }
  }

  return false;
}`,
    pitfalls: [
      '从左上角无法确定排除方向，右上角或左下角才有单调剪枝。',
      '边界条件要同时检查行未越界、列未越界。',
    ],
    complexity: {
      time: 'O(m + n)',
      space: 'O(1)',
    },
  },
] satisfies CatalogItem[];

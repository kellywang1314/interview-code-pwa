import type { CatalogItem } from '../types';

export const arrayItems = [
  {
    id: 'two-sum',
    domainId: 'leetcode',
    categoryId: 'array',
    title: '两数之和',
    difficulty: '简单',
    tags: ['数组', '哈希表'],
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
] satisfies CatalogItem[];

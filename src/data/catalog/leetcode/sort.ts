import type { CatalogItem } from '../types';

export const sortItems = [
  {
    id: 'sort-colors',
    domainId: 'leetcode',
    categoryId: 'sort',
    title: '颜色分类',
    difficulty: '中等',
    tags: ['排序', '双指针', '荷兰国旗'],
    summary: '用三个边界一次遍历，将 0、1、2 分别放入对应区间。',
    description:
      '给定只包含 0、1、2 的数组，在不调用库排序函数的前提下原地按升序排列。',
    approach:
      '维护零区间右边界、当前指针和二区间左边界。遇到 0 与左侧交换，遇到 2 与右侧交换并重新检查换入值。',
    code: `/**
 * 交换数组中两个位置的值。
 */
function swapValues(values: number[], first: number, second: number): void {
  [values[first], values[second]] = [values[second], values[first]];
}

/**
 * 原地将只包含 0、1、2 的数组排序。
 */
function sortColors(colors: number[]): void {
  let zeroBoundary = 0;
  let current = 0;
  let twoBoundary = colors.length - 1;

  while (current <= twoBoundary) {
    if (colors[current] === 0) {
      swapValues(colors, current, zeroBoundary);
      zeroBoundary += 1;
      current += 1;
    } else if (colors[current] === 2) {
      swapValues(colors, current, twoBoundary);
      twoBoundary -= 1;
    } else {
      current += 1;
    }
  }
}`,
    pitfalls: [
      '与右侧交换后不能立即移动 current，因为换入的值尚未检查。',
      '循环条件必须包含 current 等于 twoBoundary 的情况。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'kth-largest-element-in-an-array',
    domainId: 'leetcode',
    categoryId: 'sort',
    title: '数组中的第 K 个最大元素',
    difficulty: '中等',
    tags: ['快速选择', '分治', '数组'],
    summary: '将第 K 大转换为升序索引，用快速选择只处理目标所在分区。',
    description:
      '给定整数数组和整数 k，返回排序后第 k 个最大的元素，而不是第 k 个不同的元素。',
    approach:
      '第 k 大对应升序下标 n-k。反复分区，若基准位置小于目标则搜索右侧，大于目标则搜索左侧。',
    code: `/**
 * 交换数组中两个位置的值。
 */
function swapValues(values: number[], first: number, second: number): void {
  [values[first], values[second]] = [values[second], values[first]];
}

/**
 * 对指定区间分区并返回基准最终位置。
 */
function partition(values: number[], left: number, right: number): number {
  const pivot = values[right];
  let boundary = left;

  for (let index = left; index < right; index += 1) {
    if (values[index] <= pivot) {
      swapValues(values, index, boundary);
      boundary += 1;
    }
  }

  swapValues(values, boundary, right);
  return boundary;
}

/**
 * 返回数组中的第 k 个最大元素。
 */
function findKthLargest(values: number[], k: number): number {
  const targetIndex = values.length - k;
  let left = 0;
  let right = values.length - 1;

  while (left <= right) {
    const pivotIndex = partition(values, left, right);

    if (pivotIndex === targetIndex) {
      return values[pivotIndex];
    }
    if (pivotIndex < targetIndex) {
      left = pivotIndex + 1;
    } else {
      right = pivotIndex - 1;
    }
  }

  throw new RangeError('k 超出数组范围');
}`,
    pitfalls: [
      '第 k 大对应的升序下标是 length-k，不是 k-1。',
      '固定选择末尾基准在有序输入上可能退化，可随机化基准提高稳定性。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'sort-list',
    domainId: 'leetcode',
    categoryId: 'sort',
    title: '排序链表',
    difficulty: '中等',
    tags: ['链表', '归并排序', '快慢指针'],
    summary: '快慢指针拆分链表，递归排序后再合并。',
    description:
      '给定单链表头节点，在 O(n log n) 时间内将链表按升序排列并返回新的头节点。',
    approach:
      '快慢指针找到中点并断开链表，递归排序左右两半，再像合并两个有序链表一样合并结果。',
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
 * 合并两个升序单链表。
 */
function mergeSortedLists(
  first: ListNode | null,
  second: ListNode | null,
): ListNode | null {
  const sentinel = new ListNode(0);
  let tail = sentinel;
  let left = first;
  let right = second;

  while (left && right) {
    if (left.value <= right.value) {
      tail.next = left;
      left = left.next;
    } else {
      tail.next = right;
      right = right.next;
    }
    tail = tail.next;
  }

  tail.next = left ?? right;
  return sentinel.next;
}

/**
 * 使用归并排序按升序排列单链表。
 */
function sortList(head: ListNode | null): ListNode | null {
  if (!head?.next) {
    return head;
  }

  let slow: ListNode = head;
  let fast: ListNode | null = head.next;

  while (fast?.next) {
    slow = slow.next as ListNode;
    fast = fast.next.next;
  }

  const rightHead = slow.next;
  slow.next = null;

  return mergeSortedLists(sortList(head), sortList(rightHead));
}`,
    pitfalls: [
      '递归前必须从中点断开链表，否则左半部分不会缩短。',
      '快指针从 head.next 开始可保证偶数长度时左右两半都非空。',
    ],
    complexity: {
      time: 'O(n log n)',
      space: 'O(log n)',
    },
  },
] satisfies CatalogItem[];

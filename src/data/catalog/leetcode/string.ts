import type { CatalogItem } from '../types';

export const stringItems = [
  {
    id: 'longest-substring-without-repeating-characters',
    domainId: 'leetcode',
    categoryId: 'string',
    title: '无重复字符的最长子串',
    difficulty: '中等',
    tags: ['字符串', '滑动窗口', '哈希表'],
    summary: '记录字符最近位置，动态移动窗口左边界。',
    description:
      '给定字符串 s，找出其中不含重复字符的最长连续子串，并返回该子串的长度。',
    approach:
      '右指针逐个扫描字符，用哈希表保存字符最后出现位置。当字符在当前窗口内重复时，将左边界移动到上次位置的后一位。',
    code: `/**
 * 返回不含重复字符的最长连续子串长度。
 */
function lengthOfLongestSubstring(value: string): number {
  const lastIndexByCharacter = new Map<string, number>();
  let left = 0;
  let longest = 0;

  for (let right = 0; right < value.length; right += 1) {
    const character = value[right];
    const previousIndex = lastIndexByCharacter.get(character);

    if (previousIndex !== undefined && previousIndex >= left) {
      left = previousIndex + 1;
    }

    lastIndexByCharacter.set(character, right);
    longest = Math.max(longest, right - left + 1);
  }

  return longest;
}`,
    pitfalls: [
      '左边界只能向右移动，不能退回窗口之外的旧位置。',
      'JavaScript 按 UTF-16 码元索引字符串，复杂 Unicode 字符需要先转为字符数组。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    id: 'longest-palindromic-substring',
    domainId: 'leetcode',
    categoryId: 'string',
    title: '最长回文子串',
    difficulty: '中等',
    tags: ['字符串', '中心扩展'],
    summary: '以每个字符和字符间隙为中心向两侧扩展。',
    description:
      '给定字符串 s，返回其中最长的回文连续子串。若存在多个等长答案，可返回任意一个。',
    approach:
      '枚举所有奇数和偶数回文中心，向两侧扩展到字符不相等为止，持续记录最长区间。',
    code: `/**
 * 从指定左右边界向两侧扩展，并返回回文区间。
 */
function expandPalindrome(
  value: string,
  initialLeft: number,
  initialRight: number,
): [number, number] {
  let left = initialLeft;
  let right = initialRight;

  while (left >= 0 && right < value.length && value[left] === value[right]) {
    left -= 1;
    right += 1;
  }

  return [left + 1, right - 1];
}

/**
 * 返回字符串中的最长回文子串。
 */
function longestPalindrome(value: string): string {
  let bestStart = 0;
  let bestEnd = -1;

  for (let center = 0; center < value.length; center += 1) {
    const candidates = [
      expandPalindrome(value, center, center),
      expandPalindrome(value, center, center + 1),
    ];

    for (const [start, end] of candidates) {
      if (end - start > bestEnd - bestStart) {
        bestStart = start;
        bestEnd = end;
      }
    }
  }

  return value.slice(bestStart, bestEnd + 1);
}`,
    pitfalls: [
      '奇数长度与偶数长度回文需要使用两种中心。',
      '扩展结束时左右边界已经多走一步，返回前需要回退。',
    ],
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
  },
  {
    id: 'group-anagrams',
    domainId: 'leetcode',
    categoryId: 'string',
    title: '字母异位词分组',
    difficulty: '中等',
    tags: ['字符串', '哈希表', '排序'],
    summary: '将排序后的字符序列作为异位词的统一键。',
    description:
      '给定字符串数组，将由相同字符以不同顺序组成的字母异位词归入同一组。',
    approach:
      '每个字符串拆分并排序后得到规范键。使用 Map 按键收集原字符串，最后返回所有分组。',
    code: `/**
 * 按字母异位关系对字符串进行分组。
 */
function groupAnagrams(values: string[]): string[][] {
  const groupsByKey = new Map<string, string[]>();

  for (const value of values) {
    const key = [...value].sort().join('');
    const group = groupsByKey.get(key);

    if (group) {
      group.push(value);
    } else {
      groupsByKey.set(key, [value]);
    }
  }

  return [...groupsByKey.values()];
}`,
    pitfalls: [
      '规范键必须稳定，相同字符及次数应生成完全相同的键。',
      '若字符集固定且字符串很长，可用频次数组降低每个字符串的排序成本。',
    ],
    complexity: {
      time: 'O(n · k log k)',
      space: 'O(n · k)',
    },
  },
] satisfies CatalogItem[];

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
    id: 'find-all-anagrams-in-a-string',
    domainId: 'leetcode',
    categoryId: 'string',
    title: '找到字符串中所有字母异位词',
    difficulty: '中等',
    tags: ['字符串', '滑动窗口', '哈希表'],
    summary: '固定窗口长度，维护字符频次差异来判断异位词。',
    description:
      '给定字符串 s 和 p，找到 s 中所有 p 的字母异位词子串，并返回这些子串的起始下标。',
    approach:
      '窗口长度固定为 p.length。先统计 p 的字符需求，再滑动 s 的窗口：右端进入字符减少需求，左端移出字符恢复需求，用 matched 记录已满足字符数量。',
    code: `/**
 * 返回文本中所有目标字符串字母异位词的起始下标。
 */
function findAnagrams(text: string, pattern: string): number[] {
  if (pattern.length > text.length) {
    return [];
  }

  const need = new Map<string, number>();
  const result: number[] = [];

  for (const character of pattern) {
    need.set(character, (need.get(character) ?? 0) + 1);
  }

  let matched = 0;

  for (let right = 0; right < text.length; right += 1) {
    const entering = text[right];

    if (need.has(entering)) {
      const nextCount = (need.get(entering) ?? 0) - 1;
      need.set(entering, nextCount);

      if (nextCount >= 0) {
        matched += 1;
      }
    }

    if (right >= pattern.length) {
      const leaving = text[right - pattern.length];

      if (need.has(leaving)) {
        const nextCount = (need.get(leaving) ?? 0) + 1;
        need.set(leaving, nextCount);

        if (nextCount > 0) {
          matched -= 1;
        }
      }
    }

    if (matched === pattern.length) {
      result.push(right - pattern.length + 1);
    }
  }

  return result;
}`,
    pitfalls: [
      '窗口长度必须固定为 p.length，不能只靠左右指针自由收缩。',
      '字符移出窗口时，如果恢复后需求量大于 0，才说明一个匹配字符丢失。',
    ],
    complexity: {
      time: 'O(n + m)',
      space: 'O(m)',
    },
  },
  {
    id: 'minimum-window-substring',
    domainId: 'leetcode',
    categoryId: 'string',
    title: '最小覆盖子串',
    difficulty: '困难',
    tags: ['字符串', '滑动窗口', '哈希表'],
    summary: '右扩直到覆盖所有需求，再左缩得到最短窗口。',
    description:
      '给定字符串 s 和 t，返回 s 中覆盖 t 所有字符及其数量的最小子串；若不存在则返回空字符串。',
    approach:
      '统计 t 的字符需求。右指针扩张窗口并记录已满足的字符个数；当窗口已覆盖 t 时，持续移动左指针收缩，并更新最短答案。',
    code: `/**
 * 返回文本中覆盖目标全部字符的最短子串。
 */
function minWindow(text: string, target: string): string {
  if (target.length === 0 || target.length > text.length) {
    return '';
  }

  const need = new Map<string, number>();

  for (const character of target) {
    need.set(character, (need.get(character) ?? 0) + 1);
  }

  let left = 0;
  let matched = 0;
  let bestStart = 0;
  let bestLength = Number.POSITIVE_INFINITY;

  for (let right = 0; right < text.length; right += 1) {
    const entering = text[right];

    if (need.has(entering)) {
      const nextCount = (need.get(entering) ?? 0) - 1;
      need.set(entering, nextCount);

      if (nextCount >= 0) {
        matched += 1;
      }
    }

    while (matched === target.length) {
      const windowLength = right - left + 1;

      if (windowLength < bestLength) {
        bestStart = left;
        bestLength = windowLength;
      }

      const leaving = text[left];
      left += 1;

      if (need.has(leaving)) {
        const nextCount = (need.get(leaving) ?? 0) + 1;
        need.set(leaving, nextCount);

        if (nextCount > 0) {
          matched -= 1;
        }
      }
    }
  }

  return bestLength === Number.POSITIVE_INFINITY
    ? ''
    : text.slice(bestStart, bestStart + bestLength);
}`,
    pitfalls: [
      '覆盖条件要按字符数量判断，不能只看字符种类是否出现。',
      '收缩窗口时先记录答案再移出左端字符，否则会漏掉刚好合法的窗口。',
    ],
    complexity: {
      time: 'O(n + m)',
      space: 'O(m)',
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

import type { CatalogItem } from '../types';

export const linkedListItems = [
  {
    id: 'intersection-of-two-linked-lists',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '相交链表',
    difficulty: '简单',
    tags: ['链表', '双指针'],
    summary: '两个指针走完各自链表后切到对方头部，最终同步到交点。',
    description:
      '给定两个单链表头节点，返回两个链表开始相交的节点；若不相交则返回 null。',
    approach:
      '指针 first 与 second 分别从两个头节点出发。走到末尾后切换到另一条链表头部，两者走过相同总长度后会在交点或 null 相遇。',
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
 * 返回两个单链表开始相交的节点。
 */
function getIntersectionNode(
  firstHead: ListNode | null,
  secondHead: ListNode | null,
): ListNode | null {
  let first = firstHead;
  let second = secondHead;

  while (first !== second) {
    first = first ? first.next : secondHead;
    second = second ? second.next : firstHead;
  }

  return first;
}`,
    pitfalls: [
      '必须比较节点引用而不是节点值。',
      '无交点时两个指针最终会同时到达 null，循环也能结束。',
    ],
    complexity: {
      time: 'O(m + n)',
      space: 'O(1)',
    },
  },
  {
    id: 'reverse-linked-list',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '反转链表',
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
    pitfalls: [
      '反转指针前先保存 currentNode.next。',
      '循环结束后 previousNode 才是新的头节点。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'palindrome-linked-list',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '回文链表',
    difficulty: '简单',
    tags: ['链表', '快慢指针', '反转链表'],
    summary: '快慢指针找中点，反转后半段后逐一比较。',
    description:
      '给定单链表头节点，判断链表节点值从前往后与从后往前是否一致。',
    approach:
      '快慢指针定位链表后半段起点，反转后半段，再从头部和反转后的后半段同步比较节点值。',
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
 * 反转单链表并返回新的头节点。
 */
function reverseList(head: ListNode | null): ListNode | null {
  let previous: ListNode | null = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }

  return previous;
}

/**
 * 判断单链表是否为回文结构。
 */
function isPalindrome(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast?.next) {
    slow = slow?.next ?? null;
    fast = fast.next.next;
  }

  let right = reverseList(slow);
  let left = head;

  while (right) {
    if (left?.value !== right.value) {
      return false;
    }
    left = left.next;
    right = right.next;
  }

  return true;
}`,
    pitfalls: [
      '奇数长度时 slow 会落在中间节点，比较后半段长度即可。',
      '若业务要求链表结构不变，比较后需要把后半段再反转回来。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'linked-list-cycle',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '环形链表',
    difficulty: '简单',
    tags: ['链表', '快慢指针'],
    summary: '快指针每次走两步，若存在环最终会追上慢指针。',
    description:
      '给定单链表头节点，判断链表中是否存在某个节点可通过持续沿 next 指针再次到达。',
    approach:
      '慢指针每轮走一步，快指针每轮走两步。无环时快指针会到达 null；有环时两个指针必定在环内相遇。',
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
 * 使用快慢指针判断链表是否存在环。
 */
function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;

  while (fast?.next) {
    slow = slow?.next ?? null;
    fast = fast.next.next;

    if (slow === fast) {
      return true;
    }
  }

  return false;
}`,
    pitfalls: [
      '循环条件要同时保证 fast 和 fast.next 存在。',
      '必须比较节点引用而不是节点值，多个节点可以拥有相同值。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'linked-list-cycle-ii',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '环形链表 II',
    difficulty: '中等',
    tags: ['链表', '快慢指针'],
    summary: '快慢指针相遇后，一个指针回到头部，同速前进找到入环点。',
    description:
      '给定单链表头节点，若链表存在环，返回入环的第一个节点；若无环则返回 null。',
    approach:
      '先用快慢指针判断是否有环。相遇后将一个指针放回头节点，两个指针每次走一步，再次相遇的位置就是入环点。',
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
 * 返回单链表的入环节点。
 */
function detectCycle(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;

  while (fast?.next) {
    slow = slow?.next ?? null;
    fast = fast.next.next;

    if (slow === fast) {
      let finder = head;

      while (finder !== slow) {
        finder = finder?.next ?? null;
        slow = slow?.next ?? null;
      }

      return finder;
    }
  }

  return null;
}`,
    pitfalls: [
      '第一次相遇点不一定是入环点。',
      '第二阶段两个指针必须同速移动，不能继续使用快慢步长。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'merge-two-sorted-lists',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '合并两个有序链表',
    difficulty: '简单',
    tags: ['链表', '双指针', '哨兵节点'],
    summary: '借助哨兵节点依次连接两个链表中的较小节点。',
    description:
      '给定两个升序单链表，将它们合并为一个新的升序链表并返回头节点。',
    approach:
      '用哨兵节点简化头节点处理，比较两个游标指向的值并连接较小节点。任一链表耗尽后，直接连接另一条链表的剩余部分。',
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
function mergeTwoLists(
  firstHead: ListNode | null,
  secondHead: ListNode | null,
): ListNode | null {
  const sentinel = new ListNode(0);
  let tail = sentinel;
  let first = firstHead;
  let second = secondHead;

  while (first && second) {
    if (first.value <= second.value) {
      tail.next = first;
      first = first.next;
    } else {
      tail.next = second;
      second = second.next;
    }
    tail = tail.next;
  }

  tail.next = first ?? second;
  return sentinel.next;
}`,
    pitfalls: [
      '每次连接节点后都要同步移动 tail。',
      '循环结束后不要逐个复制剩余节点，直接连接剩余链表即可。',
    ],
    complexity: {
      time: 'O(m + n)',
      space: 'O(1)',
    },
  },
  {
    id: 'add-two-numbers',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '两数相加',
    difficulty: '中等',
    tags: ['链表', '模拟', '进位'],
    summary: '按位同步遍历两条链表，用 carry 记录进位。',
    description:
      '两个非空链表逆序表示两个非负整数，将它们相加并以同样逆序链表形式返回。',
    approach:
      '同时遍历两条链表，每轮累加两个节点值和进位，创建当前位节点，并把十位作为下一轮进位。',
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
 * 将两个逆序数字链表相加。
 */
function addTwoNumbers(
  firstHead: ListNode | null,
  secondHead: ListNode | null,
): ListNode | null {
  const sentinel = new ListNode(0);
  let tail = sentinel;
  let first = firstHead;
  let second = secondHead;
  let carry = 0;

  while (first || second || carry > 0) {
    const sum = (first?.value ?? 0) + (second?.value ?? 0) + carry;
    carry = Math.floor(sum / 10);
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    first = first?.next ?? null;
    second = second?.next ?? null;
  }

  return sentinel.next;
}`,
    pitfalls: [
      '循环条件需要包含 carry，最后一次进位可能生成新节点。',
      '两条链表长度可能不同，缺失节点按 0 处理。',
    ],
    complexity: {
      time: 'O(max(m, n))',
      space: 'O(max(m, n))',
    },
  },
  {
    id: 'remove-nth-node-from-end-of-list',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '删除链表的倒数第 N 个结点',
    difficulty: '中等',
    tags: ['链表', '双指针', '哨兵节点'],
    summary: '快指针先走 n 步，再和慢指针同步前进定位前驱。',
    description:
      '给定单链表头节点和整数 n，删除链表倒数第 n 个节点并返回头节点。',
    approach:
      '使用哨兵节点处理删除头节点的情况。快指针先走 n 步，之后快慢指针同步前进，直到快指针位于尾节点。',
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
 * 删除单链表倒数第 n 个节点。
 */
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const sentinel = new ListNode(0, head);
  let fast: ListNode | null = sentinel;
  let slow: ListNode | null = sentinel;

  for (let step = 0; step < n; step += 1) {
    fast = fast?.next ?? null;
  }

  while (fast?.next) {
    fast = fast.next;
    slow = slow?.next ?? null;
  }

  if (slow?.next) {
    slow.next = slow.next.next;
  }

  return sentinel.next;
}`,
    pitfalls: [
      '删除头节点时需要哨兵节点统一处理。',
      '快指针先走 n 步后，慢指针停在待删除节点的前驱位置。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'swap-nodes-in-pairs',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '两两交换链表中的节点',
    difficulty: '中等',
    tags: ['链表', '迭代', '指针调整'],
    summary: '用前驱节点串联每一对交换后的节点。',
    description:
      '给定单链表头节点，两两交换其中相邻节点，并返回交换后的头节点，不能只交换节点值。',
    approach:
      '哨兵节点指向头部，previous 始终指向当前待交换二元组的前驱。每轮重新连接 second、first 和下一段起点。',
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
 * 两两交换单链表中的相邻节点。
 */
function swapPairs(head: ListNode | null): ListNode | null {
  const sentinel = new ListNode(0, head);
  let previous = sentinel;

  while (previous.next?.next) {
    const first = previous.next;
    if (!first.next) {
      break;
    }
    const second = first.next;
    const nextPair = second.next;

    previous.next = second;
    second.next = first;
    first.next = nextPair;
    previous = first;
  }

  return sentinel.next;
}`,
    pitfalls: [
      '题目要求交换节点本身，不能只交换 value。',
      '保存 nextPair 后再改指针，避免丢失后续链表。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'reverse-nodes-in-k-group',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: 'K 个一组翻转链表',
    difficulty: '困难',
    tags: ['链表', '分组反转'],
    summary: '每次确认剩余节点足够 k 个，再反转当前分组并接回链表。',
    description:
      '给定单链表头节点，每 k 个节点一组进行翻转；不足 k 个的剩余节点保持原顺序。',
    approach:
      '用 groupPrevious 定位分组前驱，先向后数 k 个节点确认完整分组，再反转 [groupPrevious.next, groupNext) 区间并接回。',
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
 * 返回从起点向后第 k 个节点。
 */
function getKthNode(start: ListNode | null, k: number): ListNode | null {
  let current = start;

  for (let step = 0; step < k && current; step += 1) {
    current = current.next;
  }

  return current;
}

/**
 * 每 k 个节点一组反转单链表。
 */
function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  const sentinel = new ListNode(0, head);
  let groupPrevious: ListNode | null = sentinel;

  while (groupPrevious) {
    const kthNode = getKthNode(groupPrevious, k);

    if (!kthNode) {
      break;
    }

    const groupNext = kthNode.next;
    let previous: ListNode | null = groupNext;
    let current: ListNode | null = groupPrevious.next;

    while (current !== groupNext) {
      const next = current?.next ?? null;
      if (current) {
        current.next = previous;
      }
      previous = current;
      current = next;
    }

    const oldGroupHead: ListNode | null = groupPrevious.next;
    groupPrevious.next = kthNode;
    groupPrevious = oldGroupHead;
  }

  return sentinel.next;
}`,
    pitfalls: [
      '反转前必须先确认剩余节点不少于 k 个。',
      '反转区间的尾部应接回 groupNext，否则后续链表会断开。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    id: 'copy-list-with-random-pointer',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '随机链表的复制',
    difficulty: '中等',
    tags: ['链表', '哈希表', '深拷贝'],
    summary: '先为每个原节点创建副本，再补齐 next 和 random 指针。',
    description:
      '给定链表，每个节点除 next 外还有 random 指针指向任意节点或 null，返回该链表的深拷贝。',
    approach:
      '第一次遍历创建所有节点副本并存入 Map。第二次遍历根据原节点的 next 与 random 指针补齐副本节点的对应指针。',
    code: `class RandomNode {
  value: number;
  next: RandomNode | null;
  random: RandomNode | null;

  /** 创建一个带随机指针的链表节点。 */
  constructor(value: number) {
    this.value = value;
    this.next = null;
    this.random = null;
  }
}

/**
 * 深拷贝带随机指针的链表。
 */
function copyRandomList(head: RandomNode | null): RandomNode | null {
  const copiedByOriginal = new Map<RandomNode, RandomNode>();
  let current = head;

  while (current) {
    copiedByOriginal.set(current, new RandomNode(current.value));
    current = current.next;
  }

  current = head;

  while (current) {
    const copied = copiedByOriginal.get(current);

    if (copied) {
      copied.next = current.next ? copiedByOriginal.get(current.next) ?? null : null;
      copied.random = current.random
        ? copiedByOriginal.get(current.random) ?? null
        : null;
    }

    current = current.next;
  }

  return head ? copiedByOriginal.get(head) ?? null : null;
}`,
    pitfalls: [
      'random 指针可能指向尚未处理的节点，不能边遍历边只复制当前节点。',
      '深拷贝结果不能复用任何原链表节点引用。',
    ],
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    id: 'merge-k-sorted-lists',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '合并 K 个升序链表',
    difficulty: '困难',
    tags: ['链表', '分治', '归并'],
    summary: '用分治把 k 条链表两两合并，降低重复扫描成本。',
    description:
      '给定若干个升序链表，将它们合并成一条升序链表并返回头节点。',
    approach:
      '递归拆分链表数组，分别合并左右两半，再用双指针合并两条有序链表。整体相当于归并排序的合并过程。',
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
 * 合并两条升序单链表。
 */
function mergeTwoSortedLists(
  firstHead: ListNode | null,
  secondHead: ListNode | null,
): ListNode | null {
  const sentinel = new ListNode(0);
  let tail = sentinel;
  let first = firstHead;
  let second = secondHead;

  while (first && second) {
    if (first.value <= second.value) {
      tail.next = first;
      first = first.next;
    } else {
      tail.next = second;
      second = second.next;
    }
    tail = tail.next;
  }

  tail.next = first ?? second;
  return sentinel.next;
}

/**
 * 合并多条升序单链表。
 */
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  if (lists.length === 0) {
    return null;
  }

  /**
   * 合并闭区间内的多条链表。
   */
  function mergeRange(left: number, right: number): ListNode | null {
    if (left === right) {
      return lists[left];
    }

    const middle = Math.floor((left + right) / 2);
    return mergeTwoSortedLists(
      mergeRange(left, middle),
      mergeRange(middle + 1, right),
    );
  }

  return mergeRange(0, lists.length - 1);
}`,
    pitfalls: [
      '逐条合并在链表数量较多时会反复扫描已合并部分。',
      '空数组需要直接返回 null。',
    ],
    complexity: {
      time: 'O(n log k)',
      space: 'O(log k)',
    },
  },
  {
    id: 'lru-cache',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: 'LRU 缓存',
    difficulty: '中等',
    tags: ['链表', '哈希表', '设计'],
    summary: '哈希表定位节点，双向链表维护最近使用顺序。',
    description:
      '设计 LRUCache，支持 O(1) 时间的 get 和 put，并在容量超限时淘汰最久未使用的键。',
    approach:
      'Map 负责 key 到节点的定位，双向链表头部表示最近使用，尾部表示最久未使用。访问或写入后把节点移动到头部。',
    code: `class LruNode {
  key: number;
  value: number;
  previous: LruNode | null;
  next: LruNode | null;

  /** 创建一个双向链表节点。 */
  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
    this.previous = null;
    this.next = null;
  }
}

class LRUCache {
  private readonly capacity: number;
  private readonly nodeByKey = new Map<number, LruNode>();
  private readonly head = new LruNode(0, 0);
  private readonly tail = new LruNode(0, 0);

  /** 创建固定容量的 LRU 缓存。 */
  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.previous = this.head;
  }

  /** 读取缓存值，并将命中的节点移动到最近使用位置。 */
  get(key: number): number {
    const node = this.nodeByKey.get(key);

    if (!node) {
      return -1;
    }

    this.moveToHead(node);
    return node.value;
  }

  /** 写入缓存值，并在超出容量时淘汰最久未使用节点。 */
  put(key: number, value: number): void {
    const existing = this.nodeByKey.get(key);

    if (existing) {
      existing.value = value;
      this.moveToHead(existing);
      return;
    }

    const node = new LruNode(key, value);
    this.nodeByKey.set(key, node);
    this.addAfterHead(node);

    if (this.nodeByKey.size > this.capacity) {
      const leastUsed = this.tail.previous;

      if (leastUsed && leastUsed !== this.head) {
        this.removeNode(leastUsed);
        this.nodeByKey.delete(leastUsed.key);
      }
    }
  }

  /** 将节点移动到链表头部。 */
  private moveToHead(node: LruNode): void {
    this.removeNode(node);
    this.addAfterHead(node);
  }

  /** 将节点插入到头节点之后。 */
  private addAfterHead(node: LruNode): void {
    node.previous = this.head;
    node.next = this.head.next;

    if (this.head.next) {
      this.head.next.previous = node;
    }

    this.head.next = node;
  }

  /** 从双向链表中移除节点。 */
  private removeNode(node: LruNode): void {
    if (node.previous) {
      node.previous.next = node.next;
    }
    if (node.next) {
      node.next.previous = node.previous;
    }
  }
}`,
    pitfalls: [
      '更新已有 key 时也要移动到最近使用位置。',
      '淘汰节点时必须同时删除链表节点和 Map 中的 key。',
    ],
    complexity: {
      time: 'O(1)',
      space: 'O(capacity)',
    },
  },
] satisfies CatalogItem[];

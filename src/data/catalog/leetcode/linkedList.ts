import type { CatalogItem } from '../types';

export const linkedListItems = [
  {
    id: 'reverse-linked-list',
    domainId: 'leetcode',
    categoryId: 'linked-list',
    title: '反转链表',
    difficulty: '简单',
    tags: ['链表', '双指针', '迭代'],
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
] satisfies CatalogItem[];

import type { CatalogItem } from '../types';

const commonSourceDirectory =
  'https://github.com/kellywang1314/sourceCode/tree/master/webpack/src/js/common';

export const commonItems = [
  {
    id: 'call-apply-bind',
    domainId: 'javascript',
    categoryId: 'common',
    title: 'call、apply 与 bind',
    difficulty: '中等',
    tags: ['this', '函数', '手写实现'],
    summary: '通过 Reflect.apply 显式指定 this，并区分立即调用与延迟调用。',
    description:
      'call 和 apply 会立即执行函数，区别在参数形式；bind 返回绑定上下文和部分参数的新函数。',
    approach:
      '用 Reflect.apply 统一调用语义。bind 保存目标函数、上下文和预置参数，返回函数在真正调用时拼接剩余参数。',
    code: `/**
 * 使用独立参数并指定函数调用上下文。
 */
function callFunction<T, Args extends unknown[], Result>(
  callback: (this: T, ...args: Args) => Result,
  context: T,
  ...args: Args
): Result {
  return Reflect.apply(callback, context, args);
}

/**
 * 使用参数数组并指定函数调用上下文。
 */
function applyFunction<T, Args extends unknown[], Result>(
  callback: (this: T, ...args: Args) => Result,
  context: T,
  args: Args,
): Result {
  return Reflect.apply(callback, context, args);
}

/**
 * 返回绑定上下文和部分参数的新函数。
 */
function bindFunction<T, Prefix extends unknown[], Rest extends unknown[], Result>(
  callback: (this: T, ...args: [...Prefix, ...Rest]) => Result,
  context: T,
  ...prefix: Prefix
): (...rest: Rest) => Result {
  /** 使用绑定信息调用原函数。 */
  function boundFunction(...rest: Rest): Result {
    return Reflect.apply(callback, context, [...prefix, ...rest]);
  }

  return boundFunction;
}`,
    pitfalls: [
      '箭头函数没有自己的 this，call、apply、bind 无法改写其词法 this。',
      '完整 bind polyfill 还需要处理 new 调用时的原型和 this 规则。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/common/call.js',
  },
  {
    id: 'compose-functions',
    domainId: 'javascript',
    categoryId: 'common',
    title: '函数组合',
    difficulty: '简单',
    tags: ['函数式编程', 'compose', 'reduce'],
    summary: '将多个一元函数从右向左连接为一条数据处理流水线。',
    description:
      'compose 接收多个函数，前一个函数的输出成为左侧函数的输入，使复杂变换可以拆成可复用的小步骤。',
    approach:
      '返回一个新函数，从函数数组末尾开始依次处理初始值。pipe 与它相同，但执行方向从左向右。',
    code: `type UnaryFunction<T> = (value: T) => T;

/**
 * 将多个一元函数组合为从右向左执行的新函数。
 */
function composeFunctions<T>(
  ...functions: Array<UnaryFunction<T>>
): UnaryFunction<T> {
  /** 按组合顺序处理输入值。 */
  function composed(initialValue: T): T {
    let result = initialValue;

    for (let index = functions.length - 1; index >= 0; index -= 1) {
      result = functions[index](result);
    }

    return result;
  }

  return composed;
}`,
    pitfalls: [
      'compose 的执行方向通常是从右向左，不要与 pipe 混淆。',
      '简单泛型版本要求各函数输入输出类型一致，异构流水线需要更复杂的类型推导。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/common/compose%E5%87%BD%E6%95%B0.js',
  },
  {
    id: 'async-await-principle',
    domainId: 'javascript',
    categoryId: 'common',
    title: 'async/await 原理',
    difficulty: '困难',
    tags: ['async', 'await', 'Generator'],
    summary: 'async/await 可理解为 Generator 与自动执行器的语法封装。',
    description:
      'await 暂停当前 async 函数而不阻塞线程；等待值落定后，以成功值或异常继续执行后续逻辑。',
    approach:
      '用 Generator 表示可暂停流程，执行器读取每次 yield 的值并交给 Promise.resolve，再用 next 或 throw 恢复生成器。',
    code: `/**
 * 自动执行产出 Promise 的 Generator。
 */
function runGenerator<T>(
  createIterator: () => Generator<unknown, T, unknown>,
): Promise<T> {
  const iterator = createIterator();

  /** 推进生成器并吸收本轮产出的异步值。 */
  function advance(method: 'next' | 'throw', value?: unknown): Promise<T> {
    let result: IteratorResult<unknown, T>;

    try {
      result = iterator[method](value);
    } catch (error) {
      return Promise.reject(error);
    }

    if (result.done) {
      return Promise.resolve(result.value);
    }

    return Promise.resolve(result.value).then(
      resolved => advance('next', resolved),
      error => advance('throw', error),
    );
  }

  return advance('next');
}`,
    pitfalls: [
      'await 只暂停当前 async 函数，不会阻塞事件循环。',
      '拒绝结果必须通过 iterator.throw 注入，才能被生成器内部的 try/catch 捕获。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/common/async%E5%AE%9E%E7%8E%B0.js',
  },
  {
    id: 'iterator-protocol',
    domainId: 'javascript',
    categoryId: 'common',
    title: 'Iterator 迭代器协议',
    difficulty: '中等',
    tags: ['Iterator', 'Symbol.iterator', '协议'],
    summary: '可迭代对象通过 Symbol.iterator 按需提供统一序列接口。',
    description:
      'for...of、展开语法等能力依赖迭代器协议：可迭代对象返回带 next 方法的迭代器，next 返回 value 和 done。',
    approach:
      '对象实现 Symbol.iterator，每次调用创建独立游标；next 根据游标返回当前值并推进状态。',
    code: `interface NumberRange extends Iterable<number> {
  start: number;
  end: number;
}

/**
 * 创建一个包含首尾边界的可迭代数字区间。
 */
function createNumberRange(start: number, end: number): NumberRange {
  return {
    start,
    end,
    /** 为每次遍历创建独立迭代器。 */
    [Symbol.iterator](): Iterator<number> {
      let current = start;

      return {
        /** 返回当前值并推进游标。 */
        next(): IteratorResult<number> {
          if (current <= end) {
            const value = current;
            current += 1;
            return { value, done: false };
          }
          return { value: undefined, done: true };
        },
      };
    },
  };
}`,
    pitfalls: [
      'Symbol.iterator 应每次返回新迭代器，否则多次遍历会共享进度。',
      '迭代完成后 done 必须为 true，value 通常为 undefined。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/common/iterator.js',
  },
  {
    id: 'memoize-function',
    domainId: 'javascript',
    categoryId: 'common',
    title: '函数结果缓存',
    difficulty: '中等',
    tags: ['memoize', '缓存', '闭包'],
    summary: '按参数生成缓存键，复用纯函数已计算的结果。',
    description:
      'memoize 适合输入稳定且计算昂贵的纯函数，通过闭包保存参数到结果的映射，避免重复计算。',
    approach:
      '包装原函数，在调用时序列化参数作为 Map 键。命中缓存直接返回，否则执行、保存并返回结果。',
    code: `/**
 * 为同步纯函数添加基于参数序列化的结果缓存。
 */
function memoizeFunction<Args extends unknown[], Result>(
  callback: (...args: Args) => Result,
): (...args: Args) => Result {
  const cache = new Map<string, Result>();

  /** 返回缓存结果或执行原函数。 */
  function memoized(...args: Args): Result {
    const cacheKey = JSON.stringify(args);

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) as Result;
    }

    const result = callback(...args);
    cache.set(cacheKey, result);
    return result;
  }

  return memoized;
}`,
    pitfalls: [
      'JSON.stringify 无法可靠区分函数、Symbol、循环引用和部分对象键顺序。',
      '缓存没有淘汰策略会持续占用内存，长生命周期场景应限制容量。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/common/memoize.js',
  },
  {
    id: 'publish-subscribe',
    domainId: 'javascript',
    categoryId: 'common',
    title: '发布订阅模式',
    difficulty: '中等',
    tags: ['设计模式', '事件', '解耦'],
    summary: '发布者按事件名广播，订阅者无需感知彼此。',
    description:
      '发布订阅通过事件中心隔离消息生产者与消费者，适合一对多通知，但也增加了数据流追踪成本。',
    approach:
      'Map 保存事件名到监听器集合。订阅时加入集合并返回取消函数；发布时复制集合后依次调用，避免遍历期间修改。',
    code: `type EventListener<T> = (payload: T) => void;

class EventBus<EventMap extends Record<string, unknown>> {
  private listeners = new Map<keyof EventMap, Set<EventListener<unknown>>>();

  /** 订阅事件并返回取消订阅函数。 */
  subscribe<Key extends keyof EventMap>(
    eventName: Key,
    listener: EventListener<EventMap[Key]>,
  ): () => void {
    const listeners =
      this.listeners.get(eventName) ?? new Set<EventListener<unknown>>();
    listeners.add(listener as EventListener<unknown>);
    this.listeners.set(eventName, listeners);

    /** 移除本次注册的监听器。 */
    function unsubscribe(): void {
      listeners.delete(listener as EventListener<unknown>);
    }

    return unsubscribe;
  }

  /** 向当前事件的全部订阅者发布数据。 */
  publish<Key extends keyof EventMap>(
    eventName: Key,
    payload: EventMap[Key],
  ): void {
    const listeners = this.listeners.get(eventName);
    if (!listeners) return;

    [...listeners].forEach(listener => listener(payload));
  }
}`,
    pitfalls: [
      '组件销毁时应取消订阅，否则会造成内存泄漏和重复处理。',
      '发布时复制监听器集合，避免回调取消订阅导致遍历行为不稳定。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/common/%E5%8F%91%E5%B8%83-%E8%AE%A2%E9%98%85%E6%A8%A1%E5%BC%8F.js',
  },
  {
    id: 'type-detection',
    domainId: 'javascript',
    categoryId: 'common',
    title: 'JavaScript 类型判断',
    difficulty: '简单',
    tags: ['类型', 'Object.prototype.toString', '运行时'],
    summary: '结合 typeof 与对象标签获得稳定的运行时类型名称。',
    description:
      'typeof 对基本类型很方便，但 null、数组和普通对象都需要更精确的区分，可借助 Object.prototype.toString。',
    approach:
      '先处理 null，再对非 object 值返回 typeof；对象值读取内部标签并转为小写名称。',
    code: `/**
 * 返回值的稳定运行时类型名称。
 */
function getValueType(value: unknown): string {
  if (value === null) {
    return 'null';
  }

  if (typeof value !== 'object') {
    return typeof value;
  }

  return Object.prototype.toString
    .call(value)
    .slice(8, -1)
    .toLowerCase();
}`,
    pitfalls: [
      'typeof null 的历史结果是 object，必须单独判断。',
      '跨 iframe 使用 instanceof 可能失败，对象标签通常更稳定但仍可被 Symbol.toStringTag 影响。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/common/toString.js',
  },
  {
    id: 'function-currying',
    domainId: 'javascript',
    categoryId: 'common',
    title: '函数柯里化',
    difficulty: '中等',
    tags: ['函数式编程', '柯里化', '闭包'],
    summary: '把多参数调用转换为连续接收部分参数的函数。',
    description:
      '柯里化可以复用部分参数并提升组合能力；包装函数持续收集参数，达到原函数参数数量后执行。',
    approach:
      '保存目标函数 arity，每次调用合并已收集和新参数。数量足够时调用目标函数，否则返回继续收集的函数。',
    code: `type AnyFunction = (...args: unknown[]) => unknown;

/**
 * 将固定参数数量的函数转换为可分批传参的函数。
 */
function curryFunction(callback: AnyFunction): AnyFunction {
  /** 基于已收集参数创建下一层函数。 */
  function collectArguments(collected: unknown[]): AnyFunction {
    /** 合并新参数，并在数量足够时执行原函数。 */
    function curried(...nextArguments: unknown[]): unknown {
      const allArguments = [...collected, ...nextArguments];

      if (allArguments.length >= callback.length) {
        return callback(...allArguments);
      }

      return collectArguments(allArguments);
    }

    return curried;
  }

  return collectArguments([]);
}`,
    pitfalls: [
      '依赖 function.length 时，默认参数和剩余参数会改变可见参数数量。',
      '示例类型为了突出运行机制较宽泛，生产代码应为具体函数保留参数与返回类型。',
    ],
    sourceUrl: commonSourceDirectory,
  },
  {
    id: 'deep-clone',
    domainId: 'javascript',
    categoryId: 'common',
    title: '深拷贝',
    difficulty: '困难',
    tags: ['对象', '递归', 'WeakMap'],
    summary: '递归复制对象图，并用 WeakMap 处理循环引用。',
    description:
      '深拷贝需要为嵌套引用创建新对象，同时保留循环关系；不同内置类型还需要各自的复制策略。',
    approach:
      '基本类型直接返回；对象先查 WeakMap。创建数组、日期或普通对象后立即登记映射，再递归复制自有键。',
    code: `/**
 * 深度复制数组、日期和普通对象，并保留循环引用。
 */
function deepClone<T>(value: T, seen = new WeakMap<object, unknown>()): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  const existing = seen.get(value);
  if (existing) {
    return existing as T;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as T;
  }

  const clone: Record<PropertyKey, unknown> | unknown[] = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));
  seen.set(value, clone);

  for (const key of Reflect.ownKeys(value)) {
    clone[key as keyof typeof clone] = deepClone(
      value[key as keyof T],
      seen,
    );
  }

  return clone as T;
}`,
    pitfalls: [
      'JSON 序列化会丢失 undefined、Symbol、函数、原型和循环引用。',
      '完整实现还需单独处理 Map、Set、RegExp、属性描述符和不可复制的宿主对象。',
    ],
    sourceUrl: commonSourceDirectory,
  },
  {
    id: 'debounce-throttle',
    domainId: 'javascript',
    categoryId: 'common',
    title: '防抖与节流',
    difficulty: '中等',
    tags: ['防抖', '节流', '性能'],
    summary: '防抖等待操作停止，节流限制持续操作的执行频率。',
    description:
      '输入搜索常用防抖，只执行最后一次；滚动或拖拽常用节流，在连续触发期间按固定间隔执行。',
    approach:
      '防抖每次清除旧定时器并重新计时。节流记录上次执行时间，达到间隔才调用回调。',
    code: `/**
 * 返回仅在停止触发指定时间后执行的防抖函数。
 */
function debounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  /** 重置计时并保存最后一次调用参数。 */
  function debounced(...args: Args): void {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  }

  return debounced;
}

/**
 * 返回在固定时间窗口内最多执行一次的节流函数。
 */
function throttle<Args extends unknown[]>(
  callback: (...args: Args) => void,
  interval: number,
): (...args: Args) => void {
  let lastExecutedAt = Number.NEGATIVE_INFINITY;

  /** 在间隔满足时执行原回调。 */
  function throttled(...args: Args): void {
    const currentTime = Date.now();
    if (currentTime - lastExecutedAt >= interval) {
      lastExecutedAt = currentTime;
      callback(...args);
    }
  }

  return throttled;
}`,
    pitfalls: [
      '防抖和节流语义不同，应根据是否需要中间状态更新来选择。',
      '生产实现通常还要明确首调用、尾调用和取消未执行任务的行为。',
    ],
    sourceUrl: commonSourceDirectory,
  },
] satisfies CatalogItem[];

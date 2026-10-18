import type { CatalogItem } from '../types';

export const promiseItems = [
  {
    id: 'promise-core',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 核心实现',
    difficulty: '困难',
    tags: ['Promise', '状态机', '微任务'],
    summary: '用不可逆状态机和回调队列理解 Promise 的核心行为。',
    description:
      'Promise 将一个未来结果表示为 pending、fulfilled 或 rejected 三种状态，并允许多个订阅者注册后续处理。',
    approach:
      '实现时保存状态、结果和成功失败队列；首次 settle 后锁定状态。then 创建并返回新 Promise，通过微任务处理回调返回值与异常。',
    code: `type PromiseState = 'pending' | 'fulfilled' | 'rejected';

class SimplePromise<T> {
  private state: PromiseState = 'pending';
  private value!: T;
  private reason: unknown;
  private fulfilledCallbacks: Array<(value: T) => void> = [];
  private rejectedCallbacks: Array<(reason: unknown) => void> = [];

  /** 创建一个教学用途的简化 Promise。 */
  constructor(
    executor: (
      resolve: (value: T) => void,
      reject: (reason: unknown) => void,
    ) => void,
  ) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  /** 将 pending 状态更新为 fulfilled。 */
  private resolve = (value: T): void => {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    this.value = value;
    queueMicrotask(() => {
      this.fulfilledCallbacks.forEach(callback => callback(value));
    });
  };

  /** 将 pending 状态更新为 rejected。 */
  private reject = (reason: unknown): void => {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    this.reason = reason;
    queueMicrotask(() => {
      this.rejectedCallbacks.forEach(callback => callback(reason));
    });
  };

  /** 注册成功和失败处理函数。 */
  then(
    onFulfilled: (value: T) => void,
    onRejected: (reason: unknown) => void,
  ): void {
    if (this.state === 'fulfilled') {
      queueMicrotask(() => onFulfilled(this.value));
    } else if (this.state === 'rejected') {
      queueMicrotask(() => onRejected(this.reason));
    } else {
      this.fulfilledCallbacks.push(onFulfilled);
      this.rejectedCallbacks.push(onRejected);
    }
  }
}`,
    pitfalls: [
      '状态只能从 pending 转换一次，后续 resolve 或 reject 必须忽略。',
      '完整 Promise/A+ 实现还要处理 then 链式返回、thenable 吸收与循环引用。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promise.js',
  },
  {
    id: 'promise-all',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise.all',
    difficulty: '中等',
    tags: ['Promise', '并行', '聚合'],
    summary: '并行等待全部输入，并按原输入顺序组装结果。',
    description:
      'Promise.all 接收可迭代对象，所有输入成功时返回结果数组；任意一个失败时立即拒绝。',
    approach:
      '用 Promise.resolve 统一普通值和 Promise，以输入下标写入结果。成功计数等于总数时 resolve，失败直接交给 reject。',
    code: `/**
 * 并行等待全部输入并保持结果顺序。
 */
function promiseAll<T>(values: Array<T | PromiseLike<T>>): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (values.length === 0) {
      resolve([]);
      return;
    }

    const results: T[] = new Array(values.length);
    let completed = 0;

    values.forEach((value, index) => {
      Promise.resolve(value).then(result => {
        results[index] = result;
        completed += 1;
        if (completed === values.length) {
          resolve(results);
        }
      }, reject);
    });
  });
}`,
    pitfalls: [
      '结果顺序取决于输入顺序，不取决于完成顺序。',
      '空输入必须立即兑现为空数组。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promiseAll.js',
  },
  {
    id: 'promise-race',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise.race',
    difficulty: '简单',
    tags: ['Promise', '竞速', '超时'],
    summary: '第一个落定的输入决定最终状态和值。',
    description:
      'Promise.race 并行观察所有输入，无论成功还是失败，第一个落定的结果都会结束竞速。',
    approach:
      '遍历输入并用 Promise.resolve 标准化，每个输入都直接将成功和失败连接到外层 Promise。',
    code: `/**
 * 返回第一个落定输入的结果。
 */
function promiseRace<T>(
  values: Array<T | PromiseLike<T>>,
): Promise<Awaited<T>> {
  return new Promise((resolve, reject) => {
    for (const value of values) {
      Promise.resolve(value).then(resolve, reject);
    }
  });
}`,
    pitfalls: [
      'race 不会取消其余仍在运行的异步任务。',
      '空输入会永远保持 pending 状态。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promiseRace.js',
  },
  {
    id: 'promise-resolve',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise.resolve',
    difficulty: '中等',
    tags: ['Promise', 'thenable', '值吸收'],
    summary: '把普通值、Promise 和 thenable 统一为原生 Promise。',
    description:
      'Promise.resolve 对原生 Promise 可直接复用，对 thenable 会采用其最终状态，对普通值则创建已兑现 Promise。',
    approach:
      '先识别原生 Promise，再检查对象是否提供 then 方法；读取或调用 then 时产生的异常都应转为拒绝。',
    code: `/**
 * 将普通值或 thenable 转换为原生 Promise。
 */
function promiseResolve<T>(value: T | PromiseLike<T>): Promise<Awaited<T>> {
  if (value instanceof Promise) {
    return value as Promise<Awaited<T>>;
  }

  return new Promise((resolve, reject) => {
    if (
      value !== null &&
      (typeof value === 'object' || typeof value === 'function') &&
      typeof (value as PromiseLike<T>).then === 'function'
    ) {
      (value as PromiseLike<T>).then(
        result => resolve(result as Awaited<T>),
        reject,
      );
      return;
    }

    resolve(value as Awaited<T>);
  });
}`,
    pitfalls: [
      'thenable 不一定是 Promise 实例，但仍需要吸收其状态。',
      '健壮实现还需防止恶意 thenable 多次调用回调或读取 then 时抛错。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promiseResolve.js',
  },
  {
    id: 'promise-finally',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise.finally',
    difficulty: '中等',
    tags: ['Promise', '清理', '透传'],
    summary: '无论成功失败都执行清理，并透传原始结果。',
    description:
      'finally 用于关闭资源、隐藏 loading 等清理逻辑。回调通常不接收原结果，完成后继续传递之前的状态。',
    approach:
      '成功分支等待清理完成后返回原值；失败分支等待清理完成后重新抛出原错误。清理失败则覆盖原状态。',
    code: `/**
 * 为 Promise 添加兼容 finally 语义的清理步骤。
 */
function withFinally<T>(
  promise: Promise<T>,
  cleanup: () => void | PromiseLike<void>,
): Promise<T> {
  return promise.then(
    value => Promise.resolve(cleanup()).then(() => value),
    reason =>
      Promise.resolve(cleanup()).then(() => {
        throw reason;
      }),
  );
}`,
    pitfalls: [
      '清理完成后要透传原值或重新抛出原错误。',
      '若清理函数自身失败，最终 Promise 应使用新的失败原因。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promise.finally.js',
  },
  {
    id: 'promise-concurrency-limit',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 并发限制',
    difficulty: '困难',
    tags: ['Promise', '并发控制', '任务队列'],
    summary: '使用固定数量的 worker 消费共享任务下标。',
    description:
      '大量异步任务同时启动可能耗尽网络或服务端资源，需要限制任意时刻正在执行的任务数量。',
    approach:
      '创建不超过限制数的 worker。每个 worker 领取下一个任务并等待完成，再继续领取，结果仍按原任务下标保存。',
    code: `type AsyncTask<T> = () => Promise<T>;

/**
 * 在指定并发数内执行任务并保持结果顺序。
 */
async function runWithConcurrency<T>(
  tasks: AsyncTask<T>[],
  limit: number,
): Promise<T[]> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError('limit 必须是正整数');
  }

  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  /**
   * 持续领取并执行下一个尚未处理的任务。
   */
  async function runWorker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const taskIndex = nextIndex;
      nextIndex += 1;
      results[taskIndex] = await tasks[taskIndex]();
    }
  }

  const workerCount = Math.min(limit, tasks.length);
  const workers = Array.from({ length: workerCount }, runWorker);
  await Promise.all(workers);
  return results;
}`,
    pitfalls: [
      '任务必须延迟为函数，若提前创建 Promise 就无法限制启动时机。',
      '共享下标要在 await 前递增，避免多个 worker 领取同一任务。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/limitPromsie.js',
  },
  {
    id: 'promise-retry',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 失败重试',
    difficulty: '中等',
    tags: ['Promise', '重试', '容错'],
    summary: '失败后重新调用任务工厂，直到成功或耗尽重试次数。',
    description:
      '对短暂网络错误可有限重试。每次尝试都应重新执行任务，而不是重复等待同一个已拒绝 Promise。',
    approach:
      '用循环捕获失败，记录最后一次错误。允许总尝试次数为 retries+1，成功立即返回，耗尽后抛出最后错误。',
    code: `/**
 * 执行异步任务，并在失败后按上限重试。
 */
async function retryPromise<T>(
  task: () => Promise<T>,
  retries: number,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}`,
    pitfalls: [
      '重试次数通常不包含首次执行，总尝试次数是 retries+1。',
      '任务参数应是函数而不是已创建的 Promise，否则不会真正重新发起操作。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promise.reTry.js',
  },
  {
    id: 'promise-serial',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 串行执行',
    difficulty: '中等',
    tags: ['Promise', '串行', '任务队列'],
    summary: '逐个 await 任务，确保后一项在前一项完成后启动。',
    description:
      '当异步任务存在顺序依赖或需要严格控制压力时，应按数组顺序逐个执行并收集结果。',
    approach:
      '任务以函数形式保存，for...of 中逐个调用并 await。这样每个任务的创建时间就是前一个任务完成之后。',
    code: `type SerialTask<T> = () => Promise<T>;

/**
 * 按给定顺序串行执行全部异步任务。
 */
async function runSerially<T>(tasks: SerialTask<T>[]): Promise<T[]> {
  const results: T[] = [];

  for (const task of tasks) {
    results.push(await task());
  }

  return results;
}`,
    pitfalls: [
      '传入已启动的 Promise 数组无法获得真正的串行效果。',
      '默认行为是遇到首个失败就停止，若需继续执行应显式收集错误。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promsie%E4%B8%B2%E8%A1%8C.js',
  },
] satisfies CatalogItem[];

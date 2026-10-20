import type { CatalogItem } from '../types';

export const promiseItems = [
  {
    id: 'promise-core',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 核心实现',
    difficulty: '中等',
    tags: ['Promise', 'Promise 实现', '状态机', '微任务'],
    summary: '用不可逆状态机和回调队列理解 Promise 的核心行为。',
    description:
      'Promise 将一个未来结果表示为 pending、fulfilled 或 rejected 三种状态，并允许多个订阅者注册后续处理。',
    approach:
      '实现时保存状态、结果和成功失败队列；首次 settle 后锁定状态。then 创建新 Promise，并按 Promise/A+ 规则处理回调返回值、thenable、异常和循环引用。',
    code: `type PromiseState = 'pending' | 'fulfilled' | 'rejected';

class InterviewPromise<T> implements PromiseLike<T> {
  private state: PromiseState = 'pending';
  private isResolved = false;
  private value!: T;
  private reason: unknown;
  private fulfilledCallbacks: Array<() => void> = [];
  private rejectedCallbacks: Array<() => void> = [];

  /** 创建一个遵循核心 Promise/A+ 行为的教学实现。 */
  constructor(
    executor: (
      resolve: (value: T | PromiseLike<T>) => void,
      reject: (reason: unknown) => void,
    ) => void,
  ) {
    try {
      executor(this.resolve, this.reject);
    } catch (error) {
      this.reject(error);
    }
  }

  /** 锁定首次决议，并开始吸收普通值或 thenable。 */
  private resolve = (value: T | PromiseLike<T>): void => {
    if (this.state !== 'pending' || this.isResolved) return;
    this.isResolved = true;
    this.resolveValue(value);
  };

  /** 递归吸收已锁定决议中的普通值或 thenable。 */
  private resolveValue = (value: T | PromiseLike<T>): void => {
    if (this.state !== 'pending') return;
    if (value === this) {
      this.rejectResolved(new TypeError('Promise 不能解析自身'));
      return;
    }

    if (
      value !== null &&
      (typeof value === 'object' || typeof value === 'function')
    ) {
      let then: unknown;

      try {
        then = (value as { then?: unknown }).then;
      } catch (error) {
        this.rejectResolved(error);
        return;
      }

      if (typeof then === 'function') {
        let called = false;

        try {
          then.call(
            value,
            (nextValue: T | PromiseLike<T>) => {
              if (called) return;
              called = true;
              this.resolveValue(nextValue);
            },
            (reason: unknown) => {
              if (called) return;
              called = true;
              this.rejectResolved(reason);
            },
          );
        } catch (error) {
          if (!called) {
            called = true;
            this.rejectResolved(error);
          }
        }
        return;
      }
    }

    this.state = 'fulfilled';
    this.value = value as T;
    this.fulfilledCallbacks.forEach(callback => callback());
  };

  /** 将 pending 状态更新为 rejected。 */
  private reject = (reason: unknown): void => {
    if (this.state !== 'pending' || this.isResolved) return;
    this.isResolved = true;
    this.rejectResolved(reason);
  };

  /** 使用已锁定决议中的失败原因更新状态。 */
  private rejectResolved = (reason: unknown): void => {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    this.reason = reason;
    this.rejectedCallbacks.forEach(callback => callback());
  };

  /** 注册处理函数并返回支持链式调用的新 Promise。 */
  then<TResult1 = T, TResult2 = never>(
    onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onRejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): InterviewPromise<TResult1 | TResult2> {
    let chainedPromise!: InterviewPromise<TResult1 | TResult2>;

    chainedPromise = new InterviewPromise<TResult1 | TResult2>(
      (resolve, reject) => {
        /** 在微任务中执行成功回调并解析返回值。 */
        const handleFulfilled = (): void => {
          queueMicrotask(() => {
            try {
              const result = onFulfilled
                ? onFulfilled(this.value)
                : (this.value as unknown as TResult1);
              resolvePromiseResult(
                chainedPromise,
                result,
                resolve,
                reject,
              );
            } catch (error) {
              reject(error);
            }
          });
        };

        /** 在微任务中执行失败回调并解析返回值。 */
        const handleRejected = (): void => {
          queueMicrotask(() => {
            try {
              if (!onRejected) {
                reject(this.reason);
                return;
              }

              resolvePromiseResult(
                chainedPromise,
                onRejected(this.reason),
                resolve,
                reject,
              );
            } catch (error) {
              reject(error);
            }
          });
        };

        if (this.state === 'fulfilled') {
          handleFulfilled();
        } else if (this.state === 'rejected') {
          handleRejected();
        } else {
          this.fulfilledCallbacks.push(handleFulfilled);
          this.rejectedCallbacks.push(handleRejected);
        }
      },
    );

    return chainedPromise;
  }
}

/**
 * 按 Promise/A+ 规则吸收回调返回值，并拒绝链式循环引用。
 */
function resolvePromiseResult<T>(
  promise: InterviewPromise<T>,
  result: unknown,
  resolve: (value: T | PromiseLike<T>) => void,
  reject: (reason: unknown) => void,
): void {
  if (promise === result) {
    reject(new TypeError('检测到 Promise 链式循环引用'));
    return;
  }

  if (
    result !== null &&
    (typeof result === 'object' || typeof result === 'function')
  ) {
    let then: unknown;

    try {
      then = (result as { then?: unknown }).then;
    } catch (error) {
      reject(error);
      return;
    }

    if (typeof then === 'function') {
      let called = false;

      try {
        then.call(
          result,
          (nextResult: unknown) => {
            if (called) return;
            called = true;
            resolvePromiseResult(promise, nextResult, resolve, reject);
          },
          (reason: unknown) => {
            if (called) return;
            called = true;
            reject(reason);
          },
        );
      } catch (error) {
        if (!called) {
          called = true;
          reject(error);
        }
      }
      return;
    }
  }

  resolve(result as T);
}`,
    pitfalls: [
      '状态只能从 pending 转换一次，后续 resolve 或 reject 必须忽略。',
      'thenable 的 then 读取和执行都可能抛错，并且成功、失败回调只能采用首次调用。',
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
    id: 'promise-image-loader',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 图片加载',
    difficulty: '简单',
    tags: ['Promise', '图片加载', '事件封装'],
    summary: '把图片的 load 和 error 事件封装成可组合的 Promise。',
    description:
      '图片加载是把事件回调改造成 Promise 的典型场景，成功时返回图片元素，失败时提供明确错误。',
    approach:
      '创建 Image 实例后先注册 onload 和 onerror，再设置 src 启动请求。调用方可以通过 await 获取已加载图片。',
    code: `/**
 * 加载图片并在成功时返回 HTMLImageElement。
 */
function loadImage(sourceUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => {
      reject(new Error(\`图片加载失败: \${sourceUrl}\`));
    };
    image.src = sourceUrl;
  });
}`,
    pitfalls: [
      '必须在设置 src 前注册事件，避免缓存命中时错过加载事件。',
      '失败分支应 reject 明确错误，否则调用方难以定位资源地址。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/onLoadIamge.js',
  },
  {
    id: 'promise-timer-sequence',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 定时器串行输出',
    difficulty: '简单',
    tags: ['Promise', 'setTimeout', '串行'],
    summary: '把定时器封装成 Promise，按固定间隔逐个输出数字。',
    description:
      '考察 setTimeout、闭包与 async/await。直接在循环中同时创建定时器会并行计时，而逐个 await 才是串行等待。',
    approach:
      '先用 delay 把一次等待封装成 Promise，再在 for...of 循环中逐项 await，确保后一项在前一项输出后才开始计时。',
    code: `/**
 * 等待指定毫秒数后完成。
 */
function delay(durationMs: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, durationMs);
  });
}

/**
 * 按固定间隔串行输出数字。
 */
async function printNumbersSerially(
  values: number[],
  intervalMs: number,
  onPrint: (value: number) => void,
): Promise<void> {
  for (const value of values) {
    await delay(intervalMs);
    onPrint(value);
  }
}`,
    pitfalls: [
      '用 var 声明循环变量会让多个回调共享同一个绑定，应使用 let、const 或显式闭包。',
      '先 map 出 Promise 数组会同时启动全部定时器，不能得到逐项串行效果。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/setTimeout.js',
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
    difficulty: '中等',
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
  {
    id: 'promise-ajax',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 封装 Ajax',
    difficulty: '中等',
    tags: ['Promise', 'Ajax', 'XMLHttpRequest'],
    summary: '把 XMLHttpRequest 的成功、失败和超时事件统一为 Promise。',
    description:
      '用 Promise 封装 Ajax 可以把事件式异步流程转换为 then 或 async/await，同时集中处理状态码、网络错误和超时。',
    approach:
      '创建 XMLHttpRequest 后配置请求方法、请求头和超时。2xx 或 304 时 resolve，HTTP 异常、网络错误和超时分别 reject。',
    code: `interface AjaxOptions {
  method?: string;
  body?: Document | XMLHttpRequestBodyInit | null;
  headers?: Record<string, string>;
  timeoutMs?: number;
}

/**
 * 用 Promise 封装 XMLHttpRequest。
 */
function requestWithPromise(
  url: string,
  options: AjaxOptions = {},
): Promise<XMLHttpRequest> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(options.method ?? 'GET', url);
    request.timeout = options.timeoutMs ?? 0;

    Object.entries(options.headers ?? {}).forEach(([name, value]) => {
      request.setRequestHeader(name, value);
    });

    request.onload = () => {
      if (
        (request.status >= 200 && request.status < 300) ||
        request.status === 304
      ) {
        resolve(request);
        return;
      }

      reject(new Error(\`请求失败: HTTP \${request.status}\`));
    };
    request.onerror = () => reject(new Error('网络连接失败'));
    request.ontimeout = () => reject(new Error('请求超时'));
    request.send(options.body ?? null);
  });
}`,
    pitfalls: [
      'onload 只表示收到响应，仍需检查 HTTP 状态码。',
      '网络错误和超时不会进入正常状态码分支，必须分别监听并 reject。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promsieAjax.js',
  },
  {
    id: 'promise-output-order',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 输出顺序',
    difficulty: '中等',
    tags: ['Promise', '事件循环', '微任务'],
    summary: '按同步任务、微任务、宏任务的优先级判断代码输出顺序。',
    description:
      'Promise executor 会同步执行，then 回调进入微任务队列，setTimeout 回调进入宏任务队列。当前同步栈结束后先清空微任务。',
    approach:
      '先标记全部同步输出，再处理 Promise.then 等微任务，最后进入下一轮事件循环执行 setTimeout 等宏任务。',
    code: `/**
 * 返回经典 Promise 面试题的预期输出顺序。
 */
function getPromiseOutputOrder(): string[] {
  return [
    'script start',
    'promise executor',
    'script end',
    'promise then',
    'setTimeout',
  ];
}`,
    pitfalls: [
      'new Promise 的 executor 是同步调用，不会等到 then 阶段才执行。',
      '微任务会在当前同步代码结束后、下一个宏任务开始前全部清空。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/promsie%E8%BE%93%E5%87%BA%E9%9D%A2%E8%AF%95%E9%A2%98.js',
  },
  {
    id: 'promise-traffic-light',
    domainId: 'javascript',
    categoryId: 'promise',
    title: 'Promise 红绿灯',
    difficulty: '中等',
    tags: ['Promise', '红绿灯', '异步循环'],
    summary: '用任务序列依次等待并切换红、绿、黄灯。',
    description:
      '红绿灯题考察如何把延迟任务组合成有明确顺序的异步流程，以及如何把单轮执行与持续循环解耦。',
    approach:
      '把颜色和持续时间建模为步骤数组。单轮函数逐项通知颜色并等待；持续运行时由调用方控制循环次数或停止信号。',
    code: `interface TrafficLightStep {
  color: string;
  durationMs: number;
}

/**
 * 等待当前灯光持续时间。
 */
function waitForTrafficLight(durationMs: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, durationMs);
  });
}

/**
 * 按顺序执行一轮红绿灯任务。
 */
async function runTrafficLightCycle(
  steps: TrafficLightStep[],
  onChange: (color: string) => void,
): Promise<void> {
  for (const step of steps) {
    onChange(step.color);
    await waitForTrafficLight(step.durationMs);
  }
}`,
    pitfalls: [
      '不要用无法停止的递归直接启动永久循环，应把单轮流程暴露给调用方控制。',
      '步骤必须逐项 await；同时创建全部延迟 Promise 会破坏灯光顺序。',
    ],
    sourceUrl:
      'https://github.com/kellywang1314/sourceCode/blob/master/webpack/src/js/promise/red-green-yellow.js',
  },
] satisfies CatalogItem[];

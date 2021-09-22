
let callbacks = []
let waiting = false

function flushCallbacks() {
  for (let index = 0; index < callbacks.length; index++) {
    const callback = callbacks[index];
    callback()
  }
  waiting = false
  callbacks = []
}

// 批处理 第一次开定时器, 后续只更新列表
// 第一次cb是渲染watcher更新操作
// 第二次cb 用户传入回调

export function nextTick(cb) {
  callbacks.push(cb)

  if (!waiting) {
    waiting = true

    // 兼容性优先顺序
    // 1.promise
    // 2.mutationObserver
    // 3.setImmdiate
    // 4.setTimeout
    Promise.resolve().then(flushCallbacks)
  }
}

export const isObject = (val) => typeof val == 'object' && val !== null

export function mergeOptions(parent, child) {
  const options = {}

  for (const key in parent) {
    if (Object.hasOwnProperty.call(parent, key)) {
      mergeFieId(key)
    }
  }
  return options
}

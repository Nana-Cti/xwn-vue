
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

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]

const strats = {}

function mergeHook(parentVal, childVal) {
  // 变成数组
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal)
    } else {
      return [childVal]
    }
  } else {
    return parentVal
  }
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

export function mergeOptions(parent, child) {
  const options = {}

  function mergeFieId(key) {
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
      return
    }

    if (isObject(parent[key]) && isObject(child[key])) {
      options[key] = {...parent[key], ...child[key]}
    } else {
      if (child[key]) {
        options[key] = child[key]
      } else {
        options[key] = parent[key]
      }
    }
  }

  for (const key in parent) {
    if (Object.hasOwnProperty.call(parent, key)) {
      mergeFieId(key)
    }
  }
  for (const key in child) {
    if (!Object.hasOwnProperty.call(parent, key)) {
      mergeFieId(key)
    }
  }
  return options
}

import { arrayMethohs } from "./array"
import Dep from "./dep"


class Observe {
  constructor(value) {
    // 给对象或数组加的dep
    this.dep = new Dep()
    Object.defineProperty(value, '__ob__', {
      value: this,
      enumerable:false, // 不能枚举
      configurable: false // 不能删除
    })
    if (Array.isArray(value)) {
      // push shift reverse sort
      value.__proto__ = arrayMethohs

      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  observeArray(value) {
    for (let index = 0; index < value.length; index++) {
      observe(value[index])
    }
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}

export function defineReactive(data, key, value) {
  let childOb = observe(value)
  // 给属性的dep
  let dep = new Dep()
  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend()

        if (childOb) {
          childOb.dep.depend()
        }
      }
      
      return value
    },
    set(newValue) {
      if (newValue === value) return
      observe(newValue)
      value = newValue
      dep.notify() // 通知dep执行
    }
  })
}

export function observe(data) {
  if (typeof data !== 'object' || data === null) {
    return
  }

  if (data.__ob__) {
    return
  }
  return new Observe(data)
}
import { mergeOptions } from "../util"

export function initGlobalAPI(Vue) {
  Vue.options = {}
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin)
    return this
  }

  Vue.options._base = Vue
  Vue.options.components = {} // 用来存放组件的定义
  Vue.component = function (id, definition) {
    definition.name = definition.name ?? id
    definition = this.options._base.extend(definition)

    this.options.components[id] = definition
  }

  Vue.extend = function(options) {
    const Super = this
    const Sub = function VueComponent(options) {
      this._init()
    }
    // Object.create(Super.prototype) 创建了一个Vue构造函数
    // Sub.prototype = Vue 实现继承
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
  }
}
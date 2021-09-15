import { createElement, createTextVnode } from "./vdom/index"

export function renderMixin(Vue) {

  // 创建元素的虚拟节点
  Vue.prototype._c = function(...args) {
    return createElement(this, ...args)
  }

  // 创建文本的虚拟节点
  Vue.prototype._v = function(text) {
    return createTextVnode(this, text)
  }

  // 转化成字符串
  Vue.prototype._s = function(val) {
    return val == null ? '' : (typeof val == 'object') ? JSON.stringify(val) : val
  }

  Vue.prototype._render = function () {
    const vm = this
    // 获得编译后的render方法
    let render = vm.$options.render

    // 调用render方法产生虚拟节点
    let vnode = render.call(vm)
    return vnode
  }
}
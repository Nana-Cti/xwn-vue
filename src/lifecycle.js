import Watcher from "./observe/watcher";
import { patch } from "./vdom/patch";

export function lifycycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    // 将虚拟节点转成真实dom

    const vm = this

    // 首次渲染 需要用虚拟节点来更新真实的dom
    // 初始化渲染的时候 会创建一个新节点并且将老节点换掉
    vm.$options.$el = patch(vm.$options.$el, vnode)

    
    
  }
  
}

export function mountComponent(vm, el) {
  // 默认vue是通过watcher来进行渲染 = 渲染watcher (每一个组件都有一个渲染watcher)


  // pushTarget
  let updateComponent = () => {
    vm._update(vm._render()) // 虚拟节点
  }
  // popTarget

  new Watcher(vm, updateComponent, () => {

  }, true)
}
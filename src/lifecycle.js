import Watcher from "./observe/watcher";

export function lifycycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    console.log('_update')
  }
  
}

export function mountComponent(vm, el) {
  // 默认vue是通过watcher来进行渲染 = 渲染watcher (每一个组件都有一个渲染watcher)


  let updateComponent = () => {
    vm._update(vm._render()) // 虚拟节点
  }
  new Watcher(vm, updateComponent, () => {

  }, true)
}
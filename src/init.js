import { compileToFunctions } from "./compiler/index"
import { callHook, mountComponent } from "./lifecycle"
import { initState } from "./state"
import { mergeOptions, nextTick } from "./util"


export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(vm.constructor.options, options)
    
    callHook(vm, 'beforeCreate')
    initState(vm)
    callHook(vm, 'created')

    if (vm.$options.el) {
      // 数据可以挂载到页面上
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$nextTick = nextTick

  Vue.prototype.$mount = function (el) {
    el = document.querySelector(el)
    const vm = this
    const options = vm.$options
    vm.$options.$el = el

    // 如果有render 就直接使用render
    // 没有render 看有没有template属性
    // 没有template 就接着找外部模板

    if (!options.render) {
      let template = options.template
      if (!template && el) {
        template = el.outerHTML
      }
      const render = compileToFunctions(template)
      options.render = render
    }

    mountComponent(vm, el); // 组件挂载
  }
}


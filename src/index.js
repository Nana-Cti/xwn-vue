
import { initMixin } from './init'
import { lifycycleMixin } from './lifecycle'
import { renderMixin } from './render'
function Vue(options) {
  this._init(options)
}

initMixin(Vue)
lifycycleMixin(Vue) // 扩展_update方法
renderMixin(Vue) // 扩展_render方法

export default Vue
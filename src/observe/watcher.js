import { popTarget, pushTarget } from "./dep"
import { queueWatcher } from "./schedular"

let id = 0
class Watcher {
  constructor(vm, fn, cb, option) {
    this.vm = vm
    this.cb = cb
    this.option = option
    this.id = id ++
    this.getter = fn
    this.deps = []
    this.depsId = new Set()
    
    this.get()
  }

  get() {
    pushTarget(this)
    this.getter()
    popTarget(this)
  }

  addDep(dep) {
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.depsId.add(id)
      this.deps.push(dep)
      dep.addSub(this)
    }
  }

  run() {
    this.get()
  }

  update() {
    queueWatcher(this)
  }

}



export default Watcher
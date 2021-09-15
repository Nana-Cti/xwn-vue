
let id = 0
class Watcher {
  constructor(vm, fn, cb, option) {
    this.vm = vm
    this.fn = fn
    this.cb = cb
    this.option = option
    this.id = id ++
    this.fn()
  }
}

export default Watcher
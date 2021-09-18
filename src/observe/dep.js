// 我们可以把当前的watcher 放在一个全局变量上

let id = 0
class Dep {
  constructor() {
    this.id = id++
    this.subs = []
    
  }
  depend() {
    // 让watcher记住dep
    Dep.target.addDep(this)
  }

  addSub(watcher) {
    this.subs.push(watcher)
  }
}

Dep.target = null

export function pushTarget(watcher) {
  Dep.target = watcher
}
export function popTarget() {
  Dep.target = null
}

export default Dep
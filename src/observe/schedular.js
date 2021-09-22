import { nextTick } from "../util";

let has = {}
let queue = []
let padding = false

function flushSchedularQueue() {
  for (let index = 0; index < queue.length; index++) {
    const Watcher = queue[index];
    Watcher.run()
  }

  queue = []
  has = {}
  padding = false
}

export function queueWatcher(Watcher) {
  // 更新时对Watcher进行去重
  let id = Watcher.id
  if (has[id] === undefined) {
    queue.push(Watcher)
    has[id] = true

    if (!padding) {
      padding = true
      nextTick(flushSchedularQueue);
    }
  }
}

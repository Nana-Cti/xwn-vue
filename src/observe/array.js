
let oldArrayPrototype = Array.prototype

export let arrayMethohs = Object.create(Array.prototype)

let methodes = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'reverse',
  'sort'
]

methodes.forEach(methode => {
  arrayMethohs[methode] = function(...args) {
    let inserted
    switch (methode) {
      case 'push':
        inserted = args
        break;
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
    }

    if (inserted) {
      this.__ob__.observeArray(inserted)
    }

    let result = oldArrayPrototype[methode].call(this, ...args)
    return result
  }
})
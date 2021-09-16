export function patch(oldVnode, vnode) {
  // oldVnode 是一个真实元素o

  const isRealElement = oldVnode.nodeType

  if (isRealElement) {
    // 初次渲染
    const oldElm = oldVnode
    const parentElm = oldElm.parentNode

    let el = createElm(vnode)// 根据虚拟节点创建真实的节点
    parentElm.insertBefore(el, oldElm.nextSibling)// 将创建的节点插到原有节点的下一个
    parentElm.removeChild(oldElm)

    return el

  } else {
    // diff算法
  }
  

}

function createElm(vnode) {
  let { tag, children, key, data, text, vm } = vnode

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)

    updateProperties(vnode)

    // 如果有儿子节点就递归
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

function updateProperties(vnode) {
  let newProps = vnode.data || {} // 属性
  let el = vnode.el // dom 元素

  for (const key in newProps) {
    if (newProps.hasOwnProperty.call(newProps, key)) {
      if (key === 'style') {
        for (const styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName]
        }
      } else if(key === 'class'){
        el.className = newProps.class
      } else {
        el.setAttribute(key, newProps[key])
      }
    }
  }
}
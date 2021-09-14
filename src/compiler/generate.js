/**
 * 匹配大括号{{}}
 */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


function genPros(attrs) {
  let str = ''

  for (let index = 0; index < attrs.length; index++) {
    const attr = attrs[index];
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':')
        obj[key] = value
      });
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`

  }

  return `{${str.slice(0, -1)}}`

}

function genChildren(el) {
  const children = el.children
  if (children) {
    return children.map(child => gen(child)).join(',')
  }
}

function gen(node) {
  if (node.type === 1) {
    return generate(node)
  } else {
    let text = node.text
    if (defaultTagRE.test(text)) {
      let tokens = []
      let match
      let index
      let lastIndex = defaultTagRE.lastIndex = 0
      while(match = defaultTagRE.exec(text)) {
        index = match.index
        if (index > lastIndex) {
          // 普通文本
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }

        // {{}}中的变量
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }

      // 最后那段普通文本
      if(lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }

      return `_v(${tokens.join('+')})`

    } else {
      return `_v(${JSON.stringify(text)})`
    }

  }
}


/**
 * 转换成render代码
 * 字符串拼接
 * 
*/
export function generate(el) {

  let children = genChildren(el)

  let code = `_c('${el.tag}', ${
    el.attrs.length ? genPros(el.attrs) : undefined
  }${
    children ? (',' + children) : ''
  })`

  return code
}
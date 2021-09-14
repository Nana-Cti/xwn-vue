const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  // aa-aa 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; // aa:aa 可能包含冒号
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >


function createASTElement(tag, attrs) {
  // vue3中支持多个根元素 (在最外层加了个根元素)
  return {
    tag,
    type: 1,
    children: [],
    attrs,
    parent: null
  }
}

let root = null
let stack = []
let currentParent

export function parseHtml(html) {
  // 生成ast语法书
  // 开始
  function start(tagName, arrts) {
    let element = createASTElement(tagName, arrts)
    if (!root) {
      root = element
    }
    stack.push(element)
  }

  // 闭合
  function end(tagName) {
    /** 标签结束 */
    let element = stack.pop()
    currentParent = stack[stack.length - 1]
    if (currentParent) {
      element.parent = currentParent
      currentParent.children.push(element)
    }
    if (tagName !== element.tag) {
      throw new Error('标签闭合有误')
    }
  }

  // 文本
  function chars(text) {
    text = text.replace(/\s/g, '')
    let parent = stack[stack.length - 1];
    
    if (text) {
      parent.children.push({
        type: 3,
        text
      })
    }
  }

  // 边解析边删除已经解析的
  function advance(n) {
    html = html.substring(n)
  }

  function paresStartTag () {
    // 解析开始标签
    const start = html.match(startTagOpen)
    if (start) {
      let match = {
        tagName: start[1],
        attrs: []
      }
      advance(start[0].length)

      // 属性
      let end, attr;
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] || true
        })
      }

      if (end) {
        advance(end[0].length)

        return match
      }

    }
  }
  while(html) {
    let textEnd = html.indexOf('<')

    // 解析标签
    if (textEnd === 0) {
      let startTagMatch = paresStartTag(html)
      if(startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if(endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue
      }
    }

    // 没有标签, 解析文本
    let text
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    
    if (text) {
      chars(text)
      advance(text.length)
    }

  }

  return root
}
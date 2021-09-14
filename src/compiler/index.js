import { generate } from "./generate"
import { parseHtml } from "./parse"


export function compileToFunctions (template) {
  let ast = parseHtml(template)
  let code = generate(ast)

  let render = `with(this){return ${code}}`

  let fn = new Function(render)

  return fn
}
import nggt from '../../../nggt/nggt.js'
import Sprite from '../sprite.js'

import Join from '../layout/join.js'

export default (options, ...template) => {
  //options: id, classList, clickable, rect
  let el = 'div'
  let styles = []
  let classList = options.classList || []
  classList.push('sprite')
  let id = options.id ? `game="${options.id}" id="${options.id}" ` : ''
  
  if(options.clickable)
    el = 'button'
  
  if(options.rect){
    let r = options.rect ? jngl.Rect.style(options.rect) : {}
    if(r.y)
      styles.push(`top:${r.y};`)
    if(r.x)
      styles.push(`left:${r.x};`)
    if(r.w)
      styles.push(`width:${r.w};`)
    if(r.h)
      styles.push(`height:${r.h};`)
  }

  styles = styles.length > 0 ? ` style="${Join(...styles)}"` : ''
  classList = `class="${classList.join(' ')}"`

  options.template = template
  Sprite.register(options)

  return `
    <${el} ${id}${classList}${styles}>
      ${Join(...template)}
    </${el}>
  `
}
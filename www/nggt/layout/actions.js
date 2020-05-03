import nggt from '../nggt.js'
const

Auto = (template, auto) => nggt.create({template, auto}),

Btn = (classlist, inner, fn) => nggt.create({
  template: `<button type="button" class="${classlist.join(' ')}" id="btn">${inner}</button>`,
  run: ui => ui.btn ? ui.btn.addEventListener('click', e => fn(e)) : null
}),

BtnAuto = (classlist, inner, fn) => nggt.create({
  template: `<button type="button" class="${classlist.join(' ')}" id="btn">${inner}</button>`,
  auto: ui => ui.btn ? ui.btn.addEventListener('click', e => fn(e)) : null
}),

Clickable = (el, classlist, inner, fn) => nggt.create({
  template: `<${el} class="${classlist.join(' ')}" id="clickable">${inner}</${el}>`,
  run: ui => ui.clickable.addEventListener('click', e => fn(e))
}),

Link = (classlist, href, ...e) => `<a href="${href}" class="${classlist.join(' ')}">${e.join('')}</a>`

export default { Auto, Btn, BtnAuto, Clickable, Link }
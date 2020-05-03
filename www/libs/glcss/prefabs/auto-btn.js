import Layout from './layout.js'

export default (classlist, inner, fn) => Layout.Auto(
  `<button type="button" class="${classlist.join(' ')}" id="btn">${inner}</button>`,
  ui => ui.btn ? ui.btn.addEventListener('click', e => fn(e)) : null
)
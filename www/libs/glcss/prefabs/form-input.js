import nggt from '../../../nggt/nggt.js'
import Layout from './layout.js'

export default (label, attrs, dataObj) => {
  let sub
  return nggt.create({
    template: Layout.Container('label', ['gl-label'],
      Layout.El('span', label),
      `<input id="input">`
    ),
    auto: ui => {
      Object.keys(attrs).forEach(attr => ui.input.setAttribute(attr, attrs[attr]))
      ui.input.addEventListener('change', () => dataObj.change(ui.input.value))
      sub = dataObj.onChange(val => ui.input.value = val)
    },
    cleanup: () => sub.cleanup()
  })
}
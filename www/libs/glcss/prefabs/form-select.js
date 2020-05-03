import nggt from '../../../nggt/nggt.js'
import Layout from './layout.js'

export default (label, options, dataObj, onchange) => {
  let sub
  return nggt.create({
    template: Layout.Container('label', ['gl-label'], 
      Layout.If(() => label, Layout.El('span', label)),
      Layout.Id('select', 'select', [],
        Layout.Map(options, o => Layout.El('option', o))
      )
    ),
    auto: ui => {
      sub = dataObj.onChange(o => {
        if(ui.select.value !== o){
          if(typeof o === 'object' && o.name)
            ui.select.value = o.name
          else
            ui.select.value = o
        }
      })
      ui.select.addEventListener('change', e => {
        if(e.target.value !== dataObj.val()){
          if(onchange) dataObj.change(onchange(e.target.value))
          else dataObj.change(e.target.value)
        }
      })
    },
    cleanup: () => sub.cleanup()
  })
}
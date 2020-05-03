import nggt from '../nggt.js'
import core from './core.js'

const

Bold = (...args) => core.El('strong', ...args),

Col = (i, comp) => core.Container('div', ['d'+i], comp),

ColGrid = (...args) => {
  let sizes = args.slice(0, args.length / 2),
      comps = args.slice(args.length / 2)

  return core.Container('div', ['drow'], 
    ...comps.map((comp, i) => Col(sizes[i], comp))
  )
},

DataObj = (dataObj, fn) => {
  let sub
  return nggt.create({
    template: core.Id('div', 'container', [], fn(dataObj.val())),
    auto: ui => sub = dataObj.onChange(v => ui.container.innerHTML = fn(v)),
    cleanup: () => sub ? sub.cleanup() : null
  })
},

List = (el, ...args) => core.El(el,
  ...(args.map(html => core.El('li', html)))
),

Tab = (id, ...el) => core.Id('div', id, ['hidden'], ...el),

Tabs = (dataObj, ...tabs) => {
  let sub
  return nggt.create({
    template: core.El('div', ...tabs),
    auto: ui => sub = dataObj.onChange(t => {
      if(ui[t]){
        Object.values(ui).forEach(tab => tab.classList.add('hidden'))
        ui[t].classList.remove('hidden')
      }
    }),
    cleanup: () => sub.cleanup()
  })
},

Cap = s => s.substr(0, 1).toUpperCase() + s.substr(1)

// Header = (...e) => nggt.create({
//   template: core.Id('h1', 'h', [], ...e),
//   run: 
// })

export default { Bold, Col, ColGrid, DataObj, List, Tab, Tabs, Cap }
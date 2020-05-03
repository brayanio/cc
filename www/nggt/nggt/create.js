import CorePipe from './pipes/core.js'

const guid = (r, v) =>
  'nggtyyyyyxxxxxyx'.replace(/[xy]/g, c => 
    (r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)).toString(16))

const Root = () => CorePipe.root.val()
const getUI = (id) => {
  let ui = {}
  Root().querySelectorAll(`[${id}]`).forEach(e => {
    ui[e.getAttribute(id)] = e
    e.removeAttribute(id)
  })
  return ui
}

export default props => {
  //props: run, cleanup, template, isRoot, classList, auto, debug
  let id = guid()

  const onrun = () => {
    const ui = getUI(id)
    props.run(ui)
  }
  const onauto = () => setTimeout(() => {
    const ui = getUI(id)
    props.auto(ui)
  }, 15)

  props.template = props.template.split(' id="').join(` ${id}="`)

  if(props.cleanup)
    CorePipe.cleanupAr.change(ar => ar.push(props.cleanup))

  if(props.isRoot){
    if(props.debug)
      console.log(props.template)
    CorePipe.root.change(el => {
      el.classList.add(...props.classList)
      el.innerHTML = props.template
    })
    setTimeout(() => {
      if(props.run)
        onrun()
      CorePipe.runAr.val().forEach(fn => fn())
      CorePipe.runAr.change([])
      document.body.appendChild(Root())
      CorePipe.cleanupAr.change(ar => ar.push(() => document.body.removeChild(Root())))
    }, 0)
  } 
  else if(props.run)
    CorePipe.runAr.change(ar => ar.push(onrun))
  else if(props.auto)
    onauto()

  return props.template
}
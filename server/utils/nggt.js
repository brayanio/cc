//data obj
const dataObj = obj => {
  let subs = [];

  const cleanup = fn => subs = subs.filter(f => f !== fn)
  const onChange = fn => {
    subs.push(fn)
    fn(obj)
    return {cleanup: () => cleanup(fn)}
  }
  const clear = () => subs = [];
  const val = () => obj;
  const update = () => subs.forEach(fn => fn(obj))
  
  const change = e => {
    (typeof e === 'function') ? e(obj) : obj = e;
    update();
    return obj;
  }

  const onevent = e => ($event) => change(e, event)
  const pushevent = () => e => change(e)

  return {change, onChange, update, val, clear, cleanup, onevent, pushevent}
}

//pipe
const pipe = (...ar) => {
  let obj = {}

  ar.forEach(o => {
    switch(typeof o){
      case 'object':
        Object.keys(o).forEach(key => {
          if(typeof o[key] === 'function')
            obj[key] = o[key]
          else
            obj[key] = dataObj(o[key])
        })
        break
      case 'string':
        obj[o] = dataObj(null)
        break
    }
  })

  let pipeRef = {...obj}
  
  pipeRef.val = () => {
    let o = {}
    Object.keys(obj).forEach(key => {
      if(typeof obj[key] === 'object')
        o[key] = obj[key].val()
    })
    return o
  }

  pipeRef.cleanup = () => Object.keys(pipeRef).forEach(key => {
    if(typeof pipeRef[key] === 'object')
      if(pipeRef[key].clear && pipeRef[key].cleanup)
        pipeRef[key].clear()
  })

  return pipeRef
}

module.exports = {pipe, dataObj}
import dataObj from './data-obj.js'

export default (...ar) => {
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
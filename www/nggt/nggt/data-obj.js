export default obj => {
  const origin = JSON.parse(JSON.stringify(obj))
  let subs = []

  const cleanup = fn => subs = subs.filter(f => f !== fn)
  const onChange = fn => {
    subs.push(fn)
    fn(obj)
    return {cleanup: () => cleanup(fn)}
  }
  const clear = () => {
    // subs = []
    obj = JSON.parse(JSON.stringify(origin))
  }
  const val = () => obj
  const update = () => subs.forEach(fn => fn(obj))
  
  const change = e => {
    (typeof e === 'function') ? e(obj) : obj = e
    update();
    return obj;
  }

  const onevent = e => () => change(e)
  const pushevent = () => e => change(e)

  return {change, onChange, update, val, clear, cleanup, onevent, pushevent}
}

export default obj => {
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
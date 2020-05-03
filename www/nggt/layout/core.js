const 

Join = (...args) => args.join(''),

El = (el, ...args) => Join(
  `<${el}>`,
    ...args,
  `</${el}>`
),

Container = (el, classList, ...args) => Join(
  `<${el} class="${classList.join(' ')}">`,
    ...args,
  `</${el}>`
),

Id = (el, id, classList, ...args) => Join(
  `<${el} id="${id}" class="${classList.join(' ')}">`,
    ...args,
  `</${el}>`
),

If = (condition, el) => {
  const efn = typeof el === 'function' ? el : () => el
  if(typeof condition === 'function' ? condition() : condition)
    return efn()
  return ''
},

Map = (ar, fn) => ar.map((e, i) => fn(e, i)).join('')

export default { Join, El, Container, Id, If, Map }
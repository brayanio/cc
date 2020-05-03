// utils
const Data = (name, plural, map, ...vals) => {
  let exp = {}
  exp[plural] = vals
  exp[name] = {}
  vals.forEach(e => map(exp[name], e))
  return exp
}
const nospace = str => str.split(' ').join('')

// data
const effect = (name, duration, start, type) => {
  return {name, duration, start, type}
}

let EffectData = Data('Effect', 'Effects', (data, e) => data[nospace(e.name)] = e,
  effect('Basic Attack', 1, 'instant', 'attack'),
  effect('Heal', 1, 'instant', 'heal')
)

/*
Title.HelloWorld === 'Hello World'
Titles[0] === 'Hello World'
*/

module.exports = {...EffectData}

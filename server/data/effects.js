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
const effect = (name, duration, start, ...tags) => {
  return {name, duration, start, tags}
}

let EffectData = Data('Effect', 'Effects', (data, e) => data[nospace(e.name)] = e,
    effect('Basic Attack', 0, 'instant'),
    effect('Heal', 0, 'instant'),

    //Skills
    effect('Skeleton', 2, 'turnend', 'pet'),
    effect('Fatigue', 3, 'buff', 'buff'),
    effect('Rage', null, 'turnstart', 'passive'),
    effect('Fury', null, 'buff', 'buff'),
    effect('Bleed', 1, 'turnend')
)

/*
Title.HelloWorld === 'Hello World'
Titles[0] === 'Hello World'
*/

module.exports = {...EffectData}

const abilityData = require('./ability.js')
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
const armor = (name, hp, rarity, speed, level, ability) => {
  return {name, hp, rarity, speed, level, ability}
}

let armorData = Data('Armor', 'Armors', (data, e) => data[nospace(e.name)] = e,
    armor('Breastplate', 40, 'Common', 100, 1, abilityData.Ability.Breastplate)
)
/*
Title.HelloWorld === 'Hello World'
Titles[0] === 'Hello World'
*/

module.exports = {...armorData}

const ability = require('./ability.js')
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
const weapon = (name, attack, rarity, level, damageDie, ability) => {
  return {name, attack, rarity, level, damageDie, ability }
}

let weaponData = Data('Weapon', 'Weapons', (data, e) => data[nospace(e.name)] = e,
    weapon('Battle Axe', 4, 'Common', 1, 8, ability.Ability.BattleAxe)
)

/*
Title.HelloWorld === 'Hello World'
Titles[0] === 'Hello World'
*/

module.exports = {...weaponData}

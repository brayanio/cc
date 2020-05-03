const effects = require('./effects.js')
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
const weaponAbility = (name, event, target, ...effects) => {
    return {name, event, target, effects, abilityType: 'weapon'}
}

const skillAbility = (name, cooldown, target, ...effects) => {
    return {name, cooldown, target, effects, abilityType: 'skill'}
}
let AbilityData = Data('Ability', 'Abilitys', (data, e) => data[nospace(e.name)] = e,
    weaponAbility('Basic Attack', 'attack', 'enemy', effects.Effect.BasicAttack),
    skillAbility('Heal', 5, 'self', effects.Effect.Heal)
)
module.exports = {...AbilityData}

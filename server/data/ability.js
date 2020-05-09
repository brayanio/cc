const eff = require('./effects.js')
const effects = () => JSON.parse(JSON.stringify(eff))

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
const armorAbility = (name, cooldown, target, ...effects) => {
    return {name, cooldown, target, effects, abilityType: 'skill'}
}
const skillAbility = (name, cooldown, target, className, ...effects) => {
    return {name, cooldown, target, effects, className, abilityType: 'skill'}
}
let AbilityData = Data('Ability', 'Abilities', (data, e) => data[nospace(e.name)] = e,
    weaponAbility('Battle Axe', 'attack', 'enemy', effects().Effect.BattleAxe),
    //armor
    armorAbility('Breastplate', 5, 'self', effects().Effect.Breastplate),
    //skills
    skillAbility('Skeleton', 0, 'self','Necromancer', effects().Effect.Skeleton, effects().Effect.Skeleton),
    skillAbility('Fatigue', 3, 'enemy', 'Necromancer', effects().Effect.Fatigue),
    // skillAbility('Rage', 3, 'self', effects().Effect.Rage, effects().Effect.Fury, effects().Effect.Fury),
    // skillAbility('Gore', 0, 'enemy', effects().Effect.Bleed)
)
module.exports = {...AbilityData}

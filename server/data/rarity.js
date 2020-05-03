// utils
const Data = (name, plural, map, ...vals) => {
    let exp = {}
    exp[plural] = vals
    exp[name] = {}
    vals.forEach(e => map(exp[name], e))
    return exp
}

// data
const rarity = (name, event, target, ...effects) => {
    return {name, event, target, effects, abilityType: 'weapon'}
}

let RarityData = Data('Rarity', 'Rarities', (data, e) => data[e] = e,
    'Common', 'Rare', 'Epic'
)

module.exports = {...RarityData}

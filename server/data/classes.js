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
const classes = (name,fullBonus, multiBonus, ...skills) => {
    return {name, fullBonus, multiBonus ,skills}
}

let ClassData = Data('ClassData', 'Classes', (data, e) => data[nospace(e.name)] = e,
    classes('Necromancer', 'NecromancerBonus','NecromancerMulti','Skeleton', 'Fatigue')
)

module.exports = {...ClassData}

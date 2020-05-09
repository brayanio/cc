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
const map = (name, ...monsters) => {
    return {name, monsters}
}

let map = Data('Map', 'Maps', (data, e) => data[nospace(e.name)] = e,
    map('Tomb', 'Skeleton'),
)

/*
Title.HelloWorld === 'Hello World'
Titles[0] === 'Hello World'
*/

module.exports = {...weaponData}

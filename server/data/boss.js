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
  const monster = (name, level, speed, hp, damageDie, attack, loot, abilities, ...tags) => {
    return {name, level, speed, hp, damageDie, attack, loot, abilities, tags}
  }
  
  let MonsterData = Data('Boss', 'Bosses', (data, e) => data[nospace(e.name)] = e,
    monster('Lich', 3, 75, 3, 4, 8, {}, [], 'undead'), // boss
  )
  
  /*
  Title.HelloWorld === 'Hello World'
  Titles[0] === 'Hello World'
  */
  
  module.exports = {...MonsterData}

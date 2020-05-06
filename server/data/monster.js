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
  const monster = (name, level, hp, damageDie, loot, ...tags) => {
    return {name, level, hp, damageDie, loot, tags}
  }
  
  let MonsterData = Data('Monster', 'Monsters', (data, e) => data[nospace(e.name)] = e,
    monster('Skeleton', 1, 60, 8, {'RaiseDead': 33}, 'undead')
  )
  
  /*
  Title.HelloWorld === 'Hello World'
  Titles[0] === 'Hello World'
  */
  
  module.exports = {...MonsterData}
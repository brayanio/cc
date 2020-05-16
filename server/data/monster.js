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
  const monster = (name, level, speed, hp, damageDie, attack, loot, ...tags) => {
    return {name, level, speed, hp, damageDie, attack, loot, tags}
  }
  
  const boss = (name, level, speed, hp, damageDie, attack, bossLoot, abilities, ...tags) => {
    return {name, level, speed, hp, damageDie, attack, bossLoot, abilities, tags}
  }
  
  let MonsterData = Data('Monster', 'Monsters', (data, e) => data[nospace(e.name)] = e,
    monster('Slave', 1, 5, 20, 1, 4, {}, 'undead'), // low health, low damage, low speed
    monster('Skeleton', 1, 110, 2, 6, 4, {Skeleton: 36}, 'undead'), // low health, high damage, high speed
    monster('Zombie', 1, 30, 3, 2, 8, {}, 'undead'), // high health, low damage, low speed
    monster('Golem', 2, 30, 5, 6, 6, {}, 'undead'), // high health, high damage, low speed
    monster('Flesh Golem', 2, 20, 80, 6, 6, {}, 'undead'), // high health, high damage, low speed
    monster('Necrokitty', 2, 180, 3, 2, 12, {}, 'undead'), // low health, high damage, high speed
    boss('Lich', 3, 75, 3, 4, 8, {MummyWraps: 75}, ['ReleaseSlave', 'FleshGolem', 'AOEFatigue'], 'undead'), // boss
  )
  
  /*
  Title.HelloWorld === 'Hello World'
  Titles[0] === 'Hello World'
  */
  
  module.exports = {...MonsterData}

const EF = require('../../utils/effect-factory.js')

module.exports = (room, caster, target) => {
  let slaves = room.monsters.filter((monster) => monster.stats.health > 0 && monster.name === 'Slave')
  let amt = slaves.length
  const golem = EF.summonMonster(room, 'teamB', 'Flesh Golem')

  for(let i = 0; i < amt; i++) 
    EF.addEffect('Buff', golem.username, golem.username);
  
  EF.change(room, {
    'Slaves Killed': amt,
    'Flesh Golem': 'Monster Summoned'
  })
}
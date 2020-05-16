const EF = require('../../utils/effect-factory.js')

module.exports = (room, caster, target, effect) => {
  EF.summonMonster(room, 'teamB', 'Slave')

  EF.change(room, effect, {[target.username]: target.stats},{
    'Slave': 'Monster Summoned'
  })
}

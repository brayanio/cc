const EF = require('../../utils/effect-factory.js')
const r = require('../rarity.js')

module.exports = (room, caster, target, effect) => {
    const {damage} = EF.weaponAttack(caster, r)
    target.stats.health -= damage

    EF.change(
        room,
        effect,
        {[target.username]: target.stats},
        {damage}
    )
}

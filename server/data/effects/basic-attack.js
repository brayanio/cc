const EF = require('../../utils/effect-factory.js')
const r = require('../rarity.js')

module.exports = (room, caster, target) => {
    const {damage} = EF.attack(caster, r)
    target.stats.health -= damage

    EF.change(room, {
        damage,
        modified: {[target.username]: target.stats}
    })
}

const EF = require('../../utils/effect-factory.js')
const r = require('../rarity.js')

module.exports = (room, caster, target) => {
    const {damage, rolls} = EF.attack(caster, r)
    target.stats.health -= damage

    EF.change(room, {
        damage,
        rolls,
        modified: {[target.username]: target.stats}
    })
}

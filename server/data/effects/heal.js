const EF = require('../../utils/effect-factory.js')
const r = require('../rarity.js')
module.exports = (room, caster, target, effect) => {
    const {total} = EF.heal(caster, r)

    if(target.stats.health + total >= target.armor.hp) {
        target.stats.health = target.armor.hp
    } else {
        target.stats.health += total
    }


    EF.change(room, {
        heal: total,
        modified: {[target.username]: target.stats}
    }, effect)
}

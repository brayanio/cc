const EF = require('../../utils/effect-factory.js')
const r = require('../rarity.js')

module.exports = (room, caster, target) => {
    const level = caster.weapon.level
    const damageDie = caster.weapon.damageDie
    const attack = caster.weapon.attack
    const rarity = caster.weapon.rarity

    const rolls = []
    let damage = 0
    for(let i = 0; i < level; i++) {
        const val = Math.floor(Math.random() * damageDie) + 1
        rolls.push(val)
        damage += val
    }

    damage += (attack * (r.Rarities.indexOf(rarity) + 1))
    const id = EF.guid()

    target.stats.health -= damage
    room.data.changes.push({
        id,
        rolls,
        damage,
        modified: {[target.username]: target.stats}
    })
}

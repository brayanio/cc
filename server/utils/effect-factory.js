const guid = require('./guid.js')

const attack = (caster, r) => {
    const level = caster.weapon.level
    const damageDie = caster.weapon.damageDie
    const attack = caster.weapon.attack
    const rarity = caster.weapon.rarity

    const rolls = []
    let damage = 0
    for (let i = 0; i < level; i++) {
        const val = Math.floor(Math.random() * damageDie) + 1
        rolls.push(val)
        damage += val
    }
    damage += (attack * (r.Rarities.indexOf(rarity) + 1))
    return {
        rolls,
        damage
    }
}

const heal = (caster, r) => {
    const level = caster.armor.level
    const rarity = caster.armor.rarity
    const baseHp = caster.armor.hp

    const total =  baseHp * ((30 + r.Rarities.indexOf(rarity) * level) / 100)

    return {
        total
    }
}

const change = (room, ...changes)=> room.data.changes.push({
        id: guid(),
        ...changes
    })

module.exports = {
    guid,
    attack,
    change,
    heal
}

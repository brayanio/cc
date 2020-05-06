const EF = require('../../utils/effect-factory.js')

module.exports = (room, caster, target, effect) => {
    let fury = caster.stats.effects.filter(e => e.name === 'Fury'),
        l = fury.length + 0
    const {damage, rolls} = EF.attack(l, 12)
    caster.stats.effects = caster.stats.effects.filter(e => e.name !== 'Fury')

    target.stats.health -= damage
    //GORE DONT WORK YET
    EF.change(room, effect, {[target.username]: target.stats}, {
        damage,
        ['Consumed Fury']: l
    })
}

// 1d4

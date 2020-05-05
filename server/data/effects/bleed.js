const EF = require('../../utils/effect-factory.js')

module.exports = (room, caster, target, effect) => {
    target.stats.health -= 2

    EF.change(room, {
        damage: 2,
        modified: {[target.username]: target.stats}
    })
}

// 1d4
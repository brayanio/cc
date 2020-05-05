const EF = require('../../utils/effect-factory.js')

const data = require('../module.js')

const MAX_RAGE = 5

module.exports = (room, caster, target) => {
    let effectData = {}
    // Add Rage
    if(caster.stats.effects.filter(e => e.name === 'Rage').length < MAX_RAGE){
        caster.stats.effects.push(data().Effects.Rage)
        effectData.effect = 'Rage'
    }

    EF.change(room, {
        ...effectData,
        modified: {[caster.username]: target.stats}
    })
}


/*

Give stack on turn start
each stack gives +2 attack

*/
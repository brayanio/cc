const EF = require('../../utils/effect-factory.js')

const data = require('../module.js')

const MAX_FURY = 5

module.exports = (room, caster, target, effect) => {
    let effectData = {}

    // Add Fury
    if(caster.stats.effects.filter(e => e.name === 'Fury').length < MAX_FURY){
        const Fury = data().Effect.Fury
        console.log('Fury', Fury)
        Fury.birth = {username: caster.username, target: caster.username}
        caster.stats.effects.push(Fury)
        effectData.Fury = 'Added'
    }

    EF.change(room, effect, {[caster.username]: target.stats},{
        ...effectData
    })
}


/*

Give stack on turn start
each stack gives +2 attack

*/

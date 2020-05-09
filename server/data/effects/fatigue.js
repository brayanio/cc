const EF = require('../../utils/effect-factory.js')

module.exports = (room, caster, target, effect) => {

    let status = {}
    if(effect.start==='buff')
        status['Attack Reduction'] = 2
    else
        status['Removed'] = 'Buff'

    EF.buff(effect, ()=>{
        target.stats.attack -= 2
    }, ()=>{
        // console.log('Fatigue Target', target.username)
        target.stats.attack += 2
    })

    EF.change(room, effect, {[target.username]: target.stats},{
        ...status
    })
}

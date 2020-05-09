const EF = require('../../utils/effect-factory.js')

module.exports = (room, caster, target, effect) => {

    let status = {}
    if(effect.start==='buff')
        status['Attack Reduction'] = 2
    else
        status.removeBuff = true

    EF.buff(effect, ()=>{
        target.stats.attack -= 2
    }, ()=>{
        target.stats.attack += 2
    })

    EF.change(room, effect, {[target.username]: target.stats},{
        ...status
    })
}

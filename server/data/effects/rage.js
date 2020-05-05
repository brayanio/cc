const EF = require('../../utils/effect-factory.js')

module.exports = (room, caster, target, effect) => {

    let status = {}
    if(effect.start==='buff')
        status.rageBonus = 2
    else
        status.removeBuff = true

    EF.buff(effect, ()=>{
        target.stats.attack += 2
    }, ()=>{
        target.stats.attack -= 2
    })

    EF.change(room, {
        ...status,
        modified: {[target.username]: target.stats}
    })
}

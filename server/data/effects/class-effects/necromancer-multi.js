const EF = require('../../../utils/effect-factory.js')

module.exports = (room, caster, target, effect) => {
    console.log('Necro Bonus Multi')
    EF.buff(effect, ()=>{
        caster.stats.maxHealth += 10
        caster.stats.health += 10
    }, ()=> {
        caster.stats.maxHealth -= 10
        caster.stats.health -= 10
    })
    EF.change(room, effect, {[caster.username]: caster.stats}, {
        health: 10
    }, )
}

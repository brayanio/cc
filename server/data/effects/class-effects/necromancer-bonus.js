const EF = require('../../../utils/effect-factory.js')

module.exports = (room, caster, target, effect) => {
    console.log('Necro Bonus')
    caster.stats.effects.forEach((effect) => {
        console.log(effect.tags.includes('pet'), !effect.tags.includes('necro-bonus'))
        if(effect.tags.includes('pet') && !effect.tags.includes('necro-bonus')) {
         effect.duration = effect.duration + 1
         effect.tags.push('necro-bonus')
        }
    })
    EF.change(room, effect, {[caster.username]: caster.stats}, {
        magic: 'real'
    }, )
}

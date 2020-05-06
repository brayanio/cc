const cloneData = (obj) => JSON.parse(JSON.stringify(obj))

module.exports = () => {
    let obj = cloneData({
        ...require('./game.js'),
        ...require('./ability.js'),
        ...require('./armor.js'),
        ...require('./monster.js'),
        ...require('./rarity.js'),
        ...require('./weapon.js'),
        ...require('./effects.js'),

    })
    obj.EffectFn = require('./effects/module.js')
    return obj
}

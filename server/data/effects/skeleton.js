const EF = require('../../utils/effect-factory.js')

const UserPipe = require('../../pipes/user.js')
const getUser = username => UserPipe.getUser(username)

module.exports = (room, caster, target, effect) => {

    const packet = room.packet(caster.username)
    let enemies = packet.teams[packet.enemyTeam]
    target = effect.birth.isUser
        ? getUser(enemies[Math.floor(Math.random() * enemies.length)])
        : room.getMonster(enemies[Math.floor(Math.random() * enemies.length)])

    const {damage, rolls} = EF.attack( 1, 4)
    target.stats.health -= damage

    EF.change(room, effect, {[target.username]: target.stats},{
        damage,
        rolls
    })
}

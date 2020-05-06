const nggt = require('../utils/nggt.js')
const data = require('../data/module.js')

// pipes
const UserPipe = require('./user.js')
const RoomPipe = nggt.pipe()

// utils
const getUser = username => UserPipe.getUser(username)
const nospace = str => str.split(' ').join('')

// fns
const doEffect = (room, caster, target, effect) =>
    data().EffectFn[nospace(effect.name)](room, caster, target, effect)

const runEffectEvent = (start, effect, room, user, targetUser) => {
    if (effect.start === start) {
        const ability = data().Ability[effect.ability]
        if(ability)
            doEffect(room, user, targetUser, effect)
    }
}

const ability = (username, target, abilityName) => {
    const user = getUser(username)
    const targetUser = getUser(target)
    const room = RoomPipe[user.roomId].val()
    if(room.data.turnOrder[room.data.turnIndex] !== username)
        return null
    const ability = data().Ability[nospace(abilityName)]
    user.stats.cooldowns[ability.name] = ability.cooldown
    ability.effects = ability.effects.filter(effect => {
        effect.ability = nospace(ability.name)
        effect.birth = {username, target}
        runEffectEvent('instant', effect, room, user, targetUser)
        runEffectEvent('buff', effect, room, user, targetUser)
        return effect.start !== 'instant' && !effect.tags.includes('passive')
    })
    targetUser.stats.effects = targetUser.stats.effects.concat(ability.effects)

    //end turn
    user.stats.effects = user.stats.effects.filter(effect => {
        runEffectEvent('turnend', effect, room, user, targetUser)
        if(!effect.tags.includes('passive') && effect.duration)
            effect.duration--
        if(effect.duration === 0 && effect.duration !== null) {
            runEffectEvent('remove', effect, room, user, targetUser)
            return false
        }
        return true
    })

    if (room.data.turnIndex + 1 >= room.data.turnOrder.length)
        room.data.turnIndex = 0
    else
        room.data.turnIndex++
    //start turn
    const currentUser = getUser(room.data.turnOrder[room.data.turnIndex])
    currentUser.stats.effects.forEach(effect =>
        runEffectEvent('turnstart', effect, room, currentUser, getUser(effect.birth.target))
    )
    currentUser.stats.effects.forEach(effect =>
        runEffectEvent('buff', effect, room, currentUser, getUser(effect.birth.target))
    )
    if(currentUser.stats.cooldowns) {
        Object.keys(currentUser.stats.cooldowns).forEach((abilityname) => {
            if (currentUser.stats.cooldowns[abilityname] - 1 >= 0)
                currentUser.stats.cooldowns[abilityname]--
        })
        console.log('cooldown', currentUser.stats.cooldowns)
    }
}

const turnIndex = username => {
    const user = getUser(username)
    if (user && user.roomId) {
        console.log(RoomPipe[user.roomId].val().data.turnIndex)
        const room = RoomPipe[user.roomId].val()
        return {turnIndex: room.data.turnIndex}
    }
}

const changes = (username, changeId) => {
    const user = getUser(username)
    if (user && user.roomId) {
        const room = RoomPipe[user.roomId].val()
        let index
        room.data.changes.find((e, i) => changeId === e.id ? index = i : null)

        if(!index)
            return {changes: JSON.parse(JSON.stringify(room.data.changes)).reverse(), uiData: room.uiData(username)}

        return {changes: room.data.changes.slice(index + 1).reverse(), uiData: room.uiData(username)}
    }
}
module.exports = {RoomPipe, ability, turnIndex, changes}

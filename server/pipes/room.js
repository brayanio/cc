const nggt = require('../utils/nggt.js')
const data = require('../data/module.js')
const EF = require('../utils/effect-factory.js')

// pipes
const UserPipe = require('./user.js')
const RoomPipe = nggt.pipe()
const Monster = require('./models/monster.js')
// utils
const getUser = username => UserPipe.getUser(username)
const nospace = str => str.split(' ').join('')

// fns
const doEffect = (room, caster, target, effect) =>
    data().EffectFn[nospace(effect.name)](room, caster, target, effect)

const runEffectEvent = (start, effect, room, user, targetUser) => {
    if (effect.start === start) {
        const ability = data().Ability[effect.ability]
        if (ability)
            doEffect(room, user, targetUser, effect)
    }
}

const ability = (username, t, abilityName) => {
    // modify to be used with Monster
    const user = getUser(username)
    const room = RoomPipe[user.roomId].val()
    const ability = data().Ability[nospace(abilityName)]
    let target
    if (room.meta.gameType === 'pvp' || ability.target === 'self' || ability.taret === 'ally')
        target = getUser(t)
    else
        target = room.getMonster(t)
    console.log(target, t, 'here')
    if (room.data.turnOrder[room.data.turnIndex] !== username)
        return null
    user.stats.cooldowns[ability.name] = ability.cooldown
    ability.effects = ability.effects.filter(effect => {
        effect.ability = nospace(ability.name)
        effect.birth = {username, t, isUser: room.meta.gameType === 'pvp'}
        runEffectEvent('instant', effect, room, user, target)
        runEffectEvent('buff', effect, room, user, target)
        return effect.start !== 'instant' && !effect.tags.includes('passive')
    })
    target.stats.effects = target.stats.effects.concat(ability.effects)

    //end turn
    user.stats.effects = user.stats.effects.filter(effect => {
        runEffectEvent('turnend', effect, room, user, target)
        if (!effect.tags.includes('passive') && effect.duration)
            effect.duration--
        if (effect.duration === 0 && effect.duration !== null) {
            runEffectEvent('remove', effect, room, user, target)
            return false
        }
        return true
    })

    turnOver(room)
    //start turn
    // Refactor into its own function
    //
    if (room.meta.gameType === 'pvp')
        userStartTurn(room)
    else
        monsterStartTurn(room)
}

const monsterStartTurn = (room) => {
    const currentMonster = room.getMonster(room.data.turnOrder[room.data.turnIndex])
    const target = (e) => {
        if (e.birth.isUser)
            return getUser(e.birth.target)
        else
            return room.getMonster(e.birth.target)
    }
    currentMonster.stats.effects.forEach(effect =>
        runEffectEvent('turnstart', effect, room, currentMonster, target(effect))
    )
    currentMonster.stats.effects.forEach(effect =>
        runEffectEvent('buff', effect, room, currentMonster, target(effect))
    )
    let randTarget = getUser(room.teamA[Math.floor(Math.random()*room.teamA.length)])
    currentMonster.attack(room, randTarget)
    turnOver(room)
}

const turnOver = (room) => {
    if (room.data.turnIndex + 1 >= room.data.turnOrder.length)
        room.data.turnIndex = 0
    else
        room.data.turnIndex++
}

const userStartTurn = (room) => {
    const currentUser = getUser(room.data.turnOrder[room.data.turnIndex])
    currentUser.stats.effects.forEach(effect =>
        runEffectEvent('turnstart', effect, room, currentUser, getUser(effect.birth.target))
    )
    currentUser.stats.effects.forEach(effect =>
        runEffectEvent('buff', effect, room, currentUser, getUser(effect.birth.target))
    )
    if (currentUser.stats.cooldowns)
        Object.keys(currentUser.stats.cooldowns).forEach((abilityname) => {
            if (currentUser.stats.cooldowns[abilityname] - 1 >= 0)
                currentUser.stats.cooldowns[abilityname]--
        })
}

const turnIndex = (username, changeId) => {
    const user = getUser(username)
    if (user && user.roomId) {
        console.log(RoomPipe[user.roomId].val().data.turnIndex)
        const room = RoomPipe[user.roomId].val()

        if(room.data.changes.length > 0) {
            if (!changeId)
                return {turnIndex: Math.random()}
            else{
                let index
                room.data.changes.find((e, i) => changeId === e.id ? index = i : null)

                if(index === room.data.changes.length - 1)
                    return {turnIndex: room.data.turnIndex}
                return {turnIndex: Math.random()}
            }
        }
                return {turnIndex: room.data.turnIndex}
    }
}

const changes = (username, changeId) => {
    const user = getUser(username)
    if (user && user.roomId) {
        const room = RoomPipe[user.roomId].val()
        let index
        room.data.changes.find((e, i) => changeId === e.id ? index = i : null)

        if (!index)
            return {changes: JSON.parse(JSON.stringify(room.data.changes)).reverse(), uiData: room.uiData(username)}

        return {changes: room.data.changes.slice(index + 1).reverse(), uiData: room.uiData(username)}
    }
}
module.exports = {RoomPipe, ability, turnIndex, changes}

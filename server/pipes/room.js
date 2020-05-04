const nggt = require('../utils/nggt.js')
const guid = require('../utils/guid.js')
const UserPipe = require('./user.js')
const data = require('../data/module.js')
const QuePipe = nggt.pipe()
const RoomPipe = nggt.pipe()
const getUser = username => UserPipe.getUser(username)
const nospace = str => str.split(' ').join('');


const Room = class {
    constructor(que) {
        this.id = guid()
        this.meta = {connected: que.connected, gameType: que.name, playerCount: que.playerCount}
        this.data = {
            turnOrder: que.connected.sort((o1, o2) => {
                const user1 = getUser(o1.username)
                const user2 = getUser(o2.username)
                if (user1.armor.speed > user2.armor.speed)
                    return 1
                if (user1.armor.speed < user2.armor.speed)
                    return -1
                return 0
            }).map(user => user.username),
            turnIndex: 0,
            changes: []
        }
        this.teamA = [que.connected[0].username]
        this.teamB = [que.connected[1].username]
    }

    userData() {
        const userPackets = this.meta.connected.map(o => getUser(o.username).packet())
        return userPackets
    }

    uiData(username) {
        const user = getUser(username)
        const health = {}
        let effects = {}
        this.meta.connected.forEach(o => {
            const User = getUser(o.username)
            effects[o.username] = User.stats.effects
            health[o.username] = User.stats.health
        })

        this.meta.connected
        const abilityPacket = (name, target, cooldown) => {
            return {name, target, cooldown}
        }
        return {
            abilityData: [
                abilityPacket(user.weapon.ability.name, user.weapon.ability.target, 0),
                abilityPacket(user.armor.ability.name, user.armor.ability.target, user.stats.cooldowns[user.armor.ability.name] || 0),
                ...user.skills.map(skill => abilityPacket(skill.name, skill.target, user.stats.cooldowns[skill.name] || 0))
            ],
            effects,
            health
        }
    }

    disconnect(username) {
        this.meta.connected = this.meta.connected.filter(e => e !== username)
        UserPipe.getUser(username).disconnect()
    }

    packet(username) {
        this.data.userPackets = this.userData()
        const team = this.teamA.includes(username) ? 0 : 1
        const enemyTeam = this.teamA.includes(username) ? 1 : 0
        return {
            packet: 'room',
            data: this.data,
            username,
            uiData: this.uiData(username),
            stats: this.stats,
            teams: [this.teamA, this.teamB],
            team,
            enemyTeam
        }
    }
}

const Que = class {
    constructor(name, username, playerCount) {
        this.name = name
        this.playerCount = playerCount
        this.connected = []
        this.connect(username)
    }

    connect(username) {
        const user = UserPipe.getUser(username)
        user.joinQue(this.name)
        this.connected.push(user)
    }

    checkFull() {
        if (this.connected.length >= parseInt('' + this.playerCount)) {
            const roomCreated = new Room(this)
            RoomPipe[roomCreated.id] = nggt.dataObj(roomCreated)
            this.connected.forEach(user => user.joinRoom(roomCreated.id))
            return roomCreated
        }
    }

    disconnect(username) {
        this.connected = this.connected.filter(u => u.username !== username)
        UserPipe.getUser(username).disconnect()
    }

    packet() {
        return {
            packet: 'que',
            playerAmount: this.connected.length,
            playerCount: this.playerCount
        }
    }
}

const joinQue = (username, queName, playerCount) => {
    const check = checkQue(username)
    if (!check.error) return check
    if (QuePipe[queName] && QuePipe[queName]) {
        const que = QuePipe[queName].val()
        que.connect(username)
        const roomCreated = que.checkFull(username, playerCount)
        return roomCreated.packet(username)
    }
    const queCreated = new Que(queName, username, playerCount)
    QuePipe[queName] = nggt.dataObj(queCreated)
    return queCreated.packet(username)
}

const checkQue = username => {
    const user = UserPipe.getUser(username)
    if (QuePipe[user.queName])
        return QuePipe[user.queName].val().packet(username)
    else if (user.roomId && RoomPipe[user.roomId])
        return RoomPipe[user.roomId].val().packet(username)
    return {error: true, msg: 'User not in que or active room.'}
}

const leaveQue = username => {
    const user = UserPipe.getUser(username)
    if (user.queName)
        QuePipe[user.queName].val().disconnect(username)
    if (user.roomId)
        RoomPipe[user.roomId].val().disconnect(username)
    return {msg: 'User removed from any que or active room.', error: false}
}

const doEffect = (room, caster, target, effect) => {
    if(target.stats.cooldowns)
        Object.keys(target.stats.cooldowns).forEach((abilityname)=> {
            if(caster.stats.cooldowns[abilityname] - 1 >= 0)
                caster.stats.cooldowns[abilityname]--
        })
    data().EffectFn[nospace(effect.name)](room, caster, target, effect)
}

const runEffectEvent = (start, effect, room, user, targetUser) => {
    if (effect.start === start) {
        const ability = data().Ability[effect.ability]
        if (ability.abilityType === 'weapon')
            doEffect(room, user, targetUser, effect)
        if (ability.abilityType === 'skill' ) {
            user.stats.cooldowns[ability.name] = ability.cooldown
            // Something about Cooldown ability.cooldown
            doEffect(room, user, targetUser, effect)
        }
    }
}

const ability = (username, target, abilityName) => {
    const user = getUser(username)
    const targetUser = getUser(target)
    const room = RoomPipe[user.roomId].val()
    if(room.data.turnOrder[room.data.turnIndex] !== username)
        return null
    console.log(abilityName)
    const ability = data().Ability[nospace(abilityName)]
    ability.effects = ability.effects.filter(effect => {
        effect.ability = nospace(ability.name)
        effect.birth = {username, target}
        runEffectEvent('instant', effect, room, user, targetUser)
        runEffectEvent('buff', effect, room, user, targetUser)
        return effect.start !== 'instant'
    })
    targetUser.stats.effects = targetUser.stats.effects.concat(ability.effects)

    //end turn
    user.stats.effects = user.stats.effects.filter(effect => {
        runEffectEvent('turnend', effect, room, user, targetUser)
        effect.duration--
        if(effect.duration === 0) {
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
    currentUser.stats.effects.forEach(effect => runEffectEvent('turnstart', effect, room, currentUser, getUser(effect.birth.target)))
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
            return {changes: room.data.changes, uiData: room.uiData(username)}

        return {changes: room.data.changes.slice(index), uiData: room.uiData(username)}
    }
}
module.exports = {joinQue, checkQue, leaveQue, ability, turnIndex, changes}

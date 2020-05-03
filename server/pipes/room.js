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
        this.meta.connected.forEach(o => health[o.username] = getUser(o.username).stats.health)

        return {
            abilityNames: [
                user.weapon.ability.name,
                user.armor.ability.name,
            ],
            health,
        }
    }

    disconnect(username) {
        this.meta.connected = this.meta.connected.filter(e => e !== username)
        UserPipe.getUser(username).disconnect()
    }

    packet(username) {
        this.data.userPackets = this.userData()
        const team = this.teamA.includes(username) ? 0 : 1
        return {
            packet: 'room',
            data: this.data,
            username,
            uiData: this.uiData(username),
            stats: this.stats,
            teams: [this.teamA, this.teamB],
            team
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

const doWeaponEffect = (room, caster, target, effect) => data.EffectFn[nospace(effect.name)](room, caster, target)

const ability = (username, target, abilityName) => {
    const user = getUser(username)
    const targetUser = getUser(target)
    const room = RoomPipe[user.roomId].val()
    console.log(abilityName)
    const ability = data.Ability[nospace(abilityName)]
    ability.effects.forEach(effect => effect.ability = nospace(ability.name))
    targetUser.stats.effects = targetUser.stats.effects.concat(ability.effects)

    // end turn
    targetUser.stats.effects.forEach(effect => {
        const ability = data.Ability[effect.ability]
        if(ability.abilityType === 'weapon')
            doWeaponEffect(room, user, targetUser, effect)
    })

    if(room.data.turnIndex + 1 >= room.data.turnOrder.length)
        room.data.turnIndex = 0
    else
        room.data.turnIndex ++
}

const turnIndex = username => {
    const user = getUser(username)
    if(user && user.roomId) {
        console.log(RoomPipe[user.roomId].val().data.turnIndex)
        const room = RoomPipe[user.roomId].val()
        return {turnIndex: room.data.turnIndex}
    }
}

const changes = username => {
    const user = getUser(username)
    if (user && user.roomId) {
        const room = RoomPipe[user.roomId].val()

        return {changes: room.data.changes, uiData: room.uiData()}
    }
}
module.exports = {joinQue, checkQue, leaveQue, ability, turnIndex, changes}

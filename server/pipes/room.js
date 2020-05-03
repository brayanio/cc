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
            turnIndex: 0
        }
        this.stats = {}
        this.meta.connected.forEach(o => {
            const user = getUser(o.username)
            this.stats[o.username] = {
                health: user.armor.hp + 0,
                attack: user.weapon.attack + 0,
                speed: user.armor.speed,
                effects: []
            }
        })
        /*username: {
                 health, attack, speed
          } */
    }

    userData() {
        const userPackets = this.meta.connected.map(o => getUser(o.username).packet())
        return userPackets
    }

    uiData(username) {
        const user = getUser(username)
        const health = {}
        Object.keys(this.stats).forEach(username => health[username] = this.stats[username].health)
        return {
            abilityNames: [
                user.weapon.ability.name,
                user.armor.ability.name,
            ],
            health
        }
    }

    disconnect(username) {
        this.meta.connected = this.meta.connected.filter(e => e !== username)
        UserPipe.getUser(username).disconnect()
    }

    packet(username) {
        this.data.userPackets = this.userData()
        return {
            packet: 'room',
            data: this.data,
            username,
            uiData: this.uiData(username),
            stats: this.stats
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
const ability = (username, target, abilityName) => {
    const user = getUser(username)
    const room = RoomPipe[user.roomId].val()
    const ability = data.Ability[nospace(abilityName)]
    const enemy = room.stats[target].effects.append(ability.effects)
}

const doEffect = (target, effect) => {

}
module.exports = {joinQue, checkQue, leaveQue}

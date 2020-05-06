const nggt = require('../../utils/nggt.js')
const UserPipe = require('../user.js')
const Room = require('./room.js')
const room = require('../room.js')
const RoomPipe = room.RoomPipe

module.exports = class {
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
            this.connected.forEach(user => {
                if(user.joinRoom)
                    user.joinRoom(roomCreated.id)
            })
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
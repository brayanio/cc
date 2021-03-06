const nggt = require('../../utils/nggt.js')
const UserPipe = require('../user.js')
const Room = require('./room.js')
const room = require('../room.js')
const RoomPipe = room.RoomPipe

module.exports = class {
    constructor(name, username, playerCount, mapName) {
        this.name = name
        this.playerCount = playerCount
        this.connected = []
        this.mapName = mapName
        this.connect(username)
    }

    connect(username) {
        const user = UserPipe.getUser(username)
        user.joinQue(this.name)
        this.connected.push(user)
    }

    /*
        * Checking if the que is full
        * Creating a room
        * Connecting users
        * Starting the first players turn
        * Returns room created
    */
    checkFull() {
        if (this.connected.length >= parseInt('' + this.playerCount)) {
            const roomCreated = new Room(this)
            RoomPipe[roomCreated.id] = nggt.dataObj(roomCreated)
            this.connected.forEach(user => {
                if(user.joinRoom)
                    user.joinRoom(roomCreated.id)
            })
            
            room.startGame(roomCreated)
            
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

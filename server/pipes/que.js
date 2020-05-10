const nggt = require('../utils/nggt.js')
const room = require('./room.js')
const UserPipe = require('./user.js')
const RoomPipe = room.RoomPipe
const QuePipe = nggt.pipe()
const Que = require('./models/que.js')
// utils
const getUser = username => UserPipe.getUser(username)
const joinQue = (username, queName, playerCount) => {
    const check = checkQue(username)
    if (!check.error) return check
    if (QuePipe[queName] && QuePipe[queName]) {
        const que = QuePipe[queName].val()
        que.connect(username, getUser(username).map)
        const roomCreated = que.checkFull(username, playerCount)
        return roomCreated.packet(username)
    }
    const queCreated = new Que(queName, username, playerCount, getUser(username).map)
    const roomCreated = queCreated.checkFull(username, playerCount)
    if(roomCreated)
        return roomCreated.packet(username)
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
module.exports = {joinQue, checkQue, leaveQue}

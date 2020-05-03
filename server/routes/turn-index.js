const server = require('../utils/server.js')
const roomPipe = require('../pipes/room.js')

module.exports = server.post('turn-index', body => {
    // console.log('[turn-index]', body)
    const username = body.username

    let res = roomPipe.turnIndex(username)
    return res
})

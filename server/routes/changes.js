const server = require('../utils/server.js')
const roomPipe = require('../pipes/room.js')

module.exports = server.post('changes', body => {
    console.log('[changes]', body)
    const username = body.username

    let res = roomPipe.changes(username)
    return res
})

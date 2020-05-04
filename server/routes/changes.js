const server = require('../utils/server.js')
const roomPipe = require('../pipes/room.js')

module.exports = server.post('changes', body => {
    console.log('[changes]', body)
    const username = body.username
    const changeId = body.changeId

    let res = roomPipe.changes(username, changeId)
    return res
})

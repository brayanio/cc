const server = require('../utils/server.js')
const roomPipe = require('../pipes/room.js')

module.exports = server.post('ability', body => {
    console.log('[ability]', body)
    const username = body.username
    const target = body.target
    const ability = body.ability

    let res = roomPipe.ability(username, target, ability)
    return res
})

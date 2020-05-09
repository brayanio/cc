const server = require('../utils/server.js')
const userPipe = require('../pipes/user.js')

module.exports = server.post('skills-uidata', body => {
    console.log('[skills-ui]', body)
    const username = body.username
    let res = userPipe.skillUiPacket(username)
    return res
})

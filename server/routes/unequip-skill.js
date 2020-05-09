const server = require('../utils/server.js')
const userPipe = require('../pipes/user.js')

module.exports = server.post('unequip-skill', body => {
    // console.log('[skill]', body)
    const username = body.username
    const skill = body.skill
    let res = userPipe.unequipSkill(username, skill)
    return res
})

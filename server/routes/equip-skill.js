const server = require('../utils/server.js')
const userPipe = require('../pipes/user.js')

module.exports = server.post('equip-skill', body => {
    // console.log('[skill]', body)
    const username = body.username
    const skill = body.skill


    let res = userPipe.equipSkill(username, skill)
    return res
})

const server = require('../utils/server.js')
const userPipe = require('../pipes/user.js')

module.exports = server.post('login', body => {
    console.log('[login]', body)
    const username = body.username
    const not_the_password = body.password
    let res = userPipe.login(username, not_the_password)
    return res
})

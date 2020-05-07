const server = require('../utils/server.js')
const userPipe = require('../pipes/user.js')

module.exports = server.post('signup', body => {
    console.log('[signup]', body)
    const username = body.username
    const not_the_password = body.password
    let res = userPipe.signup(username, not_the_password)
    return res
})

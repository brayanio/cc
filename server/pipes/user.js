const nggt = require('../utils/nggt.js')
const data = require('../data/module.js')
const User = require('./models/user.js')

const cachePipe = nggt.pipe()

const getUser = username => {
    let userObj = cachePipe[username]
    if (!userObj) cachePipe[username] = userObj = nggt.dataObj(new User(username))
    return userObj.val()
}

module.exports = {getUser, ...cachePipe}

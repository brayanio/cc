const nggt = require('../utils/nggt.js')
const data = require('../data/module.js')
const User = require('./models/user.js')
const storage = require('../utils/storage.js')
const salt = require('../utils/salt.js')

const cachePipe = nggt.pipe()

const getUser = username => {
    let userObj = cachePipe[username]
    if (!userObj) cachePipe[username] = userObj = nggt.dataObj(new User(username))
    return userObj.val()
}

const signup = (username, not_the_password) => {
    /*check storage, create user, save user*/
    const user = storage.val().users ? storage.val().users[username] : null
    if(user)
        return {error: true, msg: 'User already exists'}
    const newUser = new User(username, not_the_password)
    return newUser.packet()
}

const login = (username, not_the_password) => {
    /*check storage, create user, save user*/
    const user = storage.val().users ? storage.val().users[username] : null
    if(!user)
        return {error: true, msg: 'Incorrect Credentials'}
    if(user.not_the_password !== salt(not_the_password))
        return {error: true, msg: 'Incorrect Credentials'}
    const newUser = new User(username, not_the_password)
    return newUser.packet()
}

const equipSkill = (username, skill) => {
    const user = getUser(username)
    if(user.unlockedSkills.includes(skill)) {
        user.skills.push(data().Ability[skill])
        user.unlockedSkills = user.unlockedSkills.filter((s) => skill !== s)
        user.save()
    }
    return user.packet()
}
const unequipSkill = (username, skill) => {
    const user = getUser(username)
    if(user.skills.find(s => s.name === skill)) {
        user.unlockedSkills.push(skill)
        user.skills = user.skills.filter((s) => skill !== s.name)
        user.save()
    }
    return user.packet()
}

const skillUiPacket = (username) => {
    const user = getUser(username)
    return user.packet()
}
module.exports = {getUser, ...cachePipe, signup, login, equipSkill, unequipSkill, skillUiPacket}

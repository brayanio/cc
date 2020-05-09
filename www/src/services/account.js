import nggt from '../nggt.js'
import pvp from "./pvp.js";

const pipe = nggt.service('account')

const signup = async (username, password) => {
    let obj = await pipe.post('account', 'signup', {username, password}, true)
    if(obj.error) {
        console.error('SIGNUP ERROR:', obj)
        return false
    }
    //We have the account
    console.log('obj', obj)
}

const login = async (username, password) => {
    let obj = await pipe.post('account', 'login', {username, password}, false)
    if(obj.error) {
        console.error('LOGIN ERROR:', obj)
        return false
    }
    //We have the account
    console.log('[login]', obj)
}

const equipSkill = async (skill) => {
    let obj = await pipe.post('account', 'equip-skill', {username: username(), skill}, true)
    if(obj.error) {
        console.error('LOGIN ERROR:', obj)
        return false
    }
    //We have the account
    // console.log('obj', obj)
}
const unequipSkill = async (skill) => {
    let obj = await pipe.post('account', 'unequip-skill', {username: username(), skill}, true)
    if(obj.error) {
        console.error('LOGIN ERROR:', obj)
        return false
    }
    //We have the account
    // console.log('obj', obj)
}
const username = () => pipe.account.val() ? pipe.account.val().username : null

pipe.account.onChange(account => account ? document.body.setAttribute('class', account.map) : null)

export default {pipe, signup, login, username, equipSkill, unequipSkill}

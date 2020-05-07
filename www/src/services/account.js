import nggt from '../nggt.js'
import pvp from "./pvp";

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
    let obj = await pipe.post('account', 'login', {username, password}, true)
    if(obj.error) {
        console.error('LOGIN ERROR:', obj)
        return false
    }
    //We have the account
    console.log('obj', obj)
}

export default {pipe, signup, login}

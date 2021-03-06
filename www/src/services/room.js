import nggt from '../nggt.js'
import pvp from './pvp.js'
import account from './account.js'

const pipe = nggt.service('room', {checkQue: false})

const QUE_TIME = 5000

const joinQue = async (gameType, playerCount) => {
    const username = account.username()
    let obj = await pipe.post('room', 'join-room', {username, que: gameType, playerCount}, true)
    console.log('obj', obj)
    if (obj.packet && obj.packet === 'room') {
        location.hash = '#/game'
        pvp.start(username)
    } else {
        pipe.checkQue.change(true)
        setTimeout(() => checkQue(username), QUE_TIME)
    }
}

const checkQue = async () => {
    const username = account.username()
    if (pipe.checkQue.val()) {
        await pipe.post('room', 'que', {username}, true)
        let obj = pipe.room.val()
        console.log('obj', obj)
        if (obj.packet && obj.packet === 'room') {
            pipe.checkQue.change(false)
            location.hash = '#/game'
            pvp.start(username)
        } else if (obj.error) {
            pipe.checkQue.change(false)
            console.error('[Game Error]', obj.error, obj.msg)
        } else
            setTimeout(() => checkQue(username), QUE_TIME)
    }
}

const leaveQue = async () => {
    const username = account.username()
    pipe.checkQue.change(false)
    pipe.send('leave-que', {username}, true)
    pipe.room.change(null)
    pvp.stop()
    location.hash = '#/'
    pipe.cleanup()
    pvp.pipe.cleanup()
}
const isUser = () => {
    const username = account.username()
    console.log(pipe.room.val())
    return pipe.room.val().username === username
}

const getUser = () =>
    pipe.room.val().data.userPackets.find(user => user.username === pipe.room.val().username)

const ui = () => pipe.room.val().uiData

const ability = (name, abilityTarget) =>
    pvp.ability(pipe.room.val(), name, abilityTarget)

pvp.pipe.changes.onChange((changes) => (changes && changes.uiData) ? pipe.room.change(room => room.uiData = changes.uiData) : null)

export default {pipe, joinQue, leaveQue, isUser, getUser, ui, ability}

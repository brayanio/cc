import nggt from '../nggt.js'

const pipe = nggt.service('turnIndex', 'changes', 'currentChangeId')

const REFRESH_TIME = 2000
let on = false
let currentIndex

const start = async (username) => {
    on = true
    setTimeout(() => checkTurnIndex(username), REFRESH_TIME)
}

const checkTurnIndex = async (username) => {
    if (on) {
        await pipe.post('turnIndex', 'turn-index', {username})
        const turnIndex = pipe.turnIndex.val().turnIndex
        if (currentIndex !== turnIndex) {
            const changes = await pipe.post('changes', 'changes', {username, changeId: pipe.currentChangeId.val()}, true)
            currentIndex = turnIndex
            console.log('CHANGES', changes)
        }
        setTimeout(() => checkTurnIndex(username), REFRESH_TIME)
    }
}

const stop = () => on = false

const ability = (room, abilityName, abilityTarget) => {
    const username = room.username
    const enemies = (room.team === 1 ? 0 : 1)
    let target

    if(abilityTarget === 'enemy'){
        if(room.teams[enemies].length === 1)
            target = room.teams[enemies][0]
    }

    if(abilityTarget === 'self')
        target = room.username

    pipe.send('ability', {username, target, ability: abilityName}, true)
}

pipe.changes.onChange(o => {
    if(o && o.changes[o.changes.length - 1])
        pipe.currentChangeId.change(o.changes[o.changes.length - 1].id)
})

export default {pipe, start, stop, ability}

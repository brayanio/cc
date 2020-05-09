import nggt from '../nggt.js'

const pipe = nggt.service('turnIndex', 'changes', {'cacheChanges': []}, 'currentChangeId', 'turnCounter', 'selectMode', 'selectTarget')

const REFRESH_TIME = 2000
let on = false
let currentIndex

const start = async (username) => {
    on = true
    setTimeout(() => checkTurnIndex(username), REFRESH_TIME)
}

const checkTurnIndex = async (username) => {
    if (on) {
        await pipe.post('turnIndex', 'turn-index', {username, changeId: pipe.currentChangeId.val()}, false)
        const turnIndex = pipe.turnIndex.val().turnIndex
        if (currentIndex !== turnIndex) {
            const changes = await pipe.post('changes', 'changes', {username, changeId: pipe.currentChangeId.val()}, false)
            currentIndex = turnIndex
            if(changes.changes && changes.changes.length > 0)
                pipe.cacheChanges.change(ar => ar.push(changes))
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
        else if(pipe.selectTarget.val())
            target = pipe.selectTarget.val()
        else
            return pipe.selectMode.change({room, abilityName, abilityTarget: 'enemy'})
    }

    if(abilityTarget === 'self')
        target = room.username

    console.log(target)
    pipe.send('ability', {username, target, ability: abilityName}, false)
}

pipe.changes.onChange(o => {
    if(o && o.changes[o.changes.length - 1])
        pipe.currentChangeId.change(o.changes[0].id)
    if(o && o.uiData.turnCounter > pipe.turnCounter.val())
        pipe.turnCounter.change(o.uiData.turnCounter)
})

pipe.cacheChanges.onChange(ar => console.log(ar))

pipe.selectTarget.onChange(target => {
    if(target) {
        const select = pipe.selectMode.val()
        ability(select.room, select.abilityName, select.abilityTarget)
        pipe.selectMode.change(null)
        pipe.selectTarget.change(null)
    }
})

export default {pipe, start, stop, ability}

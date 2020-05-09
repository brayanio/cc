import Layout from './layout.js'
import PvpService from '../services/pvp.js'

const pvp = PvpService.pipe

export default (room) => Layout.DataObj(pvp.turnIndex, turnIndex => {
    let current
    if(turnIndex)
        current = room.data.turnOrder[turnIndex.turnIndex]
    if(current === room.username)
        current = 'Your'
    return Layout.El('h1', current || '... ', ' Turn')
})

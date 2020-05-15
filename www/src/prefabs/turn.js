import Layout from './layout.js'
import PvpService from '../services/pvp.js'

const pvp = PvpService.pipe

export default (room) => {
    if(!room || !room.uiData || !room.uiData.turn)
        return '...'
    return Layout.El('h1', (room.uiData.turn.yourTurn ? 'Your' : room.uiData.turn.current) + ' Turn')
}

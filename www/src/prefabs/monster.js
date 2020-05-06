import Layout from './layout.js'
import PvpService from '../services/pvp.js'

const PvpPipe = PvpService.pipe

export default (room, id) => {
    const monster = room.uiData.monsters[id]

    return Layout.Card(
        Layout.Header(
            monster.username + Layout.El('sup', monster.health)
        ),
        Layout.DataObj(PvpPipe.changes, o => {

            if(!(o && o.changes.length > 0))
                return ''

            return Layout.El('div',
                Layout.Map(o.uiData.monsters[id].effects, (effect) => (effect) ?
                    Layout.Container('p', effect.tags, `${effect.name}`) : '')
                )
            }
        )
    )
}
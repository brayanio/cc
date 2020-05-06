import Layout from './layout.js'
import RoomService from '../services/room.js'
import PvpService from '../services/pvp.js'

const PvpPipe = PvpService.pipe

export default (user) => Layout.Card(
    Layout.Header(
        user.username + Layout.El('sup', RoomService.ui().health[user.username])
    ),
    Layout.DataObj(PvpPipe.changes, o => {

        if(!(o && o.changes.length > 0))
            return ''

        return Layout.El('div',
            Layout.Map(o.uiData.effects[user.username], (effect) => (effect) ?
                Layout.Container('p', effect.tags, `${effect.name}`) : '')
            )
        }
    )
)
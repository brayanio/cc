import Layout from './layout.js'
import RoomService from '../services/room.js'
import PvpService from '../services/pvp.js'
import Prefabs from "./module.js";

const RoomPipe = RoomService.pipe
const PvpPipe = PvpService.pipe
export default (user) => {
    return Layout.El('p',
        user.username + Layout.El('sup', RoomService.ui().health[user.username]),
        Prefabs.DataObj(PvpPipe.changes, o => {

            if(!(o && o.changes.length > 0))
                return ''

            return Prefabs.El('div',
                Prefabs.Map(o.uiData.effects[user.username], (effect) => (effect) ?
                    Prefabs.Container('p', effect.tags, `${effect.name}`) : '')
                )
            }
        )
    )
}

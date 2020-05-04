import Layout from './layout.js'
import RoomService from '../services/room.js'
import PvpService from '../services/pvp.js'
import Prefabs from "./module.js";

const RoomPipe = RoomService.pipe
const PvpPipe = PvpService.pipe
export default (user) =>
    Layout.El('div', user.username,
        Prefabs.Join(
            Layout.El('p', RoomService.ui().health[user.username]),
            Prefabs.DataObj(PvpPipe.changes, o => {
                    return (o && o.changes.length > 0) ?
                        Prefabs.Map(o.uiData.effects[user.username], (effect) =>
                            Prefabs.Container('p', effect.tags, `${effect.name}`))
                        : ""
                }
            )
        )
    )


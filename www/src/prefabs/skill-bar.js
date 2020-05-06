import Layout from './layout.js'
import RoomService from '../services/room.js'
import PvpService from '../services/pvp.js'

const pvp = PvpService.pipe

export default room => Layout.DataObj(pvp.turnIndex, turnIndex => 
    Layout.If(turnIndex && room.data.turnOrder[turnIndex.turnIndex] === room.username,
        Layout.Map(room.uiData.abilityData, obj => 
            Layout.If(obj.cooldown <= 0,
                Layout.Button(obj.name, () => RoomService.ability(obj.name, obj.target))
            )
        )
    )
)
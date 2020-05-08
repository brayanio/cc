import nggt from '../nggt.js'
import Prefabs from '../prefabs/module.js'
import RoomService from '../services/room.js'
import PvpService from '../services/pvp.js'

const RoomPipe = RoomService.pipe
const pvp = PvpService.pipe
export default () => nggt.create({
    isRoot: true,
    classList: ['game'],
    template: Prefabs.DataObj(RoomPipe.room, room => {
        if(!room)
            return ''
        return Prefabs.Join(
                Prefabs.Section(
                    Prefabs.Map(room.data.userPackets, (user) =>
                        Prefabs.Player(user)
                    ),
                    room.uiData.monsters 
                        ? Prefabs.Map(Object.keys(room.uiData.monsters), id => Prefabs.Monster(room, id))
                        : ''
                ),
                Prefabs.Turn(room),
                Prefabs.SkillBar(room),
                Prefabs.ToastContainer(),
                Prefabs.Loot()
            )
        }
    ),
    run: () => {
        if (!RoomPipe.room.val()) location.hash = '#/'
    },
    cleanup: () => {
        
    }
})

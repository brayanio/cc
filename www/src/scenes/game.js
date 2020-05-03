import nggt from '../nggt.js'
import Prefabs from '../prefabs/module.js'
import GamePipe from '../pipes/game.js'
import RoomService from '../services/room.js'
import PvpService from '../services/pvp.js'

const RoomPipe = RoomService.pipe
const pvp = PvpService.pipe
export default () => nggt.create({
    isRoot: true,
    classList: ['game'],
    template: Prefabs.DataObj(RoomPipe.room, room => !!room
        ? Prefabs.Join(
            Prefabs.Section(
                Prefabs.Map(room.data.userPackets, (user) =>
                    Prefabs.Card(
                        Prefabs.Header(
                            Prefabs.Player(user)
                        )
                    )
                )
            ),
            Prefabs.DataObj(pvp.turnIndex, turnIndex =>
                Prefabs.If(turnIndex && room.data.turnOrder[turnIndex.turnIndex] === room.username,
                    Prefabs.Map(room.uiData.abilityNames, name =>
                        Prefabs.Button(name, () => RoomService.ability(name))
                    )
                )
            )
        )
        : ''
    ),
    run: () => {
        if (!RoomPipe.room.val()) location.hash = '#/'
    },
    cleanup: () => GamePipe.cleanup()
})

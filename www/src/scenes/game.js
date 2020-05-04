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
                    Prefabs.Map(room.uiData.abilityData, obj => {
                            // console.log(room.uiData, 'check me', !!room.uiData.cooldowns)
                            return Prefabs.If(obj.cooldown <= 0,
                                Prefabs.Button(obj.name, () => RoomService.ability(obj.name, obj.target))
                            )
                        }
                    )
                )
            ),
            Prefabs.DataObj(pvp.changes, o => {
                    console.log(o)
                    return (o && o.changes.length > 0) ?
                        Prefabs.Map(o.changes, (change) =>
                            Prefabs.El('p', `${change[Object.keys(change)[1]]} ${Object.keys(change)[1]} to ${Object.keys(change.modified).toString()}`))
                        : ""
                }
            )
        )
        : ''
    ),
    run: () => {
        if (!RoomPipe.room.val()) location.hash = '#/'
    },
    cleanup: () => GamePipe.cleanup()
})

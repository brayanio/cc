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
    template: Prefabs.DataObj(RoomPipe.room, room => {
        if(!room)
            return ''
        return Prefabs.Join(
                // Prefabs.El('h1', current, ' Turn'),
                Prefabs.Section(
                    Prefabs.Map(room.data.userPackets, (user) =>
                        Prefabs.Card(
                            Prefabs.Header(
                                Prefabs.Player(user)
                            )
                        )
                    )
                ),
                Prefabs.DataObj(pvp.turnIndex, turnIndex => {
                    let current
                    if(turnIndex)
                        current = room.data.turnOrder[turnIndex.turnIndex]
                    return Prefabs.If(current, Prefabs.El('h1', current, ' Turn'))
                    + Prefabs.If(turnIndex && room.data.turnOrder[turnIndex.turnIndex] === room.username,
                            Prefabs.Map(room.uiData.abilityData, obj => {
                                    // console.log(room.uiData, 'check me', !!room.uiData.cooldowns)
                                    return Prefabs.If(obj.cooldown <= 0,
                                        Prefabs.Button(obj.name, () => RoomService.ability(obj.name, obj.target))
                                    )
                                }
                            )
                        )
                    }
                ),
                Prefabs.DataObj(pvp.changes, o => {
                        console.log(o)
                        return (o && o.changes.length > 0) ?
                            Prefabs.Map(o.changes, (change) =>
                                Prefabs.Join('</br>',
                                    Prefabs.Article(
                                        Prefabs.Card(
                                            Prefabs.El('b', change.effect.name + ` &#8702; ${Object.keys(change.modified).toString()}`),
                                            Prefabs.Map(Object.keys(change.changes), changeName => Prefabs.El('p', `${change.changes[changeName]} ${changeName}`))
                                            // Prefabs.El('p', `${change[Object.keys(change.changes)} ${Object.keys(change)[2]}`)
                                        )
                                    ))
                            )
                            : ""
                    }
                )
            )
        }
    ),
    run: () => {
        if (!RoomPipe.room.val()) location.hash = '#/'
    },
    cleanup: () => GamePipe.cleanup()
})

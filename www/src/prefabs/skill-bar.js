import Layout from './layout.js'
import RoomService from '../services/room.js'
import PvpService from '../services/pvp.js'
import Assets from '../assets/map.js'

const pvp = PvpService.pipe

export default room => Layout.Container('div', ['skill-bar'],
    Layout.If(room && room.uiData.turn.yourTurn,
        Layout.Join(
            Layout.Map(room.uiData.abilityData, obj =>
                Layout.If(obj.cooldown <= 0 && !pvp.selectMode.val(),
                    Layout.Button(
                        Layout.If(Assets.skills[obj.name], `<img src="${Assets.skills[obj.name]}" width="64px"><br>`) + obj.name,
                        () => RoomService.ability(obj.name, obj.target))
                )
            ),
            Layout.If(pvp.selectMode.val, Layout.Button('Cancel', () => pvp.selectMode.change(null)))
        )
    )
)
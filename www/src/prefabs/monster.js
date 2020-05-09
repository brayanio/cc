import Layout from './layout.js'
import PvpService from '../services/pvp.js'
import Assets from '../assets/map.js'

const PvpPipe = PvpService.pipe

export default (room, id) => {
    const monster = room.uiData.monsters[id]

    return Layout.Card(
        Layout.Container('p', ['space-between', 'header'],
            Layout.Bold(monster.username),
            Layout.Container('sup',['health'], monster.health)
        ),
        `<img src=${Assets.mobs[monster.username]}>`,
        Layout.DataObj(PvpPipe.cacheChanges, ar => {

            if(!ar || ar.length === 0)
                return ''

            const o = ar[ar.length - 1]

            return Layout.El('div',
                Layout.Map(o.uiData.monsters[id].effects, (effect) => (effect) ?
                    Layout.Container('span', effect.tags, `${Assets.skills[effect.name] ? `<img src="${Assets.skills[effect.name]}" width="64px">` : (effect.name + '<br>')}`) : '')
                )
            }
        )
    )
}

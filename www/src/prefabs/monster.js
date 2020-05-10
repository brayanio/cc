import Layout from './layout.js'
import PvpService from '../services/pvp.js'
import Assets from '../assets/map.js'

const PvpPipe = PvpService.pipe

export default (room, id) => {
    const monster = room.uiData.monsters[id]

    if (monster.health <= 0)
        return ''

    return Layout.Card(
        Layout.Container('p', ['space-between', 'header'],
            Layout.Bold(monster.username),
            Layout.Container('sup', ['health'], monster.health)
        ),
        Layout.Container('div', ['mob-target'],
            Layout.DataObj(PvpPipe.selectMode, selectMode => {
                if (selectMode)
                    return Layout.Button(`<img src=${Assets.mobs[monster.username]}>`, PvpPipe.selectTarget.onevent(id))
                else return `<img src=${Assets.mobs[monster.username]}>`
            })
        ),
        Layout.DataObj(PvpPipe.cacheChanges, ar => {

                if (!ar || ar.length === 0)
                    return ''

                const o = ar[ar.length - 1]

                if (o.uiData.monsters[id])
                    return Layout.El('div',
                        Layout.Map(o.uiData.monsters[id].effects, (effect) => (effect) ?
                            Layout.Container('span', effect.tags, `${Assets.skills[effect.name] ? `<img src="${Assets.skills[effect.name]}" width="64px"><span class="duration">${effect.duration}</span>` : (effect.name + '<br>')}`) : '')
                    )
                return ''
            }
        )
    )
}

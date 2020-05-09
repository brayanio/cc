import Layout from './layout.js'
import RoomService from '../services/room.js'
import PvpService from '../services/pvp.js'
import Assets from '../assets/map.js'

const PvpPipe = PvpService.pipe

export default (user) => Layout.Card(
    Layout.Container('p', ['space-between', 'header'],
        Layout.Bold(user.username),
        Layout.Container('sup',['health'], RoomService.ui().health[user.username])
    ),
    Layout.DataObj(PvpPipe.cacheChanges, ar => {
        if(!ar || ar.length === 0)
            return ''

        const o = ar[ar.length - 1]

        const petSrc = effect => Assets.pets[effect.name]
        const skillSrc = effect => Assets.skills[effect.name]

        const src = effect => {
            if(effect.tags.includes('pet'))
                return petSrc(effect)
            return skillSrc(effect)
        }

        return Layout.El('div',
            Layout.Map(o.uiData.effects[user.username], (effect) => (effect) ?
                Layout.Container('span', effect.tags, `${src(effect) ? `<img src="${src(effect)}" width="64px">` : (effect.name + '<br>')}`) : '')
            )
        }
    )
)

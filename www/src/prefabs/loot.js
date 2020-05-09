import Layout from './layout.js'
import nggt from '../nggt.js'
import Input from './form-input.js'
import roomService from '../services/room.js'
import pvpService from '../services/pvp.js'
const pvp = pvpService.pipe
import Assets from '../assets/map.js'

const ui = ar => ar[ar.length - 1].uiData
export default () => Layout.DataObj(pvp.cacheChanges, ar => ar && ar.length > 0 && ar[ar.length - 1].uiData.winner
    ? Layout.Container('div', ['modal-bg'],
        Layout.Container('div', ['modal'],
            Layout.Section(
                Layout.Card(
                    Layout.Header(ui(ar).winner === ui(ar).team ? 'Winner' : 'You Died'),
                    Layout.Map(ui(ar).loot ? ui(ar).loot : [], loot => loot
                        ? `<img src="${Assets.skills[loot]}" width="64px">`
                        : ''
                    ),
                    Layout.Container('div', ['right'],
                        Layout.Button('Disconnect', () => roomService.leaveQue())
                    )
                )
            )
        )
    )
    : ''
)

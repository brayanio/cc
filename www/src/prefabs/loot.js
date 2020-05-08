import Layout from './layout.js'
import nggt from '../nggt.js'
import Input from './form-input.js'
import roomService from '../services/room.js'
import pvpService from '../services/pvp.js'
const pvp = pvpService.pipe

const ui = ar => ar[ar.length - 1].uiData
export default () => Layout.DataObj(pvp.cacheChanges, ar => ar && ar.length > 0 && ar[ar.length - 1].uiData.winner
    ? Layout.Container('div', ['modal-bg'],
        Layout.Container('div', ['modal'],
            Layout.Section(
                Layout.Card(
                    Layout.Header(ui(ar).winner === ui(ar).team ? 'Winner' : 'You Died'),
                    Layout.Container('div', ['right'],
                        Layout.Button('Disconnect', () => roomService.leaveQue())
                    )
                )
            )
        )
    )
    : ''
)

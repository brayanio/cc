// imports
import nggt from '../nggt.js'
import Prefabs from '../prefabs/module.js'
import RoomService from '../services/room.js'
import AccountService from '../services/account.js'
// consts
const RoomPipe = RoomService.pipe

// fns
const joinQuePVP = () => RoomService.joinQue('pvp', 2)
const joinQuePVE = () => RoomService.joinQue('pve', 1)
const joinQueBoss = () => RoomService.joinQue('raid', 2)
const leaveQue = () => RoomService.leaveQue()
const tab = nggt.dataObj('btn')

// nggt
export default () => nggt.create({
    isRoot: true,
    classList: ['lobby'],
    template: Prefabs.Join(
        Prefabs.El('nav',
            `<a href="#/"><img src="./src/assets/logo_full.PNG"></a>`,
            Prefabs.List('ul', 
                `<a href="#/character"><i>Character</i></a>`
            )
        ),
        Prefabs.El('h1', Prefabs.DataObj(AccountService.pipe.account, account => account ? account.map : '... Lobby')),
        Prefabs.Tabs(tab,
            Prefabs.Tab('btn',
                Prefabs.Section(
                    Prefabs.Card(
                        Prefabs.Header('Single Player'),
                        Prefabs.Button('Explore ' + Prefabs.DataObj(AccountService.pipe.account, account => account ? account.map : '... Lobby'), joinQuePVE)
                    ),
                    Prefabs.Card(
                        Prefabs.Header('Players versus Boss (3vBoss)'),
                        Prefabs.Button( Prefabs.DataObj(AccountService.pipe.account, account => account ? account.map : '... Lobby') + 'Boss Que', joinQueBoss)
                    ),
                    Prefabs.Card(
                        Prefabs.Header('Player versus Player (1v1)'),
                        Prefabs.Button('Enter Que', joinQuePVP)
                    )
                )
            ),
            Prefabs.Tab('loading',
                Prefabs.Container('div', ['pad_thick'],
                    Prefabs.Bold('Loading...'),
                    `<br>`,
                    Prefabs.Button('Cancel', leaveQue)
                )
            )
        ),
        Prefabs.Login()
    ),

    run: () =>
        RoomPipe.checkQue.onChange(v =>
            tab.change(v ? 'loading' : 'btn')
        ),
    cleanup: () => {
        RoomPipe.checkQue.clear()
    }
})

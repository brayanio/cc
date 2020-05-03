// imports
import nggt from '../nggt.js'
import Prefabs from '../prefabs/module.js'
import GamePipe from '../pipes/game.js'
import RoomService from '../services/room.js'

// consts
const RoomPipe = RoomService.pipe

// fns
const joinQue = () => RoomService.joinQue('Admin', 'pve', 1)
const joinQue2 = () => RoomService.joinQue('Admin2', 'pve', 2)
const leaveQue = () => RoomService.leaveQue('Admin')
const tab = nggt.dataObj('btn')

// nggt
export default () => nggt.create({
  isRoot: true,
  classList: ['lobby'],
  template: Prefabs.Article(
    Prefabs.El('h1', 'Lobby'),
    Prefabs.Card(
      Prefabs.Header('PvE'),
      Prefabs.Tabs( tab,
        Prefabs.Tab( 'btn',
          Prefabs.Button('Play Now', joinQue),
          Prefabs.Button('Player 2', joinQue2)
        ),
        Prefabs.Tab( 'loading',
          Prefabs.Container('div', ['pad_thick'],
            Prefabs.Bold('Loading...'),
            `<br>`,
            Prefabs.Button('Cancel', leaveQue)
          )
        )
      )
    )
  ),
  run: () => 
    RoomPipe.checkQue.onChange(v =>
      tab.change(v ? 'loading' : 'btn')
    ),
  cleanup: () => {
    GamePipe.cleanup()
    RoomPipe.checkQue.clear()
  }
})

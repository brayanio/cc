import nggt from '../nggt.js'
import Data from '../data/module.js'
import Prefabs from '../prefabs/module.js'
import GamePipe from '../pipes/game.js'
import RoomService from '../services/room.js'

const RoomPipe = RoomService.pipe

export default {
  nggt, Data, Prefabs, GamePipe, RoomService
}
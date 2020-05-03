import nggt from './nggt.js'
import Game from './scenes/game.js'
import Lobby from './scenes/lobby.js'
// import Scene from './scenes/SCENE_NAME.js'

nggt.router({
  '/': Lobby,
  'game': Game,
  'lobby': Lobby,
  // 'scene_name': Scene
})
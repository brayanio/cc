import nggt from './nggt.js'
import Game from './scenes/game.js'
import Lobby from './scenes/lobby.js'
import Skills from './scenes/skills.js'
// import Scene from './scenes/SCENE_NAME.js'

nggt.router({
  '/': Lobby,
  'game': Game,
  'lobby': Lobby,
  'skills': Skills,
  // 'scene_name': Scene
})

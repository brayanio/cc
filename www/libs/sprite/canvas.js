import SpritePipe from '../pipe.js'
import Rect from './rect.js'
// import gameService from '../services/game.js'

const cleanup = () => SpritePipe.canvas.change(null)

const move = (x, y) => SpritePipe.canvas.change(o => {
  o.rect.x += x || 0
  o.rect.y += y || 0
})

const focusSprite = id => {
  let s = SpritePipe.sprites.val()[id]
  if(s)
    SpritePipe.canvas.change(o => {
      o.rect.x = -s.rect.x - (s.rect.w / 2) + (SpritePipe.gameSize.w / 2)
      o.rect.y = -s.rect.y - (s.rect.h / 2) + (SpritePipe.gameSize.h / 2)
    })
}

// Focus 0 index selected sprite
// SpritePipe.coreLoops.change(ar => ar.push((dt) => {
//   if(SpritePipe.selectedSprites.val().length > 0)
//     focusSprite(SpritePipe.selectedSprites.val()[0])
// }))

// core().controls.change(obj => 
//   obj.scrollBool = {left: false, top: false, right: false, bottom: false})

// const scrollBool = () => core().controls.val().scrollBool

// core().coreLoops.change(ar => ar.push((dt) => {
//   const speed = core().scrollSpeed
//   if(scrollBool().left)
//     move(speed)
//   if(scrollBool().right)
//     move(-speed)
//   if(scrollBool().top)
//     move(0, speed)
//   if(scrollBool().bottom)
//     move(0, -speed)
// }))

// const scroll = (dir, val) => 
//   core().controls.change(obj => obj.scrollBool[dir] = val)
  
const click = (e, el) => {
  if(e.target === el) {
    const selected = SpritePipe.selectedSprites.val()
    if(selected){
      let mousePos = Rect.scaleMouse({x: e.x, y: e.y}, SpritePipe.canvas.val().rect)
      if(selected.length > 0)
        // gameService.move(mousePos)
    }
  }
}

export default {  
  cleanup,
  click,
  focusSprite, 
  move,
  // scroll
}
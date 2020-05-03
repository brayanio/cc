import nggt from '../nggt.js'
import SpritePipe from '../pipe.js'
import Rect from './rect.js'

const register = options => SpritePipe.sprites.change(obj => obj[options.id] = options)
const remove = id => SpritePipe.sprites.change(obj => { delete obj[id]; return obj })
const cleanup = () => SpritePipe.sprites.change({})

const select = id => {
  if(!SpritePipe.selectedSprites.val().includes(id))
    SpritePipe.selectedSprites.change(ar => ar.push(id))
}
const deselectAll = () => SpritePipe.selectedSprites.change([])
const deselect = id => SpritePipe.selectedSprites.change(ar => 
  ar = ar.filter(e => e !== id))

let lastSelected = []
SpritePipe.selectedSprites.onChange(sel => {
  if(sel){
    let el, i
    sel.forEach(id => {
      i = lastSelected.indexOf(id)
      if(i > -1)
        lastSelected = lastSelected.splice(i, 1)
      else {
        el = document.querySelector(`[game=${id}]`)
        if(el)
          el.classList.add('selected')
      }
    })
    lastSelected.forEach(id => {
      el = document.querySelector(`[game=${id}]`)
      if(el) 
        el.classList.remove('selected')
    })
    lastSelected = [].concat(sel)
  }
})

const update = (spriteSendable, player) => {
  const sprite = SpritePipe.sprites.val()[spriteSendable.id]
  if(!sprite) {
    const canvas = document.querySelector(`[game=canvas]`)
    const options = {
      id: spriteSendable.id,
      classList: [],
      clickable: true,
      rect: spriteSendable.rect
    }
    console.log('player', player)
    if(player.isMe){
      let index
      Object.values(player.team).find((e, i) => {
        if( e.id === spriteSendable.id ){
          index = i + 1
          return true
        }
      })
      console.log('index', index)
      options.classList.push('player', `sel${index}`)
    }else if(player.isAlly)
      options.classList.push('ally')
    register(options)
    canvas.innerHTML += Sprite(options)
    // SpritePipe.init.change(ar => ar.push(spriteSendable.id))
  } else {
    const el = document.querySelector(`[game=${spriteSendable.id}]`)
    if(player){
      if(player.isMe)
        el.classList.add('player')
      else if(player.isAlly)
        el.classList.add('ally')
    }
    SpritePipe.sprites.change(obj => obj[spriteSendable.id].rect = spriteSendable.rect)
    if(el)
      Rect.update(el, sprite.rect)
  }
}

export default {
  cleanup,
  deselect, 
  deselectAll,
  register,
  remove,
  select,
  update
}
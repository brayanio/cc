import nggt from '../nggt.js'
import SpritePipe from '../pipe.js'

const gameSize = () => SpritePipe.gameSize.val()
const canvasSize = () => SpritePipe.canvasSize.val()
const zoom = () => SpritePipe.zoom.val()
//                           val  10                ratio 2              zoom 1
const resizeW = val => Math.round(val * (canvasSize().w / gameSize().w) * zoom())
const resizeH = val => Math.round(val * (canvasSize().h / gameSize().h) * zoom())
const sizeW = val => Math.round(val / (canvasSize().w / gameSize().w) / zoom())
const sizeH = val => Math.round(val / (canvasSize().h / gameSize().h) / zoom())

const scale = rect => {
  return {
    x: resizeW(rect.x),
    w: resizeW(rect.w),
    y: resizeH(rect.y),
    h: resizeH(rect.h)
  }
}

const scaleMouse = (pos, rect) => {
  return {
    x: sizeW(pos.x -= rect.x), 
    y: sizeH(pos.y -= rect.y)
  }
}

const style = rect => {
  let r = scale(rect)
  r.x += 'px'
  r.y += 'px'
  r.w += 'px'
  r.h += 'px'
  return r
}

const update = (el, rect) => {
  let b = style(rect)
  el.style.left = b.x
  el.style.top = b.y
  el.style.width = b.w
  el.style.height = b.h
}

export default {scale, scaleMouse, style, update}

import SpritePipe from '../pipe.js'

const create = (id, fn) => SpritePipe.loops.change(obj => obj[id] = fn)
const cleanup = () => SpritePipe.loops.change({})
const remove = id => SpritePipe.loops.change(obj => delete obj[id])

const fps = val => val ? SpritePipe.fps.change(val) : SpritePipe.fps.val()

let currentLoop;
const start = () => {
  let last = new Date().getTime(),
      dt = 1000 / fps(),
      accumulator = 0
  const fn = () => {
    let now = new Date().getTime(), 
        passed = now - last
    last = now
    accumulator += passed
    while(accumulator > dt){
      SpritePipe.coreLoops.val().forEach(f => f(accumulator))
      Object.values(SpritePipe.loops.val()).forEach(f => f(accumulator))
      accumulator -= dt
    }
    currentLoop = requestAnimationFrame(fn)
  }
  currentLoop = requestAnimationFrame(fn)
}
const stop = () => currentLoop && cancelAnimationFrame(currentLoop)

export default {
  create,
  cleanup,
  remove,
  start,
  stop,
  fps
}
import nggt from '../../nggt/nggt.js'

const pipe = nggt.pipe({
  sprites: {},
  selectedSprites: [],
  gameSize: {w: 800, h: 600},
  canvasSize: {w: innerWidth: h: innerHeight},
  zoom: 1,
  fps: 60
  coreLoops: [],
  loops: {},
  scrollSpeed: DEFAULT_SCROLL_SPEED,
  canvas: {
    id: 'canvas',
    rect: {x: 0, y: 0, w: 0, h: 0}
  },
  init: []
})

add('init', (w, h, el) => {
  pipe.gameSize.change({w, h})
  if(el)
    canvasSize.change({
      w: el.getBoundingClientRect().width, 
      h: el.getBoundingClientRect().height
    })
})

export default pipe
import pipe from '../pipe.js'

const core = pipe('root', 'currentRoute', {
  cleanupAr: [], 
  runAr: []
})

core.newRoute = (routeName, route) => {
  if(core.cleanupAr.val().length)
    core.cleanupAr.val().forEach(fn => fn())
  core.cleanupAr.change([])
  core.root.change(document.createElement('main'))
  core.currentRoute.change(routeName)
  route()
}

export default core
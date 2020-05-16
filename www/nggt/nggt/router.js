import CorePipe from './pipes/core.js'

const EXIT_ANIMATION = 149 //149

const router = (routes, child) => {
  let routeName = location.hash
  if(routeName)
    routeName = routeName.substring(2)
  if(!routeName)
    routeName = '/'
  const route = routes[routeName]
  if(route && CorePipe.currentRoute.val() !== route){
    if(CorePipe.root.val())
      CorePipe.root.val().classList.add('nggt-exit')
    setTimeout(() => CorePipe.newRoute(routeName, route), CorePipe.root.val() ? EXIT_ANIMATION : 0)
  }
  if(!child) addEventListener('hashchange', () => router(routes, true))
}

export default router
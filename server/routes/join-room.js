const server = require('../utils/server.js')
const quePipe = require('../pipes/que.js')

module.exports = server.post('join-room', body => {
  console.log('[join]', body)
  const username = body.username
  const que = body.que
  const playerCount = body.playerCount
  
  let res = quePipe.joinQue(username, que, playerCount)
  return res
})
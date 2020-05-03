const server = require('../utils/server.js')
const roomPipe = require('../pipes/room.js')

module.exports = server.post('join-room', body => {
  console.log('[join]', body)
  const username = body.username
  const que = body.que
  const playerCount = body.playerCount
  
  let res = roomPipe.joinQue(username, que, playerCount)
  return res
})
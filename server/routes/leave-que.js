const server = require('../utils/server.js')
const roomPipe = require('../pipes/room.js')

module.exports = server.post('leave-que', body => {
  console.log('[leave-que]', body)
  const username = body.username
  let res = roomPipe.leaveQue(username)
  return res
})
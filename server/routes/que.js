const server = require('../utils/server.js')
const roomPipe = require('../pipes/room.js')

module.exports = server.post('que', body => {
  console.log('[que]', body)
  const username = body.username
  let res = roomPipe.checkQue(username)
  return res
})
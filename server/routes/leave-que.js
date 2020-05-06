const server = require('../utils/server.js')
const quePipe = require('../pipes/que.js')

module.exports = server.post('leave-que', body => {
  console.log('[leave-que]', body)
  const username = body.username
  let res = quePipe.leaveQue(username)
  return res
})
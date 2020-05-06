const server = require('../utils/server.js')
const quePipe = require('../pipes/que.js')

module.exports = server.post('que', body => {
  console.log('[que]', body)
  const username = body.username
  let res = quePipe.checkQue(username)
  return res
})
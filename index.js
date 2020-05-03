/* STORAGE */
const storage = require('./server/utils/storage.js')

/* SERVER */
const server = require('./server/utils/server.js')
require('./server/routes/ability.js')
require('./server/routes/join-room.js')
require('./server/routes/leave-que.js')
require('./server/routes/que.js')
require('./server/routes/turn-index.js')
require('./server/routes/changes.js')
server.serve(4200)

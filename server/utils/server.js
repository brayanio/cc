//libs
const
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  app = express(),
  cors = require('cors'),
  fs = require('fs')

//config
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })) //support x-www-form-urlencoded
app.use(bodyParser.json())
const serve = port => {
  const server = app.listen(port, () => console.log(`Server Started [${server.address().port}]`))
}

//post
const post = (path, fn) => 
  app.post('/' + path, (req, res) => {
    res.send(JSON.stringify(fn(req.body) || { error: true, msg: 'No Response.' }))
    res.end()
  })

//host www folder
const WWW = __dirname.replace('server/utils', 'www').replace('server\\utils', 'www')
const resource = path => `${WWW}/${path}`
app.use(express.static(WWW))
app.get('*', (req, res) => res.sendFile(resource('index.html')))

module.exports = { post, serve }
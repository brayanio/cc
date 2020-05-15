const fs = require('fs');
const nggt = require('./nggt.js');

const WWW = __dirname.replace('server/utils', 'storage').replace('server\\utils', 'storage')
const resource = path => `${WWW}/${path}`

let obj = {}
if(fs.existsSync(resource('storage.json')))
  obj = JSON.parse(fs.readFileSync(resource('storage.json')))
else{
  console.log('[New Storage Data]')
  if(!fs.existsSync(WWW))
    fs.mkdirSync(WWW)
  fs.writeFileSync(resource('storage.json'), '{}', 'utf8')
}
let dataobj = nggt.dataObj(obj)

const save = () => {
  const obj = dataobj.val()
  if(!fs.existsSync(WWW))
    fs.mkdirSync(WWW)
  fs.writeFileSync(resource('storage.json'), JSON.stringify(obj), 'utf8')
  console.log('[storage][saved]')
}

dataobj.onChange(obj => obj ? save() : null)
// console.log('[storage][loaded]', data.val())

module.exports = dataobj

const fs = require('fs');
const nggt = require('./nggt.js');

const WWW = __dirname.replace('server/utils', 'storage').replace('server\\utils', 'storage')
const resource = path => `${WWW}/${path}`

let data = null

const save = () => {
  const obj = data.val()
  fs.writeFileSync(resource('storage.json'), JSON.stringify(obj), 'utf8')
  // console.log('[storage][saved]', obj)
}

let exists = fs.existsSync(resource('storage.json'))
let obj = {}
if(exists)
  obj = JSON.parse(fs.readFileSync(resource('storage.json')))

let dataobj = nggt.dataObj(obj)
dataobj.onChange(obj => data ? save() : null)
data = dataobj
// console.log('[storage][loaded]', data.val())

module.exports = data

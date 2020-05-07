const target = ''
const fetchOptions = {
  method: 'POST', 
  cache: 'no-cache',
  headers: {
    'Access-Control-Allow-Origin':'*',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

function JSON_to_URLEncoded(element,key,list){
  list = list || []
  if(typeof element == 'object')
    for (let idx in element)
      JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list)
  else 
    list.push(key+'='+encodeURIComponent(element))
  return list.join('&')
}

export default async (path, body, log) => {
  if(log !== false)
    console.log('[post]', path, body)
  const options = Object.assign(fetchOptions, { body: JSON_to_URLEncoded(body) })
  let res = await fetch(target + path, options)
  let json = await res.json()
  return json
}

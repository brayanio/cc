import Pipe from './pipe.js'
import post from './post.js'
import dataObj from './data-obj.js'

export default (...data) => {
  const pipe = Pipe(...data)

  pipe.post = async (name, path, body, log) => {
    const res = await post(path, body, log)
    if(!pipe[name])
      pipe[name] = dataObj(res)
    else
      pipe[name].change(res)
    return res
  }

  pipe.send = async (path, body, log) => await post(path, body, log)

  return pipe
}
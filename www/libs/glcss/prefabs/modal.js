import Layout from './layout.js'

export default (dataObj, fn) => Layout.DataObj(dataObj, val => (val !== undefined && val !== null && val !== false) ?
  Layout.Container('div', ['gl-modal_bg'],
    Layout.Container('div', ['gl-modal'],
      fn(val)
    )
  ) : ''
)
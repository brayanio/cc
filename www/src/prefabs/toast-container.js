import Layout from './layout.js'

import PvpService from '../services/pvp.js'
const pvp = PvpService.pipe

export default () => Layout.DataObj(pvp.changes, o => (o && o.changes.length > 0) 
    ? Layout.Map(o.changes, (change) =>
            Layout.Join('</br>',
            Layout.Article(
                Layout.Card(
                    Layout.El('b', change.effect.name + ` &#8702; ${Object.keys(change.modified).toString()}`),
                    Layout.Map(Object.keys(change.changes), changeName => Layout.El('p', `${change.changes[changeName]} ${changeName}`))
                        // Prefabs.El('p', `${change[Object.keys(change.changes)} ${Object.keys(change)[2]}`)
                    )
                )
            )
        )
    : ''
)
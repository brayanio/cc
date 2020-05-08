import Layout from './layout.js'

import PvpService from '../services/pvp.js'
const pvp = PvpService.pipe

export default () => Layout.DataObj(pvp.cacheChanges, ar => (ar)
    ? Layout.Map(ar.filter((o) => o.uiData.turnCounter === pvp.turnCounter.val()), (o) =>
        Layout.Map(o.changes, (change) =>
            Layout.Join(`</br>`,
            Layout.Article(
                Layout.Card(
                    Layout.El('b', change.effect.name + ` &#8702; ${Object.keys(change.modified).map( username => username = change.modified[username].name ? change.modified[username].name : username).join('')}`),
                    Layout.Map(Object.keys(change.changes), changeName => Layout.El('p', `${change.changes[changeName]} ${changeName}`))
                        // Prefabs.El('p', `${change[Object.keys(change.changes)} ${Object.keys(change)[2]}`)
                    )
                )
            )
        )
    )
    : ''
)

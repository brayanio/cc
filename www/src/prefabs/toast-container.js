import Layout from './layout.js'
import Assets from '../assets/map.js'

import PvpService from '../services/pvp.js'

const pvp = PvpService.pipe

export default () => Layout.DataObj(pvp.cacheChanges, ar => (ar)
    ? Layout.Map(ar.filter((o) => o.uiData.turnCounter === pvp.turnCounter.val()), (o) =>
        Layout.Map(o.changes, (change) =>
            Layout.Join(`</br>`,
                Layout.Article(
                    Layout.Card(
                        Layout.If(!change.changes.mob && Assets.skills[change.effect.name], `<img src="${Assets.skills[change.effect.name]}" width="64px"><br>`),
                        Layout.If(change.changes.mob && Assets.skills[change.effect.name], `<img src="${Assets.mobs[change.effect.name]}" width="64px"><br>`),
                        Layout.El('b', change.effect.name + ` &#8702; ${Object.keys(change.modified).map(username => username = change.modified[username].name ? change.modified[username].name : username).join('')}`),
                        Layout.Map(Object.keys(change.changes), changeName => changeName !== 'mob'
                            ? Layout.El('p', `${change.changes[changeName]} ${changeName}`)
                            : ''
                        )
                        // Prefabs.El('p', `${change[Object.keys(change.changes)} ${Object.keys(change)[2]}`)
                    )
                )
            )
        )
    )
    : ''
)

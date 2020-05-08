import Layout from './layout.js'
import AccountService from '../services/room.js'

export default (dataObj) => Layout.DataObj(val => val
    ? Layout.Container('div', ['modal-bg'],
        Layout.Container('div', ['modal'],
            Layout.Card(
                Layout.Header('Login')
                
            )
        )
    )
    : ''
)
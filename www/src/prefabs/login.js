import Layout from './layout.js'
import AccountService from '../services/account.js'

export default () => Layout.DataObj(AccountService.pipe.account, (account) => !account
    ? Layout.Container('div', ['modal-bg'],
        Layout.Container('div', ['modal'],
            Layout.Card(
                Layout.Header('Login'),'yeet'
            )
        )
    )
    : ''
)

import Layout from './layout.js'
import nggt from '../nggt.js'
import Input from './form-input.js'
import AccountService from '../services/account.js'

const pipe = nggt.pipe({
    username: 'admin',
    password: 'admin',
    confirmPassword: 'admin',
})

const tab = nggt.dataObj('login');
export default () => Layout.DataObj(AccountService.pipe.account, (account) => !account
    ? Layout.Container('div', ['modal-bg'],
        Layout.Container('div', ['modal'],
            Layout.Tabs(tab,
                Layout.Tab('login',
                    Layout.El('form',
                        Layout.Header('Login'),
                        Input.Input('Username', {}, pipe.username),
                        Input.Input('Password', {type: 'password'}, pipe.password),
                        Layout.Button('Submit', () => AccountService.login(pipe.val().username, pipe.val().password)),
                        // Layout.Button('LOG', () => console.log(pipe.val())),
                        Layout.El('p', 'New Account'),
                            Layout.Button('Sign Up', () => tab.change('sign-up'))
                        )
                ),
                Layout.Tab('sign-up',
                    Layout.El('form',
                        Layout.Header('Sign Up'),
                        Input.Input('Username', {}, pipe.username),
                        Input.Input('Password', {type: 'password'}, pipe.password),
                        Input.Input('Confirm Password', {type: 'password'}, pipe.confirmPassword),
                        Layout.Button('Submit', () => pipe.val().confirmPassword === pipe.val().password ? AccountService.signup(pipe.username.val(), pipe.password.val()) : alert("Passwords don't match, dawg.")),
                        Layout.El('p', 'Already have an account?'),
                        Layout.Button('Login', () => tab.change('login'))
                    )
                )
            )
        )
    )
    : ''
)

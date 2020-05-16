// imports
import nggt from '../nggt.js'
import Prefabs from '../prefabs/module.js'
import RoomService from '../services/room.js'
import AccountService from '../services/account.js'
import Assets from '../assets/map.js'
// consts
const RoomPipe = RoomService.pipe

// nggt
export default () => nggt.create({
    isRoot: true,
    classList: ['lobby'],
    template: Prefabs.Join(
        Prefabs.El('nav',
            `<a href="#/"><img src="./src/assets/logo_full.PNG"></a>`,
            Prefabs.List('ul', 
                `<a href="#/"><i>Play</i></a>`
            )
        ),
        Prefabs.ColGrid(5, 5, 
            Prefabs.Container('div', ['pad_thick'],
                Prefabs.Article(
                    Prefabs.Card(
                        Prefabs.DataObj(AccountService.pipe.account, account => account
                            ? Prefabs.Map(Object.keys(account.classData), className => Prefabs.Join(
                                Prefabs.Header('Class: ' + className),
                                Prefabs.El('p', `Level. ${account.classData[className].level}<br>Exp. ${account.classData[className].exp}`))
                            )
                            : ''
                        ),
                        Prefabs.El('p', Prefabs.Bold('Tier I: Unholy Lifeforce') + ' +10 Maxhealth'),
                        Prefabs.El('p', Prefabs.Bold('Tier II: Ritual Summoner') + ' Pets gain +1 duration'),
                    ),
                ),
                Prefabs.Container('div', ['skill-bar'],
                Prefabs.Section(
                    Prefabs.Card(
                        Prefabs.Header('Equipped Skills'),
                        Prefabs.DataObj(AccountService.pipe.account, account => account
                            ? Prefabs.Map(account.skills, (skill) =>
                                Prefabs.Button(
                                    `<img src="${Assets.skills[skill.name]}" width="64px"><br>` + skill.name + '<br>' + skill.className,
                                    () => AccountService.unequipSkill(skill.name)))
                            : ''
                        )
                    ),
                    Prefabs.Card(
                        Prefabs.Header('Unlocked Skills'),
                        Prefabs.DataObj(AccountService.pipe.account, account => account
                            ? Prefabs.Map(account.unlockedSkills, (skill) =>
                                Prefabs.Button(
                                    `<img src="${Assets.skills[skill]}" width="64px"><br>` + skill,
                                    () => AccountService.equipSkill(skill)))
                            : ''
                        )
                    )
                )
            ),
            ),
            Prefabs.Container('div', ['inventory', 'pad_thick'],
                Prefabs.Article(
                    Prefabs.Card(
                        Prefabs.Header('Inventory'),
                        Prefabs.DataObj(AccountService.pipe.account, account => '')
                    ),
                ), 
                Prefabs.Section(
                    Prefabs.Card(
                        Prefabs.Header('Equipped'),
                        Prefabs.El('i', 'Weapon<br>Armor'),
                    ),
                    Prefabs.Card(
                        Prefabs.Header('Storage'),
                        Prefabs.El('i', '0 / 10'),
                        Prefabs.DataObj(AccountService.pipe.account, account => '')
                    )
                )
            ),
        ),
        Prefabs.Login()
    ),

    run: () => {
        if(AccountService.pipe.account.val())
            AccountService.skillUiData()
    },
    cleanup: () => {
    }
})

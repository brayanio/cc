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
        Prefabs.El('h1', 'Skills'),
        '<a href="#/">Lobby</a>',
        '<br>',
        '<br>',
        Prefabs.Container('div', ['pad_thick'],
            Prefabs.Article(
                Prefabs.Card(
                    Prefabs.Header('Class Exp'),
                    Prefabs.DataObj(AccountService.pipe.account, account => account
                        ? Prefabs.Map(Object.keys(account.classData), className => Prefabs.Bold(`${className} Lv. ${account.classData[className].level} Exp. ${account.classData[className].exp}`))
                        : ''
                    )
                ),
                '<br>',
            )
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
                )
            ),
            '<br>',
            Prefabs.Section(
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
        Prefabs.Login()
    ),

    run: () => {
        if(AccountService.pipe.account.val())
            AccountService.skillUiData()
    },
    cleanup: () => {
    }
})

const data = require('../../data/module.js')
const guid = require('../../utils/guid.js')
const storage = require('../../utils/storage.js')
const salt = require('../../utils/salt.js')

const nospace = str => str.split(' ').join('')

module.exports = class {
    constructor(username, not_the_password) {
        this.username = username
        this.gold = 0
        const loadedUser = storage.val()[username]
        if(loadedUser && !not_the_password && loadedUser.password)
            this.not_the_password = loadedUser.password
        this.init()
        if (not_the_password) {
            this.not_the_password = salt(not_the_password)
            this.save()
        }
    }

    save(){
        storage.change(o => o.users[this.username] = {
            username: this.username,
            not_the_password: this.not_the_password,
            skills: [],
            inventory: [],
            classData: {},
            weapon: nospace(this.weapon.name),
            armor: nospace(this.armor.name),
            gold: this.gold
        })
    }

    init(){
        let user
        if(this.not_the_password)
            user = storage.val().users[this.username]
        if(!user)
            user = {
                armor: 'Breastplate',
                weapon: 'BattleAxe',
                skills: ['Skeleton', 'Fatigue']
            }
        this.armor = data().Armor[user.armor]
        this.weapon = data().Weapon[user.weapon]
        this.skills = user.skills.map(s => data().Ability[s])
        this.stats = {
            health: this.armor.hp + 0,
            attack: this.weapon.attack + 0,
            speed: this.armor.speed,
            effects: [],
            cooldowns: {}
        }
        //remove passive and add to stats.effects
        this.skills.forEach((skill) =>
            skill.effects = skill.effects.filter((effect) => {
                const bool = !effect.tags.includes('passive')
                if (!bool) {
                    effect.birth = {username, target: username}
                    effect.ability = skill.name
                    this.stats.effects.push(effect)
                }
                return bool
            }))
    }

    packet() {
        return {
            username: this.username,
            weapon: this.weapon,
            armor: this.armor
        }
    }

    joinQue(name) {
        this.queName = name
    }

    joinRoom(id) {
        this.roomId = id
        this.queName = null
        delete this.queName
    }

    disconnect() {
        delete this.queName
        delete this.roomId
    }
}
